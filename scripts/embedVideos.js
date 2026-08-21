const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

// Helper to load env variables from .env or .env.local manually
function loadEnv() {
  const envPaths = [
    path.join(__dirname, '../.env.local'),
    path.join(__dirname, '../.env')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
            value = value.substring(1, value.length - 1);
          }
          if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
            value = value.substring(1, value.length - 1);
          }
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  }
}

loadEnv();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

async function main() {
  if (!GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is not defined in .env or .env.local.');
    process.exit(1);
  }

  const videosPath = path.join(__dirname, '../src/data/videos.json');
  const outputPath = path.join(__dirname, '../src/data/nptel-vectors.json');

  if (!fs.existsSync(videosPath)) {
    console.error(`Videos data file not found at ${videosPath}. Please run scripts/fetchVideos.js first.`);
    process.exit(1);
  }

  let videos = [];
  try {
    videos = JSON.parse(fs.readFileSync(videosPath, 'utf8'));
  } catch (err) {
    console.error(`Failed to parse videos database: ${err.message}`);
    process.exit(1);
  }

  if (videos.length === 0) {
    console.log('No videos found in videos.json. Nothing to embed.');
    process.exit(0);
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const vectors = [];

  // Load existing vectors to skip duplicates
  let existingVectorsMap = new Map();
  if (fs.existsSync(outputPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      existing.forEach(v => {
        if (v.videoId && Array.isArray(v.embedding)) {
          existingVectorsMap.set(v.videoId, v.embedding);
          vectors.push(v); // Keep existing vectors in memory
        }
      });
      console.log(`Loaded ${existingVectorsMap.size} existing vectors.`);
    } catch (e) {
      console.log('Failed to parse existing vectors file, will rebuild all.');
    }
  }

  // Filter videos that need embedding
  const pendingVideos = videos.filter(v => !existingVectorsMap.has(v.videoId));
  console.log(`Found ${pendingVideos.length} videos needing embeddings.`);

  if (pendingVideos.length === 0) {
    console.log('All videos are already embedded. Saving current database...');
    fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2), 'utf8');
    console.log('Database is up to date.');
    process.exit(0);
  }

  // Under free tier, limit is 15 requests per minute.
  // 60 seconds / 14 requests = ~4.3 seconds delay to guarantee no 429s.
  const DELAY_MS = 4300;
  console.log(`Starting individual embedding generation with rate-limit protection (${DELAY_MS}ms delay)...`);

  for (let i = 0; i < pendingVideos.length; i++) {
    const video = pendingVideos[i];
    const textToEmbed = `${video.title || ''}\n\n${video.description || ''}`.trim() || 'No title';

    console.log(`[${i + 1}/${pendingVideos.length}] Embedding: "${video.title.substring(0, 50)}..."`);

    let success = false;
    let attempts = 0;

    while (!success && attempts < 3) {
      attempts++;
      try {
        const res = await ai.models.embedContent({
          model: 'gemini-embedding-2',
          contents: textToEmbed
        });

        // gemini-embedding-2 returns embeddings array
        const values = res.embeddings?.[0]?.values || res.embedding?.values;
        if (values && Array.isArray(values)) {
          vectors.push({
            videoId: video.videoId,
            embedding: values
          });
          success = true;
        } else {
          console.error(`Failed to parse embedding values for video ${video.videoId}. Structure:`, JSON.stringify(res));
          break; // Don't retry parsing failure
        }
      } catch (err) {
        console.error(`Attempt ${attempts} failed for video ${video.videoId}: ${err.message}`);
        if (attempts < 3) {
          console.log('Waiting 10 seconds before retrying...');
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      }
    }

    if (success) {
      // Save checkpoint after every successful embedding
      try {
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2), 'utf8');
      } catch (saveErr) {
        console.error(`Failed to save checkpoint: ${saveErr.message}`);
      }
    } else {
      console.error(`Failed to embed video ${video.videoId} after 3 attempts. Skipping.`);
    }

    // Rate-limit safety delay
    if (i < pendingVideos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log(`\nSuccess! Vector database now contains ${vectors.length} video records.`);
}

main().catch(err => {
  console.error('Fatal error running embedding script:', err);
  process.exit(1);
});
