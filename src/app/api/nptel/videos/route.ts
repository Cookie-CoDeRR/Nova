import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'src/data/videos.json');
  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    const data = await fs.promises.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error: any) {
    console.error('Error reading videos:', error);
    return NextResponse.json(
      { error: 'Failed to read videos', details: error.message },
      { status: 500 }
    );
  }
}
