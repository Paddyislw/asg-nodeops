import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ANALYTICS_FILE_PATH = path.join(process.cwd(), 'data', 'bridge-analytics.json');

export async function GET() {
  try {
    const data = fs.readFileSync(ANALYTICS_FILE_PATH, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading analytics file:', error);
    return NextResponse.json({ error: 'Failed to read analytics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analytics } = body;
    
    if (!analytics) {
      return NextResponse.json({ error: 'Analytics data is required' }, { status: 400 });
    }

    // Read current data
    let currentData;
    try {
      const existing = fs.readFileSync(ANALYTICS_FILE_PATH, 'utf8');
      currentData = JSON.parse(existing);
    } catch {
      // If file doesn't exist or is corrupted, create default structure
      currentData = {
        lastUpdated: null,
        analytics: {
          totalAmount: 0,
          totalTxns: 0,
          avgTime: 0,
          txns: []
        },
        history: []
      };
    }

    // Update with new analytics data
    const updatedData = {
      ...currentData,
      lastUpdated: new Date().toISOString(),
      analytics: analytics,
      history: [
        ...currentData.history,
        {
          timestamp: new Date().toISOString(),
          analytics: analytics
        }
      ].slice(-10) // Keep only last 10 entries
    };

    // Write back to file
    fs.writeFileSync(ANALYTICS_FILE_PATH, JSON.stringify(updatedData, null, 2));
    
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error updating analytics file:', error);
    return NextResponse.json({ error: 'Failed to update analytics' }, { status: 500 });
  }
}