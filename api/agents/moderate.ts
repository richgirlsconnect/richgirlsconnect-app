// Helper to query Groq free API with fallback
async function callGroq({
  systemPrompt,
  userPrompt,
}: {
  systemPrompt: string;
  userPrompt: string;
}) {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (groqApiKey && !groqApiKey.includes('your_groq_api_key')) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          try {
            return JSON.parse(content);
          } catch {
            const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleaned);
          }
        }
      }
    } catch (err) {
      console.warn('Groq API Moderation error:', err);
    }
  }
  return null;
}

export default async function handler(req: any, res: any) {
  try {
    const { text = '', imageUrl, senderId = 'client', matchId } = req.body || {};

    const systemPrompt = `You are the RichConnect Event-Based AI Moderation Agent.
You are triggered ONLY when a message or image is sent.
Evaluate the content for an ultra-luxury private matchmaking platform.
Check for:
1. Toxicity, disrespect, aggression, or harassment
2. Solicitations, wire transfer / crypto scams, financial exploitation
3. Unsanctioned off-platform contact sharing before verification (e.g. unsolicited telegram/crypto links)
4. Explicit, non-consensual, or inappropriate imagery/text

Return strict JSON:
{
  "allowed": boolean,
  "severity": "safe" | "warning" | "blocked",
  "flags": ["string"],
  "reason": "string",
  "moderatedAt": "string"
}`;

    const userPrompt = `Message: "${text}"
Has Image Attached: ${!!imageUrl}
Image URL: ${imageUrl || 'None'}
Sender: ${senderId}
Match ID: ${matchId || 'General'}`;

    let evaluation = await callGroq({ systemPrompt, userPrompt });

    if (!evaluation) {
      // Fast heuristic safety check
      const lower = text.toLowerCase();
      const hasBadKeywords = /crypto|send money|wire transfer|western union|cashapp me|scam/i.test(lower);
      const isToxic = /threat|hate|fuck you|kill/i.test(lower);

      if (isToxic) {
        evaluation = {
          allowed: false,
          severity: 'blocked',
          flags: ['Toxicity Violation', 'Harassment Policy'],
          reason: 'Aggressive or prohibited vocabulary intercepted.',
          moderatedAt: new Date().toISOString()
        };
      } else if (hasBadKeywords) {
        evaluation = {
          allowed: false,
          severity: 'warning',
          flags: ['Financial Solicitation', 'Scam Protection'],
          reason: 'Financial transfer requests are restricted in private client chats.',
          moderatedAt: new Date().toISOString()
        };
      } else {
        evaluation = {
          allowed: true,
          severity: 'safe',
          flags: [],
          reason: 'Content fully compliant with RichConnect luxury communication standards.',
          moderatedAt: new Date().toISOString()
        };
      }
    }

    return res.status(200).json({
      success: true,
      agent: 'Moderation Agent',
      trigger: imageUrl ? 'IMAGE_SENT' : 'MESSAGE_SENT',
      executionModel: 'Event-Driven (Zero Idle Cost)',
      provider: process.env.GROQ_API_KEY ? 'Groq Llama-3.3-70b-versatile (Free)' : 'Built-in Real-Time Safety Rules',
      evaluation
    });
  } catch (error: any) {
    console.error('Moderation handler error:', error);
    return res.status(500).json({ error: 'Failed to execute moderation agent', details: error.message });
  }
}
