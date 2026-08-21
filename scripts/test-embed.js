const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

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
          if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') value = value.substring(1, value.length - 1);
          if (!process.env[key]) process.env[key] = value;
        }
      });
    }
  }
}
loadEnv();

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

async function run() {
  const ai = new GoogleGenAI({ apiKey });
  try {
    const res = await ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: 'hello world'
    });
    console.log('Embedding Response:', JSON.stringify(res, null, 2));
  } catch (e) {
    console.error('Error:', e);
  }
}
run();
