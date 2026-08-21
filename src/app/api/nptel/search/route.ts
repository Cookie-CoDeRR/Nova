import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

function getApiKey(): string {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    return process.env.GEMINI_API_KEY;
  }
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY && process.env.NEXT_PUBLIC_GEMINI_API_KEY.trim() !== '') {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }
  return '';
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  
  const len = Math.min(vecA.length, vecB.length);
  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const searchType = searchParams.get('type') || 'keyword'; // 'keyword' or 'semantic'

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const videosPath = path.join(process.cwd(), 'src/data/videos.json');
    const vectorsPath = path.join(process.cwd(), 'src/data/nptel-vectors.json');

    if (!fs.existsSync(videosPath)) {
      return NextResponse.json({ error: 'NPTEL video data is not yet fetched.' }, { status: 400 });
    }

    const videosData = JSON.parse(await fs.promises.readFile(videosPath, 'utf8'));

    // Option 1: Semantic Search
    if (searchType === 'semantic') {
      const apiKey = getApiKey();
      
      if (!apiKey) {
        return NextResponse.json(
          { error: 'GEMINI_API_KEY is not configured for semantic search.' },
          { status: 500 }
        );
      }

      if (!fs.existsSync(vectorsPath)) {
        // Fallback gracefully to keyword search if vectors are not generated yet
        console.warn('Vector store not found. Falling back to keyword search.');
        return runKeywordSearch(videosData, query, true);
      }

      const vectorsData = JSON.parse(await fs.promises.readFile(vectorsPath, 'utf8'));

      // Generate embedding for query
      const ai = new GoogleGenAI({ apiKey });
      const embedResponse = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: query,
      });

      const resData = embedResponse as any;
      const queryVector = resData.embedding?.values || resData.embeddings?.[0]?.values;
      if (!queryVector || !Array.isArray(queryVector)) {
        return NextResponse.json(
          { error: 'Failed to generate query embedding.' },
          { status: 500 }
        );
      }

      // Calculate similarities
      const scoredVideos = vectorsData.map((item: any) => {
        // Find matching video metadata
        const videoMeta = videosData.find((v: any) => v.videoId === item.videoId);
        if (!videoMeta) return null;

        const score = cosineSimilarity(queryVector, item.embedding);
        return {
          ...videoMeta,
          score: score
        };
      }).filter(Boolean);

      // Sort by similarity descending
      scoredVideos.sort((a: any, b: any) => b.score - a.score);

      // Filter by a threshold (e.g. > 0.3) or just return top 10
      const topK = scoredVideos.slice(0, 12);
      
      return NextResponse.json(topK, {
        headers: { 'x-search-mode': 'semantic' }
      });
    }

    // Option 2: Keyword Search (default)
    return runKeywordSearch(videosData, query, false);

  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    );
  }
}

function runKeywordSearch(videos: any[], query: string, wasFallback: boolean) {
  const lowercaseQuery = query.toLowerCase();
  
  const matches = videos.filter((video: any) => {
    const titleMatch = (video.title || '').toLowerCase().includes(lowercaseQuery);
    const descMatch = (video.description || '').toLowerCase().includes(lowercaseQuery);
    const courseMatch = (video.courseName || '').toLowerCase().includes(lowercaseQuery);
    return titleMatch || descMatch || courseMatch;
  });

  return NextResponse.json(matches, {
    headers: { 'x-search-mode': 'keyword', ...(wasFallback && { 'x-search-fallback': 'true' }) }
  });
}
