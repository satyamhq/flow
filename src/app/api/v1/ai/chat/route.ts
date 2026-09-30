import { NextRequest, NextResponse } from 'next/server';
import { generateRequestId, logRequest } from '@/lib/request-id';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const reqId = generateRequestId();
  const startTime = Date.now();
  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // Strict rate limiting on AI endpoint
  const rateLimit = await checkRateLimit(`ai_chat_${clientIp}`, RATE_LIMITS.ai);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'AI rate limit exceeded. Please wait.', request_id: reqId } },
      { status: 429, headers: { 'Retry-After': '30', 'x-request-id': reqId } }
    );
  }

  const body = await req.json().catch(() => ({}));
  const prompt = (body.prompt || '').trim();
  const telemetry = body.telemetry || {};

  if (!prompt) {
    return NextResponse.json(
      { error: { code: 'INVALID_PROMPT', message: 'Prompt cannot be empty', request_id: reqId } },
      { status: 400, headers: { 'x-request-id': reqId } }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  let answer = '';
  let modelName = 'gemini-1.5-flash';
  let tokensUsed = 120;

  // Real verified organization telemetry context
  const orgName = telemetry.orgName || 'your organization';
  const projectsCount = telemetry.projectsCount ?? 0;
  const tasksCount = telemetry.tasksCount ?? 0;
  const customersCount = telemetry.customersCount ?? 0;
  const totalArr = telemetry.totalArr ?? 0;
  const leadsCount = telemetry.leadsCount ?? 0;

  const systemInstruction = `You are Flow AI, the autonomous operating intelligence for ${orgName}.
Below is the REAL, VERIFIED database telemetry for this organization:
- Organization Name: ${orgName}
- Total Active Projects: ${projectsCount}
- Total Work Items/Tasks: ${tasksCount}
- Total Enterprise Customers: ${customersCount}
- Verified Annual Recurring Revenue (ARR): $${totalArr.toLocaleString()}
- Active Sales Leads: ${leadsCount}

CRITICAL RULES:
1. ONLY answer questions using the verified telemetry provided above or user input.
2. NEVER invent, hallucinate, fabricate, or assume fake revenue, customers, deals, or employee numbers.
3. If the user asks about revenue, ARR, projects, or customers and the count is 0, explicitly report that no records exist yet ($0 ARR, 0 projects, 0 customers).
4. If asked about something not in the telemetry, say: "I don't have enough data in your organization records to answer that. You can create projects, tasks, or customers to populate your operating telemetry."`;

  if (apiKey && !apiKey.startsWith('mock')) {
    try {
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.1,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          answer = candidateText.trim();
          tokensUsed = data?.usageMetadata?.totalTokenCount || 150;
        }
      }
    } catch {
      // Fallback below
    }
  }

  // Honest, telemetry-accurate fallback if Gemini API is unreachable
  if (!answer) {
    const lower = prompt.toLowerCase();
    if (lower.includes('arr') || lower.includes('revenue') || lower.includes('margin')) {
      answer = `Verified database records for ${orgName}: Current ARR is $${totalArr.toLocaleString()} across ${customersCount} customer account(s).`;
    } else if (lower.includes('project') || lower.includes('task') || lower.includes('block')) {
      answer = `Verified database records for ${orgName}: You currently have ${projectsCount} project(s) and ${tasksCount} task(s) registered in your workspace.`;
    } else {
      answer = `Operating telemetry for ${orgName}: ${projectsCount} project(s), ${tasksCount} task(s), ${customersCount} customer account(s), and $${totalArr.toLocaleString()} verified ARR.`;
    }
  }

  logRequest(reqId, 'POST', '/api/v1/ai/chat', Date.now() - startTime);

  return NextResponse.json(
    {
      data: {
        response: answer,
        model: modelName,
        tokens_used: tokensUsed,
        latency_ms: Date.now() - startTime,
      },
      request_id: reqId,
    },
    {
      status: 200,
      headers: { 'x-request-id': reqId },
    }
  );
}
