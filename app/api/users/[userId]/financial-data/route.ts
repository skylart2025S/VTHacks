// app/api/users/[userId]/financial-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

interface FinancialData {
  current_balance: number;
  transactions: Array<{
    vendor: string;
    cash_flow: number;
  }>;
  investments: Array<{
    symbol: string | null;
    quantity: number;
    current_value: number;
  }>;
  metadata?: {
    user_id: string;
    generated_at: string;
    item_id: string;
  };
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔄 Generating financial data for user: ${userId}`);

    // Generate unique filename for this user
    const timestamp = Date.now();
    const filename = `user_${userId}_${timestamp}_financial_data.json`;
    const filepath = path.join(process.cwd(), 'api', filename);

    // Call Python script to generate Plaid sandbox data
    const pythonScript = path.join(process.cwd(), 'api', 'generate_user_financial_data.py');
    
    return new Promise<NextResponse>((resolve) => {
      const pythonProcess = spawn('python', [pythonScript, userId, filepath], {
        cwd: path.join(process.cwd(), 'api'),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
        console.log(`Python output: ${data.toString()}`);
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(`Python error: ${data.toString()}`);
      });

      pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code: ${code}`);
        
        if (code === 0) {
          // Read the generated file
          try {
            const financialData: FinancialData = JSON.parse(fs.readFileSync(filepath, 'utf8'));

            // Clean up the temporary file
            fs.unlinkSync(filepath);

            resolve(NextResponse.json({
              success: true,
              data: financialData,
              message: `Financial data generated successfully for user ${userId}`
            }));
          } catch (fileError) {
            console.error('Error reading generated file:', fileError);
            resolve(NextResponse.json(
              { error: 'Failed to read generated financial data' },
              { status: 500 }
            ));
          }
        } else {
          console.error('Python script failed:', errorOutput);
          resolve(NextResponse.json(
            { error: `Failed to generate financial data: ${errorOutput}` },
            { status: 500 }
          ));
        }
      });
    });

  } catch (error) {
    console.error('Error generating financial data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would fetch from database
    // For now, we'll return a message indicating the endpoint exists
    return NextResponse.json({
      message: `Financial data endpoint for user ${userId}`,
      note: 'Use POST to generate new financial data'
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
