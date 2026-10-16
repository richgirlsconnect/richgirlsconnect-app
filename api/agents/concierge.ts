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
          temperature: 0.5,
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
      console.warn('Groq API Concierge error:', err);
    }
  }
  return null;
}

export default async function handler(req: any, res: any) {
  try {
    const { query = '', partnerName = 'Partner', context = {}, mode = 'wingman' } = req.body || {};

    const systemPrompt = `You are the RichConnect AI Private Concierge Agent.
You are triggered ONLY when a VIP member chats with the AI, requests wingman advice, or seeks onboarding assistance.
You specialize in:
1. Cross-cultural romance coaching for ambitious high-net-worth African gentlemen courting European/American heiresses and Daughters of Heads of State.
2. World-class rendezvous suggestions (Mayfair London, Dubai Marina, Victoria Island Lagos, Monaco, Paris, Zurich).
3. Sophisticated, witty, high-status conversational lines that show supreme confidence without being arrogant or needy.

Return strict JSON:
{
  "reply": "string (warm, eloquent, high-value advice or suggestion)",
  "icebreakers": ["string", "string"],
  "recommendedVenue": "string (e.g. Oswald's Mayfair, Zuma Dubai, Nok by Alara)",
  "etiquetteTip": "string"
}`;

    const userPrompt = `Member Inquiry: "${query || 'How should I plan our first private rendezvous in Mayfair?'}"
Target Partner: "${partnerName}"
Context: ${JSON.stringify(context)}
Mode: ${mode}`;

    let conciergeResult = await callGroq({ systemPrompt, userPrompt });

    if (!conciergeResult) {
      conciergeResult = {
        reply: `For courting an ultra-high-net-worth partner in Mayfair, subtlety and cultural confidence are your greatest assets. Suggest a discreet evening at Oswald's or 5 Hertford Street, where privacy is paramount. Frame it casually around shared appreciation for contemporary art and international affairs.`,
        icebreakers: [
          `"I was just discussing cross-continental investments and thought of your point on art curation—let's continue that over vintage champagne at Oswald's."`,
          `"Between my Lagos ventures and London meetings, Thursday evening is reserved for exceptional company. Join me for private dining?"`
        ],
        recommendedVenue: "Oswald's or Harry's Bar, Mayfair, London",
        etiquetteTip: "Pre-settle all gratuities and champagne pairings discreetly with the Maître D' beforehand so the rendezvous remains effortless."
      };
    }

    return res.status(200).json({
      success: true,
      agent: 'Concierge Agent',
      trigger: 'USER_CHAT_EVENT',
      executionModel: 'Event-Driven (Zero Idle Cost)',
      provider: process.env.GROQ_API_KEY ? 'Groq Llama-3.3-70b-versatile (Free)' : 'Built-in Luxury Concierge Knowledge Base',
      timestamp: new Date().toISOString(),
      concierge: conciergeResult
    });
  } catch (error: any) {
    console.error('Concierge handler error:', error);
    return res.status(500).json({ error: 'Failed to execute concierge agent', details: error.message });
  }
}
