const fs = require('fs');
const path = require('path');

// Helper to load env variables from .env or .env.local manually to avoid dependencies
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
          // Remove wrapping quotes if any
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

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchPlaylistVideos(playlistId, courseName) {
  if (!YOUTUBE_API_KEY) {
    console.error('ERROR: YOUTUBE_API_KEY is not defined in .env or .env.local.');
    return [];
  }

  let videos = [];
  let nextPageToken = '';
  let hasNextPage = true;
  let pageCount = 0;

  console.log(`\nFetching videos for playlist: ${courseName} (${playlistId})...`);

  while (hasNextPage) {
    pageCount++;
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
    
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          const snippet = item.snippet;
          if (!snippet) continue;
          
          const videoId = snippet.resourceId?.videoId;
          if (!videoId) continue;

          // Thumbnail selection: high -> default
          const thumbnail = snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '';

          videos.push({
            title: snippet.title || '',
            description: snippet.description || '',
            videoId: videoId,
            thumbnail: thumbnail,
            publishedAt: snippet.publishedAt || '',
            url: `https://www.youtube.com/watch?v=${videoId}`,
            playlistId: playlistId,
            courseName: courseName
          });
        }
      }

      nextPageToken = data.nextPageToken || '';
      hasNextPage = !!nextPageToken;

      // Soft safety throttle
      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (err) {
      console.error(`Failed to fetch page ${pageCount} for playlist ${playlistId}: ${err.message}`);
      hasNextPage = false; // Break loop on error for this playlist
    }
  }

  console.log(`Fetched ${videos.length} videos from playlist ${playlistId}.`);
  return videos;
}

async function main() {
  const playlistsPath = path.join(__dirname, '../src/data/nptel-playlists.json');
  const outputPath = path.join(__dirname, '../src/data/videos.json');

  if (!fs.existsSync(playlistsPath)) {
    console.error(`Playlists configuration file not found at ${playlistsPath}.`);
    process.exit(1);
  }

  let playlists = [];
  try {
    playlists = JSON.parse(fs.readFileSync(playlistsPath, 'utf8'));
  } catch (err) {
    console.error(`Failed to parse playlists config: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(playlists) || playlists.length === 0) {
    console.log('No playlists configured in nptel-playlists.json.');
    process.exit(0);
  }

  let allVideos = [];

  for (const playlist of playlists) {
    try {
      const vids = await fetchPlaylistVideos(playlist.id, playlist.courseName);
      allVideos.push(...vids);
    } catch (err) {
      console.error(`Unhandled error fetching playlist ${playlist.id}: ${err.message}`);
    }
  }

  // Ensure target folder exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(allVideos, null, 2), 'utf8');
  console.log(`\nSuccess! Saved a total of ${allVideos.length} videos to ${outputPath}.`);
}

main().catch(err => {
  console.error('Fatal error running fetch script:', err);
  process.exit(1);
});
