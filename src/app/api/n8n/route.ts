import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ message: 'N8N Proxy is reachable' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ...payload } = body;

    let targetUrl = '';

    // Route based on action type
    if (action === 'start') {
      targetUrl = process.env.N8N_WEBHOOK_START_URL || '';
    } else if (action === 'validate') {
      targetUrl = process.env.N8N_WEBHOOK_VALIDATE_URL || '';
    } else if (action === 'research') {
      targetUrl = process.env.N8N_WEBHOOK_RESEARCH_URL || '';
    } else if (action === 'save_to_drive') {
      targetUrl = process.env.N8N_WEBHOOK_DRIVE_URL || '';
    } else if (action === 'regen') {
      targetUrl = process.env.N8N_WEBHOOK_REGEN_URL || process.env.N8N_WEBHOOK_MODIFY_ARTICLE_URL || '';
    } else if (action === 'modify_plan') {
      targetUrl = process.env.N8N_WEBHOOK_MODIFY_PLAN_URL || '';
    } else if (action === 'modify_article') {
      targetUrl = process.env.N8N_WEBHOOK_MODIFY_ARTICLE_URL || '';
    } else if (action === 'translate') {
      targetUrl = process.env.N8N_WEBHOOK_TRANSLATE_URL || '';
    } else if (action === 'regenerate_axis') {
      targetUrl = process.env.N8N_WEBHOOK_REGEN_AXIS_URL || '';
    }

    if (!targetUrl || targetUrl.includes('placeholder')) {
      console.warn(`[N8N Proxy] Missing or placeholder URL for action: ${action}`);
      return NextResponse.json(
        { message: 'Configuration de webhook manquante' },
        { status: 503 }
      );
    }

    // Forward the request to n8n
    console.log(`[N8N Proxy] Triggering ${action} at ${targetUrl}`);
    const startTime = Date.now();
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const duration = Date.now() - startTime;
    console.log(`[N8N Proxy] ${action} responded in ${duration}ms`);

    if (!response.ok) {
      console.error(`[N8N Proxy] Error from N8N: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { message: 'Erreur lors de la communication avec n8n' },
        { status: response.status }
      );
    }

    // n8n webhooks usually return 200/202 text or json
    const responseData = await response.text(); 
    let jsonData = {};
    try {
        jsonData = JSON.parse(responseData);
    } catch {
        jsonData = { message: responseData };
    }

    return NextResponse.json(jsonData);

  } catch (error) {
    console.error('[N8N Proxy] Internal Error:', error);
    return NextResponse.json(
      { 
        message: 'Internal Server Error', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
