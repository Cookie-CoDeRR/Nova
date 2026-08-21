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
          vectors.push(v); // Keep existing vectors
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
    // Ensure file exists just in case
    fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2), 'utf8');
    console.log('Database is up to date.');
    process.exit(0);
  }

  const BATCH_SIZE = 50;
  console.log(`Starting batch embeddings generation (Batch Size: ${BATCH_SIZE})...`);

  for (let i = 0; i < pendingVideos.length; i += BATCH_SIZE) {
    const batch = pendingVideos.slice(i, i + BATCH_SIZE);
    console.log(`\nProcessing batch [${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(pendingVideos.length / BATCH_SIZE)}] (${batch.length} videos)...`);

    const batchTexts = batch.map(video => {
      return `${video.title || ''}\n\n${video.description || ''}`.trim() || 'No title';
    });

    try {
      const res = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: batchTexts
      });

      const embeddings = res.embeddings;
      if (embeddings && Array.isArray(embeddings)) {
        embeddings.forEach((emb, index) => {
          const video = batch[index];
          if (emb && Array.isArray(emb.values)) {
            vectors.push({
              videoId: video.videoId,
              embedding: emb.values
            });
          } else {
            console.error(`Failed to extract values for index ${index} (${video.title})`);
          }
        });
        console.log(`Successfully embedded batch of ${batch.length} videos.`);
      } else {
        console.error('Failed to get embeddings array in response structure:', JSON.stringify(res));
      }
    } catch (err) {
      console.error(`Batch processing failed: ${err.message}`);
      console.log('Retrying batch in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      try {
        const res = await ai.models.embedContent({
          model: 'gemini-embedding-2',
          contents: batchTexts
        });
        const embeddings = res.embeddings;
        if (embeddings && Array.isArray(embeddings)) {
          embeddings.forEach((emb, index) => {
            const video = batch[index];
            if (emb && Array.isArray(emb.values)) {
              vectors.push({
                videoId: video.videoId,
                embedding: emb.values
              });
            }
          });
          console.log(`Successfully embedded batch on retry.`);
        }
      } catch (retryErr) {
        console.error(`Retry failed: ${retryErr.message}. Skipping this batch.`);
      }
    }

    // Save vectors database checkpoint after each batch
    try {
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2), 'utf8');
      console.log(`Saved checkpoint: ${vectors.length} total vectors stored.`);
    } catch (saveErr) {
      console.error(`Failed to save checkpoint: ${saveErr.message}`);
    }

    // Rate-limit throttle (3 seconds sleep between batches to avoid 429)
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log(`\nSuccess! Vector database now contains ${vectors.length} video records.`);
}

main().catch(err => {
  console.error('Fatal error running embedding script:', err);
  process.exit(1);
});
