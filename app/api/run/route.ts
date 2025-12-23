import { NextRequest, NextResponse } from 'next/server';
import { RunRequest, RunResponse, AgentRun } from '@/types';
import { executeGraph } from '@/lib/executor';
import { checkRateLimit, cleanupRateLimits } from '@/lib/rate-limiter';
import { generateId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    // Cleanup old rate limit entries
    cleanupRateLimits();

    // Get session ID from headers or generate one
    const sessionId = request.headers.get('x-session-id') || 
                     request.headers.get('x-forwarded-for') || 
                     'default-session';

    // Check rate limit
    const rateLimit = checkRateLimit(sessionId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute and try again.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': '60',
          }
        }
      );
    }

    const body: RunRequest = await request.json();
    const { graph, mode, apiKey, model } = body;

    // Validate request
    if (!graph) {
      return NextResponse.json(
        { error: 'Graph is required' },
        { status: 400 }
      );
    }

    if (!graph.nodes || graph.nodes.length === 0) {
      return NextResponse.json(
        { error: 'Graph must have at least one node' },
        { status: 400 }
      );
    }

    if (mode === 'byok' && !apiKey) {
      return NextResponse.json(
        { error: 'API key is required for BYOK mode' },
        { status: 400 }
      );
    }

    // Execute the graph
    const run = await executeGraph(graph, mode);

    // Return the run result
    return NextResponse.json(run, {
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      }
    });

  } catch (error: any) {
    console.error('Error executing agent:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while executing the agent' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Agent execution API. Use POST to run an agent.' },
    { status: 200 }
  );
}

