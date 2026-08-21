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

  console.log(`Starting embeddings generation for ${videos.length} videos...`);
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const vectors = [];

  // Check if we already have some vectors to avoid rebuilding them all (optional checkpointing)
  let existingVectorsMap = new Map();
  if (fs.existsSync(outputPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      existing.forEach(v => {
        if (v.videoId && Array.isArray(v.embedding)) {
          existingVectorsMap.set(v.videoId, v.embedding);
        }
      });
      console.log(`Found ${existingVectorsMap.size} existing vectors. Will skip embedding these.`);
    } catch (e) {
      console.log('Failed to parse existing vectors file, will rebuild all.');
    }
  }

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    
    // Check if vector already exists to save quota and speed up runs
    if (existingVectorsMap.has(video.videoId)) {
      vectors.push({
        videoId: video.videoId,
        embedding: existingVectorsMap.get(video.videoId)
      });
      continue;
    }

    const textToEmbed = `${video.title || ''}\n\n${video.description || ''}`.trim();
    if (!textToEmbed) {
      console.warn(`Warning: Video ${video.videoId} has no title or description. Skipping embedding.`);
      continue;
    }

    console.log(`[${i + 1}/${videos.length}] Embedding: ${video.title.substring(0, 50)}...`);

    try {
      const res = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: textToEmbed
      });

      const values = res.embedding?.values;
      if (values && Array.isArray(values)) {
        vectors.push({
          videoId: video.videoId,
          embedding: values
        });
      } else {
        console.error(`Failed to extract embedding values for video ${video.videoId}`);
      }
    } catch (err) {
      console.error(`Failed to embed video ${video.videoId}: ${err.message}`);
      // Sleep a bit and retry once
      console.log('Retrying in 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      try {
        const res = await ai.models.embedContent({
          model: 'text-embedding-004',
          contents: textToEmbed
        });
        const values = res.embedding?.values;
        if (values && Array.isArray(values)) {
          vectors.push({
            videoId: video.videoId,
            embedding: values
          });
        }
      } catch (retryErr) {
        console.error(`Retry failed: ${retryErr.message}. Skipping this video.`);
      }
    }

    // Small rate-limit delay
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  // Ensure target folder exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2), 'utf8');
  console.log(`\nSuccess! Saved ${vectors.length} vectors to ${outputPath}.`);
}

main().catch(err => {
  console.error('Fatal error running embedding script:', err);
  process.exit(1);
});
