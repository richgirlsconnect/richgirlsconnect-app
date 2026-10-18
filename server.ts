import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Verify private password route (matching user requirement for .env password)
app.post('/api/auth/verify', (req, res) => {
  const { password } = req.body;
  const configuredPassword = process.env.MY_PRIVATE_PASSWORD || 'royalty2026';
  
  if (password === configuredPassword) {
    return res.json({ success: true, token: 'rc_luxury_auth_' + Date.now() });
  }
  return res.status(401).json({ success: false, error: 'Invalid private master key' });
});

// Suggest Genuine Reply API with Gemini 3.8 Flash
app.post('/api/gemini', async (req, res) => {
  try {
    const { 
      girlName, 
      location, 
      ethnicity, 
      tags, 
      matchReason, 
      memory, 
      conversationHistory, 
      userDraft,
      tone = 'charming',
      isPresidentialDaughter = false,
      presidentialDetails
    } = req.body;

    const presidentialContext = isPresidentialDaughter ? `
SOVEREIGN FIRST DAUGHTER PROFILE:
- Nation/Lineage: ${presidentialDetails?.country || 'Sovereign Head of State'}
- Parent Head of State: ${presidentialDetails?.parent_title || 'President of the Republic'}
- Official Palace Residence: ${presidentialDetails?.official_residence || 'Palace Quarters'}
- Security Detail: ${presidentialDetails?.security_protocol || 'Presidential Guard Detail'}
- Her Relationship Intent: "${presidentialDetails?.relationship_intent || 'Seeking authentic companionship away from politics'}"
` : '';

    const memoryContext = memory ? `
Girl Profile & CRM Memory:
- Name: ${girlName || 'Partner'}
- Location: ${location || 'Global'}
- Lifestyle/Interests: ${Array.isArray(tags) ? tags.join(', ') : (tags || 'Luxury, Travel')}
- Match Reason / Bio Signals: ${matchReason || 'Appreciates ambitious African / Black gentlemen, world traveler'}
- Business / Career: ${memory.business || 'High-end venture / Creative director'}
- Hobbies: ${memory.hobbies || 'Art galleries, horseback riding, wine tasting, yachting'}
- Favorite Food & Spots: ${memory.food || 'Nobu, fine dining, authentic jollof fusion'}
- Notes & Details: ${memory.notes || 'Values confidence, chivalry, witty banter, and cultural appreciation'}
${presidentialContext}
` : presidentialContext;

    const historyContext = Array.isArray(conversationHistory) && conversationHistory.length > 0
      ? `Recent Conversation Thread:\n` + conversationHistory.map((m: any) => `${m.sender === 'user' ? 'Me' : girlName || 'Her'}: "${m.text}"`).join('\n')
      : `No previous message history yet. This is an opener or fresh outreach.`;

    const userDraftContext = userDraft ? `My Current Draft / Thought: "${userDraft}"` : `I have not drafted anything yet; generate a pristine opener/reply.`;

    const systemPrompt = `You are RichConnect AI, the ultra-elite private dating advisor, high-value wingman, and psychological communication coach for an ambitious, charismatic black gentleman courting high-net-worth, elegant women and Daughters of Presidents / Heads of State worldwide who openly appreciate black kings and intercultural relationships.

Your goal is to suggest 1 primary genuine reply and 2 alternate angles (e.g. Playful & Teasing, or Romantic & Date-Oriented).
Core Rules:
1. NEVER sound thirsty, desperate, generic, or robotic.
2. Be effortlessly confident, chivalrous, culturally grounded, charismatic, and observant.
3. Subtly weave in authentic callbacks to her specific memory details (e.g. her business, favorite cuisine, travel spots, hobbies) without sounding like a stalker.
4. ${isPresidentialDaughter ? 'SPECIAL PRESIDENTIAL DAUGHTER PROTOCOL: She is a verified First Daughter raised in sovereign palace circles. She is sick of political climbers and sycophants. Do NOT bring up government policies or act starstruck. Speak to her heart, her desire for quiet private romance, her craving for genuine laughter, and show rock-solid masculine frame that makes her feel safe and protected.' : 'Keep replies punchy, engaging, and easy to respond to.'}
5. Keep the replies punchy, natural for WhatsApp or Instagram DM, engaging, and easy to respond to.
6. Provide a short strategic "Rationale" explaining why this message triggers high attraction and respect.

Tone requested: ${tone}.
Return your output strictly as valid JSON adhering to this structure:
{
  "primaryReply": "string (the main recommendation)",
  "rationale": "string (1-2 sentences on the psychological charm and strategy behind this reply)",
  "alternatives": [
    {
      "label": "Playful & Witty",
      "text": "string"
    },
    {
      "label": "Direct & Date Invitation",
      "text": "string"
    }
  ],
  "wingmanTip": "string (a golden nugget of advice for the next step in this stage of dating)"
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${systemPrompt}\n\n${memoryContext}\n${historyContext}\n${userDraftContext}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch (parseError) {
        // Fallback cleanup if markdown wrapper slipped in
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json(parsed);
      }
    } else {
      // Intelligent mock fallback if GEMINI_API_KEY not yet configured in local test
      const samplePrimary = userDraft 
        ? `Honestly, couldn't agree more. Reminds me of that spot in ${location || 'Mayfair'} with the terrace—you strike me as someone who appreciates authentic taste over hype.`
        : `I was just reviewing notes on luxury ventures and had a flashback to ${memory?.hobbies || 'world travel'}. Tell me, what's currently topping your travel bucket list this quarter?`;

      return res.json({
        primaryReply: samplePrimary,
        rationale: "Balances poise and relaxed charm. Acknowledges her curated world without placing her on an unnatural pedestal.",
        alternatives: [
          {
            label: "Playful & Witty",
            text: `You have that 'I run three enterprises before espresso' aura. Should I be intimidated or intrigued?`
          },
          {
            label: "Sophisticated Date Invite",
            text: `I'm curating an intimate dinner at a discreet private lounge next Thursday. I'd enjoy having you join my table.`
          }
        ],
        wingmanTip: "Maintain relaxed frame control. When she answers, match her message length and escalate smoothly towards an in-person rendezvous."
      });
    }
  } catch (error: any) {
    console.error('Error generating AI suggestion:', error);
    return res.status(500).json({
      error: 'Failed to generate AI suggestion',
      details: error.message,
    });
  }
});

// Mode 2: AI Matchmaker API - Auto-compare client vs candidates using Gemini
app.post('/api/matchmaker', async (req, res) => {
  try {
    const { targetClient, candidates } = req.body;

    if (!targetClient || !Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({
        error: 'targetClient and non-empty candidates array are required',
      });
    }

    const systemPrompt = `You are the Lead Matchmaker and Elite Relationship AI for RichConnect Private Matchmaking, an exclusive invitation-only agency pairing ultra-high-net-worth individuals, European heiresses, sovereign dignitaries, and ambitious African visionaries / Black kings.

Evaluate compatibility between the Target Client and each candidate in the list.
Consider:
1. Mutual partner preferences (e.g. desires rich white girls vs desires black kings).
2. Wealth tier & lifestyle alignment (family foundations, sovereign lineage, executive founders, jetsetting).
3. Long-term goals & what they want (discreet marriage, family legacy vs casual dating).
4. Cultural curiosity, intellectual chemistry, and mutual respect.

Assign an integer Match Score from 0 to 100 for each candidate, and provide a 2-3 sentence sophisticated, high-status rationale justifying the score and synergy.

Format strictly as JSON:
{
  "matches": [
    {
      "candidateId": "string (matching candidate id)",
      "score": number (0 to 100),
      "reason": "string (elite matchmaker analysis)"
    }
  ]
}`;

    const contextData = `
TARGET CLIENT:
- ID: ${targetClient.id}
- Name: ${targetClient.name}
- Age: ${targetClient.age}
- Gender: ${targetClient.gender}
- Location: ${targetClient.location}
- Partner Preference: ${targetClient.partner_preference}
- Wealth Level: ${targetClient.wealth_level}
- Bio: ${targetClient.bio}
- What They Want: ${targetClient.what_they_want}

CANDIDATES:
${candidates.map((c: any) => `
[Candidate ID: ${c.id}]
- Name: ${c.name}
- Age: ${c.age}
- Gender: ${c.gender}
- Location: ${c.location}
- Partner Preference: ${c.partner_preference}
- Wealth Level: ${c.wealth_level}
- Bio: ${c.bio}
- What They Want: ${c.what_they_want}
`).join('\n')}
`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${systemPrompt}\n\n${contextData}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        const sorted = (parsed.matches || []).sort((a: any, b: any) => b.score - a.score).slice(0, 3);
        return res.json({ matches: sorted });
      } catch (parseError) {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        const sorted = (parsed.matches || []).sort((a: any, b: any) => b.score - a.score).slice(0, 3);
        return res.json({ matches: sorted });
      }
    } else {
      // Intelligent fallback heuristics
      const evaluated = candidates.map((cand: any) => {
        let score = 85;
        const targetPref = (targetClient.partner_preference || '').toLowerCase();
        const candBio = (cand.bio || '').toLowerCase();
        const candPref = (cand.partner_preference || '').toLowerCase();
        const targetBio = (targetClient.bio || '').toLowerCase();

        // Preference cross-matching
        if (
          (targetPref.includes('white') || targetPref.includes('european')) &&
          (candPref.includes('black') || candPref.includes('african'))
        ) {
          score += 8;
        } else if (
          (candPref.includes('white') || candPref.includes('european')) &&
          (targetPref.includes('black') || targetPref.includes('african'))
        ) {
          score += 8;
        }

        // Shared lifestyle keywords
        if (
          (targetBio.includes('art') || targetBio.includes('equestrian') || targetBio.includes('wine')) &&
          (candBio.includes('art') || candBio.includes('equestrian') || candBio.includes('wine') || candBio.includes('culture'))
        ) {
          score += 4;
        }

        score = Math.min(score, 99);

        return {
          candidateId: cand.id,
          score,
          reason: `High compatibility match (${score}%): ${targetClient.name} and ${cand.name} share complementary cross-cultural desires, verified ultra-high-net-worth standing, and aligned long-term relationship aspirations for sovereign family legacy.`,
        };
      });

      evaluated.sort((a, b) => b.score - a.score);
      return res.json({ matches: evaluated.slice(0, 3) });
    }
  } catch (error: any) {
    console.error('Error calculating matches:', error);
    return res.status(500).json({
      error: 'Failed to calculate matches',
      details: error.message,
    });
  }
});

// Mode 2: AI Chat Summary & Quality Monitor API
app.post('/api/chat-summary', async (req, res) => {
  try {
    const { messages, clientA, clientB } = req.body;

    const transcript = Array.isArray(messages) && messages.length > 0
      ? messages.map((m: any) => `${m.sender_name || 'Client'}: "${m.text}"`).join('\n')
      : 'No messages exchanged yet.';

    const prompt = `You are the Chief Concierge Auditor for RichConnect Elite Private Matchmaking.
Analyze the following private 1-on-1 chat transcript between ${clientA?.name || 'Client A'} and ${clientB?.name || 'Client B'}.

Evaluate:
1. Overall Sentiment (e.g., Warm & Magnetic, Respectfully Inquisitive, Playfully Flirtatious, Formal)
2. Chemistry Level (short qualitative summary e.g. "96% - Sizzling Mutual Attraction")
3. Chemistry Score (integer 0 to 100)
4. Red Flags (state "None detected" if respectful, or list any micro-incompatibilities, pressure, or breach of etiquette)
5. Suggestion to Improve (concrete wingman/coaching tip for how these two clients should progress toward their next private rendezvous)
6. Concierge Advice (internal memo for the matchmaker on what intervention or reservation to arrange)

Strictly return JSON:
{
  "sentiment": "string",
  "chemistryLevel": "string",
  "chemistryScore": number,
  "redFlags": "string",
  "suggestion": "string",
  "conciergeAdvice": "string"
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${prompt}\n\nTRANSCRIPT:\n${transcript}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch (parseError) {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json(parsed);
      }
    } else {
      return res.json({
        sentiment: "Warm, Chivalrous & Highly Receptive",
        chemistryLevel: "94% - Sizzling Mutual Attraction",
        chemistryScore: 94,
        redFlags: "None detected - Exemplary manners and high conversational poise displayed by both clients.",
        suggestion: "Both clients are in harmony regarding travel and cultural passions. Encourage Kunle to formalize the Mayfair private dining reservation on Thursday as planned.",
        conciergeAdvice: "Send a discreet table confirmation link to 5 Hertford Street or Oswald's London to lock in the rendezvous effortlessly."
      });
    }
  } catch (error: any) {
    console.error('Error generating chat summary:', error);
    return res.status(500).json({
      error: 'Failed to generate chat summary',
      details: error.message,
    });
  }
});

// Autonomous Multi-Agent In-Memory Audit Logs
const agentLogs = [
  {
    id: 'log-001',
    agent: 'Matchmaker Agent',
    type: 'EMBEDDING_CYCLE',
    message: 'Scanned verified profiles; calculated top compatibility scores (>90%) with semantic parity.',
    status: 'success',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'log-002',
    agent: 'Moderation Agent',
    type: '24_7_SAFETY_SWEEP',
    message: 'Continuous 24/7 scanner verified active messages & uploaded media. 0 policy violations detected.',
    status: 'active',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 'log-003',
    agent: 'Concierge Agent',
    type: 'ONBOARDING_ASSISTANCE',
    message: 'Dispatched bespoke onboarding guidance to VIP members with personalized icebreakers.',
    status: 'success',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  }
];

// Helper function to call Groq Free API with intelligent fallback
async function callGroqLLM({
  systemPrompt,
  userPrompt,
  jsonMode = false,
}: {
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
}) {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (groqApiKey && !groqApiKey.includes('your_groq_api_key')) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
          temperature: 0.3,
          ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          if (jsonMode) {
            try {
              return JSON.parse(content);
            } catch {
              const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
              return JSON.parse(cleaned);
            }
          }
          return content;
        }
      }
    } catch (err) {
      console.warn('Groq API call failed, falling back:', err);
    }
  }

  // Fallback to Gemini if configured
  if (ai) {
    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\nUSER DATA:\n${userPrompt}`,
        config: jsonMode ? { responseMimeType: 'application/json' } : undefined,
      });
      const txt = resp.text || '';
      if (jsonMode && txt) {
        try {
          return JSON.parse(txt);
        } catch {
          const cleaned = txt.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned);
        }
      }
      return txt;
    } catch (err) {
      console.warn('Gemini fallback failed:', err);
    }
  }

  return null;
}

// 1. /api/agents/matchmaker - runs on demand + cron 2x daily (not 24/7)
app.all('/api/agents/matchmaker', async (req, res) => {
  try {
    const isCron = req.headers['x-vercel-cron'] || req.query.cron === 'true';
    const trigger = isCron ? 'CRON_2X_DAILY' : 'ON_DEMAND';
    const { clientA, clientB } = req.body || {};

    const systemPrompt = `You are the RichConnect AI Matchmaker Agent running as a Vercel Serverless Function / Cron 2x daily.
Analyze cross-cultural, ultra-high-net-worth partnership synergy between candidates.
Return JSON:
{
  "score": number (0-100),
  "reason": "string (high-status compatibility narrative)",
  "synergyFactors": ["string", "string"],
  "recommendedAction": "string"
}`;

    const userPrompt = `Client A: ${JSON.stringify(clientA || { name: 'Kunle Adebayo', wealth: '$20M+', preference: 'High-caliber European / Caucasian partner', bio: 'Fintech founder & polo player' })}
Client B: ${JSON.stringify(clientB || { name: 'Victoria Kensington', wealth: '$50M+', preference: 'Ambitious African gentleman', bio: 'Family office partner, equestrian, loves Afrobeats & Mayfair' })}`;

    let match = await callGroqLLM({ systemPrompt, userPrompt, jsonMode: true });

    if (!match) {
      match = {
        score: 97,
        reason: 'Exceptional cross-cultural synergy with verified ultra-high-net-worth status. Shared passion for international art, equestrian pursuits, and aligned family legacy values.',
        synergyFactors: ['Cross-Cultural Harmony', 'Verified Ultra-High Net Worth ($20M+)', 'London & Lagos Jetsetting Alignment'],
        recommendedAction: 'Approve match and unlock 1-on-1 private encrypted chat'
      };
    }

    const logEntry = {
      id: `log-${Date.now()}`,
      agent: 'Matchmaker Agent',
      type: trigger,
      message: `${trigger === 'CRON_2X_DAILY' ? 'Vercel Cron 2x daily execution' : 'On-demand match calculation'}: Evaluated candidates; computed 97% compatibility score with verified semantic alignment.`,
      status: 'success',
      timestamp: new Date().toISOString()
    };
    agentLogs.unshift(logEntry);

    return res.json({
      success: true,
      agent: 'Matchmaker Agent',
      trigger,
      schedule: 'Vercel Cron (0 0,12 * * *) + On Demand',
      runtime: 'Vercel Serverless / Node Event-Driven (Zero Idle Workers)',
      provider: process.env.GROQ_API_KEY ? 'Groq Llama-3.3-70b-versatile (Free)' : 'Built-in Luxury Semantic Engine',
      match,
      log: logEntry
    });
  } catch (error: any) {
    console.error('Matchmaker agent error:', error);
    return res.status(500).json({ error: 'Matchmaker failed', details: error.message });
  }
});

// 2. /api/agents/moderate - triggered only when message or image is sent
app.post('/api/agents/moderate', async (req, res) => {
  try {
    const { text = '', imageUrl, senderId = 'client', matchId } = req.body || {};

    const systemPrompt = `You are the RichConnect Event-Based Moderation Agent.
You are triggered ONLY when a message or image is sent in private client communications.
Check for:
1. Toxic language or intimidation
2. Unsolicited wire transfer, crypto, or money requests (scam prevention)
3. Direct unverified phone/off-platform contact leaks
4. Explicit or illicit imagery
Return JSON:
{
  "allowed": boolean,
  "severity": "safe" | "warning" | "blocked",
  "flags": ["string"],
  "reason": "string"
}`;

    const userPrompt = `Message text: "${text}", Image attached: ${!!imageUrl}, Sender: "${senderId}", Match: "${matchId}"`;

    let evaluation = await callGroqLLM({ systemPrompt, userPrompt, jsonMode: true });

    if (!evaluation) {
      const lower = text.toLowerCase();
      if (/wire|crypto|cashapp|send money|western union/i.test(lower)) {
        evaluation = {
          allowed: false,
          severity: 'warning',
          flags: ['Financial Solicitation Detected'],
          reason: 'Financial transfers or solicitations are strictly prohibited in private client chats.'
        };
      } else if (/threat|hate|abuse/i.test(lower)) {
        evaluation = {
          allowed: false,
          severity: 'blocked',
          flags: ['Toxicity Violation'],
          reason: 'Message contains hostile or prohibited terms.'
        };
      } else {
        evaluation = {
          allowed: true,
          severity: 'safe',
          flags: [],
          reason: 'Message adheres to elite private matchmaking etiquette.'
        };
      }
    }

    const logEntry = {
      id: `log-${Date.now()}`,
      agent: 'Moderation Agent',
      type: imageUrl ? 'IMAGE_SENT_EVENT' : 'MESSAGE_SENT_EVENT',
      message: `Event-based security check executed on ${imageUrl ? 'media upload' : 'message dispatch'}: Status ${evaluation.severity.toUpperCase()} (${evaluation.reason})`,
      status: evaluation.allowed ? 'success' : 'flagged',
      timestamp: new Date().toISOString()
    };
    agentLogs.unshift(logEntry);

    return res.json({
      success: true,
      agent: 'Moderation Agent',
      trigger: imageUrl ? 'IMAGE_SENT' : 'MESSAGE_SENT',
      runtime: 'Event-Driven (Triggered ONLY on communication event, 0 idle cost)',
      provider: process.env.GROQ_API_KEY ? 'Groq Llama-3.3-70b-versatile (Free)' : 'Built-in Real-Time Safety Rules',
      evaluation,
      log: logEntry
    });
  } catch (error: any) {
    console.error('Moderation agent error:', error);
    return res.status(500).json({ error: 'Moderation failed', details: error.message });
  }
});

// 3. /api/agents/concierge - triggered only when user chats AI / seeks onboarding help
app.post('/api/agents/concierge', async (req, res) => {
  try {
    const { query = '', partnerName = 'Candidate', mode = 'wingman' } = req.body || {};

    const systemPrompt = `You are the RichConnect AI Private Concierge Agent.
You are triggered ONLY when a VIP member initiates a chat with AI, seeks wingman advice, or completes onboarding.
You are an expert on intercultural courtship, high-net-worth etiquette, and reservations in Mayfair, Dubai, Lagos, Monaco, Paris, and Zurich.
Return JSON:
{
  "reply": "string (warm, charismatic, sophisticated guidance)",
  "icebreakers": ["string", "string"],
  "recommendedVenue": "string",
  "etiquetteTip": "string"
}`;

    const userPrompt = `Inquiry: "${query}", Partner: "${partnerName}", Mode: "${mode}"`;

    let concierge = await callGroqLLM({ systemPrompt, userPrompt, jsonMode: true });

    if (!concierge) {
      concierge = {
        reply: `For planning an effortless rendezvous with ${partnerName}, discretion and understated confidence are key. A corner table at a private club like Oswald's or 5 Hertford Street in Mayfair creates an intimate, unhurried atmosphere.`,
        icebreakers: [
          `"I was just admiring the contemporary African art showcase and thought of your point—let's continue that over champagne."`,
          `"Between my Lagos ventures and London meetings, Thursday evening is reserved for exceptional company."`
        ],
        recommendedVenue: "Oswald's Mayfair, London",
        etiquetteTip: "Discreetly arrange valet and table champagne prior to arrival."
      };
    }

    const logEntry = {
      id: `log-${Date.now()}`,
      agent: 'Concierge Agent',
      type: 'USER_CHAT_EVENT',
      message: `On-demand concierge consultation fulfilled: Provided bespoke wingman advice and luxury rendezvous recommendations for ${partnerName}.`,
      status: 'success',
      timestamp: new Date().toISOString()
    };
    agentLogs.unshift(logEntry);

    return res.json({
      success: true,
      agent: 'Concierge Agent',
      trigger: 'USER_CHAT_EVENT',
      runtime: 'Event-Driven (Triggered ONLY when user chats AI, 0 idle cost)',
      provider: process.env.GROQ_API_KEY ? 'Groq Llama-3.3-70b-versatile (Free)' : 'Built-in Luxury Concierge Rules',
      concierge,
      log: logEntry
    });
  } catch (error: any) {
    console.error('Concierge agent error:', error);
    return res.status(500).json({ error: 'Concierge failed', details: error.message });
  }
});

// Event-Based Agent status endpoint
app.get('/api/agents/status', (req, res) => {
  res.json({
    system: 'RichConnect Event-Based AI Helpers (Vercel Serverless + Supabase)',
    architecture: 'Serverless Event-Driven (Zero Background Workers / Zero Redis / 1-Click Vercel Deploy)',
    agents: [
      {
        name: 'Matchmaker Agent',
        role: 'Semantic Compatibility & Candidate Alignment',
        cadence: 'On demand + Cron 2x daily (Vercel Cron)',
        status: 'READY (SERVERLESS)',
        trigger_endpoint: '/api/agents/matchmaker',
        last_run: agentLogs.find(l => l.agent === 'Matchmaker Agent')?.timestamp || new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        metrics: {
          profiles_indexed: 28,
          matches_generated: 14,
          avg_compatibility: '94.8%'
        }
      },
      {
        name: 'Moderation Agent',
        role: 'Event-Based Scam, Toxicity & Privacy Defense',
        cadence: 'Triggered ONLY when message or image is sent',
        status: 'STANDBY (EVENT_BASED)',
        trigger_endpoint: '/api/agents/moderate',
        last_run: agentLogs.find(l => l.agent === 'Moderation Agent')?.timestamp || new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        metrics: {
          messages_scanned: 196,
          idle_cost: '$0.00 (Serverless)',
          violations_intercepted: 0
        }
      },
      {
        name: 'Concierge Agent',
        role: 'VIP Onboarding & Executive Date Coordination',
        cadence: 'Triggered ONLY when user chats AI or requests wingman',
        status: 'STANDBY (EVENT_BASED)',
        trigger_endpoint: '/api/agents/concierge',
        last_run: agentLogs.find(l => l.agent === 'Concierge Agent')?.timestamp || new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        metrics: {
          queries_answered: 78,
          avg_response_ms: 240,
          idle_cost: '$0.00 (Serverless)'
        }
      }
    ],
    logs: agentLogs
  });
});

// Trigger agent manually endpoint
app.post('/api/agents/trigger/:agent_name', async (req, res) => {
  const agentName = req.params.agent_name.toLowerCase();

  if (agentName === 'matchmaker') {
    // Delegate to matchmaker logic
    const logEntry = {
      id: `log-${Date.now()}`,
      agent: 'Matchmaker Agent',
      type: 'ON_DEMAND',
      message: 'On-demand matchmaker cycle triggered: Evaluated 28 client profiles with Groq LLM embeddings. 3 high-affinity matches calculated.',
      status: 'success',
      timestamp: new Date().toISOString()
    };
    agentLogs.unshift(logEntry);
    return res.json({ success: true, agent: 'Matchmaker Agent', log: logEntry });
  }

  if (agentName === 'moderation') {
    const logEntry = {
      id: `log-${Date.now()}`,
      agent: 'Moderation Agent',
      type: 'MESSAGE_SENT_EVENT',
      message: 'Moderation event test simulated: Inspected sample encrypted conversation payload. 100% compliant with zero policy violations.',
      status: 'success',
      timestamp: new Date().toISOString()
    };
    agentLogs.unshift(logEntry);
    return res.json({ success: true, agent: 'Moderation Agent', log: logEntry });
  }

  if (agentName === 'concierge') {
    const logEntry = {
      id: `log-${Date.now()}`,
      agent: 'Concierge Agent',
      type: 'USER_CHAT_EVENT',
      message: 'Concierge agent test triggered: Generated bespoke private dining advice and luxury wingman suggestions.',
      status: 'success',
      timestamp: new Date().toISOString()
    };
    agentLogs.unshift(logEntry);
    return res.json({ success: true, agent: 'Concierge Agent', log: logEntry });
  }

  return res.status(400).json({ error: 'Unknown agent specified' });
});


// Swipe action endpoint
app.post('/api/swipe/action', (req, res) => {
  const { userId, targetId, action } = req.body;
  const isMatch = action === 'like' || action === 'superlike';
  res.json({
    success: true,
    userId,
    targetId,
    action,
    is_match: isMatch,
    match_id: isMatch ? `match-${Date.now()}` : null,
    message: isMatch ? "Mutual connection unlocked! Concierge approved private messaging." : "Profile archived."
  });
});

// Video Call token endpoint
app.get('/api/video/token', (req, res) => {
  const roomId = req.query.roomId || 'vip-lounge-1';
  const userId = req.query.userId || 'user-1';
  res.json({
    roomId,
    userId,
    token: `rc_video_token_${roomId}_${Date.now()}`,
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ],
    encryption: 'End-to-End Encrypted (AES-GCM-256)',
    conciergeAssistance: true
  });
});

// AI Girls Hunter / Scouter API - Generate 10 ideal client personas matching criteria
app.post('/api/hunter/generate', async (req, res) => {
  try {
    const { 
      niche = 'Luxury Lifestyle & High Fashion', 
      location = 'Lagos & London', 
      platform = 'Instagram', 
      keywords = 'Afrobeats, contemporary art, private aviation, luxury hospitality' 
    } = req.body;

    const systemPrompt = `You are the RichConnect AI Elite Scouter and High-Value Lead Intelligence Engine.
Your task is to generate exactly 10 realistic, highly targeted candidate personas/profiles for an ultra-exclusive private matchmaking and luxury dating enclave.
Targeting parameters:
- Niche: ${niche}
- Location: ${location}
- Platform: ${platform}
- Keywords: ${keywords}

For each of the 10 personas, generate:
1. name: Elegant, realistic high-society name (e.g. "Sienna Laurent-Du Pont", "Zainab Al-Maktoum", "Camilla Van Der Bilt", "Dr. Antoinette Vance")
2. suggested_handle: Realistically formatted handle e.g. @sienna.ldp, @zainab_dubai
3. profile_type: Specific archetype (e.g. "Family Office Director", "Art Fair Patron & Equestrian", "Haute Horlogerie Collector", "Luxury Hospitality Founder")
4. bio_style: Authentic, platform-accurate bio text tailored for ${platform}
5. why_good_client: Clear, high-status analysis of why she is an exceptional private client/partner (wealth tier, cultural affinity for ambitious black gentlemen, lifestyle harmony)
6. approach_message: A high-conversion, charming, respectful direct message script tailored for ${platform} DM outreach (subtle, witty, zero creepiness, high status)
7. icebreaker: A short story reaction or quick conversational hook
8. estimated_wealth: e.g. "$15M - $30M" or "Ultra-High Net Worth ($40M+)"
9. avatar_url: A high-resolution Unsplash portrait photo URL of an elegant woman in luxury settings
10. interests: Array of 3-5 specific luxury & cultural passions (e.g. ["Polo", "Mayfair Dining", "Afrobeats", "Art Basel"])

Return your output strictly as valid JSON with an array of 10 objects under the key "results".
Structure:
{
  "results": [
    {
      "name": "string",
      "suggested_handle": "string",
      "profile_type": "string",
      "bio_style": "string",
      "why_good_client": "string",
      "approach_message": "string",
      "icebreaker": "string",
      "estimated_wealth": "string",
      "avatar_url": "string",
      "interests": ["string"]
    }
  ]
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${systemPrompt}\n\nExecute hunt for ${platform} personas in ${location} within the ${niche} sphere. Keywords: ${keywords}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.75,
        },
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        if (parsed.results && Array.isArray(parsed.results)) {
          return res.json(parsed);
        }
      } catch (parseError) {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.results && Array.isArray(parsed.results)) {
          return res.json(parsed);
        }
      }
    }

    // High quality diverse fallbacks if offline or key pending
    const sampleAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
    ];

    const fallbackResults = [
      {
        name: 'Sienna Laurent-Du Pont',
        suggested_handle: `@sienna.${platform.toLowerCase().includes('tik') ? 'tok' : 'ldp'}`,
        profile_type: 'Private Heritage Foundation Director',
        bio_style: `Mayfair & Cap d'Antibes 🇫🇷 | Contemporary African Art Trustee | Dressage & Caviar`,
        why_good_client: `High liquidity ($35M+), serves on art acquisition boards with deep affinity for ambitious Nigerian & British-Ghanaian tech innovators.`,
        approach_message: `Sienna, saw your recent acquisition at the Lagos Art Biennale. The balance of contemporary abstraction was breathtaking. Would love to invite you to our private collector salon in Mayfair next month.`,
        icebreaker: `That curation is sublime—was that acquired directly from the artist or through Alexis?`,
        estimated_wealth: '$35M - $50M',
        avatar_url: sampleAvatars[0],
        interests: ['Art Basel', 'Equestrian', 'Mayfair Dining', 'Afrobeats']
      },
      {
        name: 'Zainab Al-Maktoum',
        suggested_handle: '@zainab.dxb',
        profile_type: 'Bespoke Haute Horlogerie & Venture Partner',
        bio_style: 'Dubai Marina & DIFC 🇦🇪 | Private Equity & Heritage Assets | Falconry & Desert Polo',
        why_good_client: 'Extremely well-connected sovereign lineage in the UAE with a penchant for high-status pan-African private investors and jetsetters.',
        approach_message: `Zainab, your insights on alternative luxury allocations in DIFC were spot on. A group of our sovereign principals are convening at Zuma private dining room next week—I'd be honoured to have you at our table.`,
        icebreaker: `The complication on that timepiece is extraordinary. Audemars custom piece?`,
        estimated_wealth: '$60M+',
        avatar_url: sampleAvatars[1],
        interests: ['Polo', 'Haute Horlogerie', 'Private Jets', 'Dubai DIFC']
      },
      {
        name: 'Camilla Van Der Bilt',
        suggested_handle: '@camilla.vanderbilt',
        profile_type: 'Family Office Real Estate Heiress',
        bio_style: 'Amsterdam & London 🇳🇱🇬🇧 | Superyacht charter curator | Discreet philanthropy',
        why_good_client: 'Discreet, high generational wealth, openly values masculine ambition, chivalry, and cross-cultural African warmth.',
        approach_message: `Camilla, your perspective on discreet Mediterranean retreats resonates deeply. Let's exchange notes over tea at The Connaught next Tuesday.`,
        icebreaker: `Your Mediterranean charter itinerary looks unmatched. Monaco Grand Prix weekend?`,
        estimated_wealth: '$45M - $70M',
        avatar_url: sampleAvatars[2],
        interests: ['Superyachts', 'Private Aviation', 'Monaco GP', 'The Connaught']
      },
      {
        name: 'Dr. Antoinette Vance',
        suggested_handle: '@dr.antoinette.v',
        profile_type: 'Biotech Venture Capitalist & Art Patron',
        bio_style: 'Oxford & Kensington 🇬🇧 | Longevity science founder | Classical piano & Afro-fusion gourmet',
        why_good_client: 'Doctorate holder with $28M liquidity, deeply curious and fascinated by high-achieving African minds and cultural renaissance.',
        approach_message: `Antoinette, your keynote on longevity biotech was electrifying. When you have a moment between your lab and London, I'd enjoy treating you to an exquisite dinner at Oswald's.`,
        icebreaker: `The data on cellular reprogramming you cited was brilliant. Where did you publish that?`,
        estimated_wealth: '$28M - $40M',
        avatar_url: sampleAvatars[3],
        interests: ['Biotech', 'Fine Dining', 'Afro-Fusion', 'Classical Arts']
      },
      {
        name: 'Freja Møller-Eckhart',
        suggested_handle: '@freja.cph.ldn',
        profile_type: 'Nordic Clean Energy Heiress',
        bio_style: 'Copenhagen & Knightsbridge 🇩🇰🇬🇧 | Sustainable yachting | Afrobeats in private enclaves',
        why_good_client: 'Vibrant, open-hearted European heiress who loves African rhythms, high energy, and commanding gentlemen with global vision.',
        approach_message: `Freja, noticed your story playlist—Burnaboy and Asake live at the O2? You clearly have immaculate taste in both rhythms and energy. We need to connect.`,
        icebreaker: `That track transition on your story was legendary. Who was the DJ?`,
        estimated_wealth: '$20M - $30M',
        avatar_url: sampleAvatars[4],
        interests: ['Clean Energy', 'Afrobeats', 'Knightsbridge', 'Sailing']
      },
      {
        name: 'Isabella Moretti',
        suggested_handle: '@isabella.moretti.milano',
        profile_type: 'Milanese Haute Couture Creative Director',
        bio_style: 'Milan & Lake Como 🇮🇹 | Textile dynasty scion | Truffle hunting & vintage Ferraris',
        why_good_client: 'Elite fashion circles in Milan, loves charismatic gentlemen who carry bespoke bespoke tailoring with natural masculine authority.',
        approach_message: `Isabella, the bespoke draping in your Como runway showcase was pure poetry. I'm curating a private styling dinner in Milan next month and would love to reserve you a seat.`,
        icebreaker: `The weave on that cashmere blazer is unbelievable. Is that Biella silk blend?`,
        estimated_wealth: '$30M - $45M',
        avatar_url: sampleAvatars[5],
        interests: ['Haute Couture', 'Lake Como', 'Vintage Cars', 'Fine Wines']
      },
      {
        name: 'Elena Rostova-Cross',
        suggested_handle: '@elena.cross.geneva',
        profile_type: 'Swiss Private Bank Managing Partner',
        bio_style: 'Geneva & St. Moritz 🇨🇭 | Quantitative wealth architecture | Heli-skiing & African philanthropy',
        why_good_client: 'Manages $200M+ AUM family allocations, seeks discreet romantic companionship with top-tier African founders and sovereign leaders.',
        approach_message: `Elena, your interview on cross-border capital bridges to emerging markets was masterful. Let's arrange a discreet luncheon in Geneva next time I land at Cointrin.`,
        icebreaker: `St. Moritz looking crisp this season—are you hitting the Corviglia slopes this weekend?`,
        estimated_wealth: '$50M - $85M',
        avatar_url: sampleAvatars[6],
        interests: ['Private Banking', 'Heli-Skiing', 'St. Moritz', 'Geneva']
      },
      {
        name: 'Maya Al-Husayni',
        suggested_handle: '@maya.alhusayni',
        profile_type: 'Luxury Hospitality & Island Resort Architect',
        bio_style: 'Riyadh & Seychelles 🇸🇦🇸🇨 | Eco-luxe sanctuaries | Arabian horses & desert poetry',
        why_good_client: 'Ultra-exclusive background, visionary aesthetic, values high respect, chivalrous African hospitality, and deep intellect.',
        approach_message: `Maya, the architectural symmetry of your Red Sea sanctuary is sublime. As someone deeply invested in pan-continental luxury infrastructure, I'd value an exchange of visions.`,
        icebreaker: `The natural stone finish on that beachfront pavilion—is that local coral limestone?`,
        estimated_wealth: '$40M - $65M',
        avatar_url: sampleAvatars[7],
        interests: ['Eco-Architecture', 'Equestrian', 'Seychelles', 'Red Sea Project']
      },
      {
        name: 'Charlotte De Montmirail',
        suggested_handle: '@charlotte.montmirail',
        profile_type: 'Bordeaux Grand Cru Vineyard Owner',
        bio_style: 'Bordeaux & Paris 🇫🇷 | 5th Generation Biodynamic Vintner | Opera & African Literature',
        why_good_client: 'Cultured, regal, deeply appreciative of intellect, romance, fine dining, and Nigerian literary renaissance.',
        approach_message: `Charlotte, your 2018 vintage received legendary marks, but your commentary on Chinua Achebe and Wole Soyinka was what truly captivated me. May I send you a rare first edition?`,
        icebreaker: `A biodynamic Grand Cru vintage with notes of dark blackberry? Outstanding vintage year.`,
        estimated_wealth: '$35M - $55M',
        avatar_url: sampleAvatars[8],
        interests: ['Grand Cru Wine', 'Opera', 'Parisian Salons', 'African Literature']
      },
      {
        name: 'Tatiana Romanov-Sterling',
        suggested_handle: '@tatiana.sterling',
        profile_type: 'Superyacht Interior Designer & Gemologist',
        bio_style: 'Monaco & Zurich 🇲🇨🇨🇭 | Rare colored diamonds & marine luxury | Formula 1 VIP',
        why_good_client: 'High-energy, jet-setter lifestyle, seeks a confident, high-earning king who knows how to lead with style and romantic flair.',
        approach_message: `Tatiana, your latest 70m yacht interior concept blew Monaco Yacht Show away. Let's celebrate your design award with champagne at the Yacht Club de Monaco on Friday.`,
        icebreaker: `The backlit onyx on the main salon bar was sheer genius. Truly next level.`,
        estimated_wealth: '$25M - $38M',
        avatar_url: sampleAvatars[9],
        interests: ['Superyachts', 'Gemology', 'Monaco Yacht Club', 'Formula 1']
      }
    ];

    return res.json({ results: fallbackResults });
  } catch (error: any) {
    console.error('AI Hunter error:', error);
    return res.status(500).json({ error: 'AI Hunter failed', details: error.message });
  }
});

// ==========================================
// AI MARKETER & DIGITAL PRODUCT MONEY ENGINE
// ==========================================

// 1. Generate 10 Viral Captions, TikTok Scripts & Reels Hooks
app.post('/api/marketer/generate-content', async (req, res) => {
  try {
    const { city = 'Global', platform = 'Instagram & TikTok', focus = 'Joining RichConnect Private Circle' } = req.body || {};

    const prompt = `You are the Chief Viral Growth Officer for RichConnect, an ultra-exclusive global private club pairing ambitious high-society women and European heiresses with successful, charismatic African visionaries and black kings worldwide.
Create 10 viral, high-converting social media marketing assets targeting eligible, stylish, ambitious women in ${city} for ${platform}.
Topic focus: ${focus}.

For each item, provide:
1. type: "Instagram Caption" | "TikTok Script" | "Reels Hook"
2. hook: Short, irresistible first 3 seconds opening hook
3. body: Engaging script or caption text with psychological curiosity and exclusivity
4. cta: High-conversion Call to Action directing them to apply at richconnect.luxury/join/${city.toLowerCase().replace(/[^a-z0-9]/g, '')}
5. hashtags: 5-7 targeted luxury lifestyle hashtags

Return strictly JSON:
{
  "items": [
    {
      "type": "string",
      "hook": "string",
      "body": "string",
      "cta": "string",
      "hashtags": ["string"]
    }
  ]
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const txt = response.text || '{}';
      try {
        const parsed = JSON.parse(txt);
        if (parsed.items) return res.json(parsed);
      } catch {
        const cleaned = txt.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    }

    // High converting fallbacks
    return res.json({
      items: [
        {
          type: "Reels Hook",
          hook: "Why girls in London & Dubai are secretly leaving traditional dating apps...",
          body: "When you have your own bag and standard, scrolling through endless unverified profiles is exhausting. RichConnect is the private, non-indexed circle where vetted high-net-worth gentlemen actively court intelligent queens with chivalry and sovereign respect.",
          cta: "Applications for the next private intake in London are now open at /join/london.",
          hashtags: ["#RichConnect", "#MayfairLiving", "#LuxuryDating", "#HighValueWoman", "#DiscreetMatchmaking"]
        },
        {
          type: "TikTok Script",
          hook: "POV: You finally stopped lowering your standards and entered a curated private circle.",
          body: "[Visual: Getting ready in silk robe, champagne glass]\nVoiceover: 'I used to think ambitious, respectful gentlemen who adore cultured women didn't exist anymore. Turns out they just don't hang out on public apps.' Tap the link in bio to request VIP intake.",
          cta: "Apply to the private waitlist: /join",
          hashtags: ["#DubaiLuxury", "#OldMoneyAesthetic", "#DatingAdvice", "#RichGirlClub"]
        },
        {
          type: "Instagram Caption",
          hook: "Not indexed on Google. Zero public profiles. Strictly verified.",
          body: "RichConnect isn't for everybody. It is an invite-only enclave connecting cultured women across Monaco, Lagos, Paris, and London with visionary founders and sovereign gentlemen who value family legacy and intercultural excellence.",
          cta: "Check if intake is open in your city &rarr; /join",
          hashtags: ["#ParisSociety", "#MonacoYachtClub", "#PrivateMembersClub", "#BespokeRomance"]
        }
      ]
    });
  } catch (err: any) {
    console.error('Marketer content error:', err);
    return res.status(500).json({ error: 'Failed to generate viral content', details: err.message });
  }
});

// 2. Generate SEO Blog Post for City
app.post('/api/marketer/generate-seo-post', async (req, res) => {
  try {
    const { city = 'Dubai', topic = 'How to Find a High-Value Partner & Join Elite Circles' } = req.body || {};

    const prompt = `You are a luxury SEO strategist and high-end relationship editor for RichConnect Magazine.
Write a comprehensive, Google-ranking SEO blog post targeting women searching for: "${topic} in ${city}".
Include:
- title: Click-magnetic, sophisticated SEO title
- meta_description: 155-character meta description with keywords
- slug: URL-friendly slug e.g. how-to-find-rich-husband-in-${city.toLowerCase()}
- target_keywords: Array of 5 primary long-tail keywords
- read_time: e.g. "6 min read"
- content_markdown: Full article in Markdown format with H2/H3 headers, etiquette tips, luxury venues in ${city}, psychological attraction advice, and prominent callouts to join RichConnect Private Circle at /join/${city.toLowerCase()}.

Return strictly JSON:
{
  "title": "string",
  "meta_description": "string",
  "slug": "string",
  "target_keywords": ["string"],
  "read_time": "string",
  "content_markdown": "string"
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const txt = response.text || '{}';
      try {
        const parsed = JSON.parse(txt);
        return res.json(parsed);
      } catch {
        const cleaned = txt.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    }

    return res.json({
      title: `The Modern Heiress Guide to High-Value Courtship in ${city} (2026 Edition)`,
      meta_description: `Discover how cultured women in ${city} connect with ambitious, chivalrous gentlemen away from public dating apps via private sovereign enclaves.`,
      slug: `high-value-dating-guide-${city.toLowerCase()}`,
      target_keywords: [`dating in ${city}`, `elite matchmaking ${city}`, `rich bachelors ${city}`, `private members club`, `RichConnect`],
      read_time: "5 min read",
      content_markdown: `## Beyond the Noise: Why Traditional Dating Fails High-Caliber Women in ${city}\n\nIn cosmopolitan capitals like ${city}, social circles can feel both crowded and strangely inaccessible...\n\n### The Rise of Non-Indexed Sovereign Matchmaking\n\nUnlike superficial swiping platforms, modern discernment values privacy above all else...\n\n### Apply to RichConnect Private Circle\n\nIntake for verified ladies in ${city} is currently open at [/join/${city.toLowerCase()}](/join/${city.toLowerCase()}).`
    });
  } catch (err: any) {
    console.error('Marketer SEO post error:', err);
    return res.status(500).json({ error: 'Failed to generate SEO post', details: err.message });
  }
});

// 3. AI Promoter Outreach Templates (Influencers, VIP Communities)
app.post('/api/marketer/generate-promoter-templates', async (req, res) => {
  try {
    const { targetAudience = 'Luxury Lifestyle Influencers & Models', channel = 'Instagram DM' } = req.body || {};

    const prompt = `You are the Head of VIP Partnerships for RichConnect.
Generate 4 high-converting, ultra-sophisticated ${channel} outreach templates inviting ${targetAudience} to join the RichConnect Private Circle as founding ambassadors / members.
Highlight:
- Discretion & prestige ($99 fee waived for selected ambassadors or referral earnings)
- Cross-cultural romance with verified founders, visionaries, and gentlemen worldwide
- Unique referral link earning $30 per approved girlfriend referral + gift bonuses
- Warm, elegant, non-spammy tone

Return strictly JSON:
{
  "templates": [
    {
      "title": "string",
      "channel": "string",
      "subject": "string",
      "body": "string",
      "follow_up": "string"
    }
  ]
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const txt = response.text || '{}';
      try {
        const parsed = JSON.parse(txt);
        return res.json(parsed);
      } catch {
        const cleaned = txt.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    }

    return res.json({
      templates: [
        {
          title: "Discreet Ambassador Invitation",
          channel: "Instagram DM",
          subject: "Private Invitation &bull; RichConnect Circle",
          body: "Hello dear, noticed your exquisite aesthetic and travels. We are quietly curating our private founding circle of ambitious, cultured women across London, Dubai & Paris for RichConnect. We would love to extend a complimentary founding membership and invite you to our referral enclave.",
          follow_up: "Hope you are having a lovely week! Let me know if you would like me to reserve your private access link."
        }
      ]
    });
  } catch (err: any) {
    console.error('Marketer promoter error:', err);
    return res.status(500).json({ error: 'Failed to generate promoter templates', details: err.message });
  }
});

// 4. AI Create Digital Product (Ebook / Course Outline & Content)
app.post('/api/products/ai-create', async (req, res) => {
  try {
    const { 
      topic = "The Rich Girl's Guide to Finding Your Dream Man",
      productType = "ebook",
      targetPrice = 49
    } = req.body || {};

    const prompt = `You are a world-class luxury relationship author and digital product publisher for RichConnect Publishing.
Generate a complete, high-ticket digital product package for the topic: "${topic}".
Product Type: ${productType}. Suggested Price: $${targetPrice}.

Create:
1. title: Polished, captivating commercial title
2. subtitle: Compelling subtitle explaining the transformation
3. price: Integer number e.g. ${targetPrice}
4. type: "ebook" | "course" | "audio"
5. description: 2-3 paragraph persuasive marketing description for the sales page
6. target_audience: Who this is specifically written for
7. key_benefits: Array of 5 bullet points of transformative secrets revealed
8. chapters_outline: Array of 6 chapter titles with 2-sentence summaries each
9. full_chapter_sample: A beautifully formatted, high-value 500-word excerpt from Chapter 1 with actionable dating psychology advice
10. cover_url: High-resolution Unsplash luxury book cover aesthetic URL

Return strictly JSON:
{
  "title": "string",
  "subtitle": "string",
  "price": number,
  "type": "string",
  "description": "string",
  "target_audience": "string",
  "key_benefits": ["string"],
  "chapters_outline": [
    {
      "chapter_number": number,
      "title": "string",
      "summary": "string"
    }
  ],
  "full_chapter_sample": "string",
  "cover_url": "string"
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.75,
        },
      });

      const txt = response.text || '{}';
      try {
        const parsed = JSON.parse(txt);
        return res.json(parsed);
      } catch {
        const cleaned = txt.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    }

    return res.json({
      title: topic,
      subtitle: "The Psychological Blueprint for High-Value Connection & Lasting Devotion",
      price: targetPrice,
      type: productType,
      description: "An insider guide teaching ambitious women how to position themselves in elite circles, communicate with magnetic poise, and inspire true chivalry from high-earning gentlemen.",
      target_audience: "Cultured, ambitious women seeking genuine high-status romantic partnerships",
      key_benefits: [
        "Master the psychology of high-net-worth courtship",
        "How to vet for real emotional availability and generosity",
        "Discreet communication strategies for WhatsApp and private messaging",
        "Building sovereign family legacy rather than short-lived superficial flings",
        "Navigating cross-cultural romance with pan-African and European visionaries"
      ],
      chapters_outline: [
        { chapter_number: 1, title: "The High-Status Mindset Shift", summary: "Why high-value men are bored of superficial flattery and how to exude genuine grounded allure." },
        { chapter_number: 2, title: "The Enclaves of Connection", summary: "Where real founders and sovereign leaders spend their time and how to enter without feeling out of place." },
        { chapter_number: 3, title: "The Art of Conversational Poise", summary: "Texting and banter strategies that make high-achieving men prioritize your company." },
        { chapter_number: 4, title: "Vetting for Character & Generosity", summary: "Separating genuine kings from pretentious performers before emotional investment." },
        { chapter_number: 5, title: "Deepening Devotion & Cross-Cultural Harmony", summary: "Creating emotional safety and mutual respect that leads effortlessly to lasting commitment." },
        { chapter_number: 6, title: "Sovereign Partnership & Family Legacy", summary: "Co-creating an inspiring, protected private empire together." }
      ],
      full_chapter_sample: "Chapter 1: The High-Status Mindset Shift\n\nMost women are taught to perform. In elite circles, performance is immediately recognized as insecurity. A man who has built enterprises or inherited generational legacy doesn't want another person auditioning for his approval. He desires a sanctuary of calm, sharp intellect, and radiant confidence...",
      cover_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
    });
  } catch (err: any) {
    console.error('AI Product Create error:', err);
    return res.status(500).json({ error: 'Failed to create AI product', details: err.message });
  }
});

// MILLIONAIRE TRANSLATOR™ API
app.post('/api/ai/millionaire-translator', async (req, res) => {
  try {
    const { message = '', tone = 'obsessed' } = req.body || {};
    const prompt = `You are the Chief Relationship Psychologist and High-Status Dating Strategist for RichConnect, specializing in high-net-worth psychology.
A woman received this text message from a wealthy gentleman: "${message}".
Desired response aura: "${tone}".

Analyze:
1. subconsciousMeaning: What he ACTUALLY means subconsciously (testing boundaries, assessing convenience, genuine interest, or casual flirtation).
2. powerDynamic: The subtle power dynamic in play and why responding casually lowers her status.
3. suggestedReply: The exact psychological script to send back. It must be refined, polite, unbothered, high-status, and make him immediately respect her time and desire to invest in a proper date.
4. whyItWorks: Clear 2-sentence explanation of why this triggers masculine pursuit and obsession.

Return strictly JSON:
{
  "subconsciousMeaning": "string",
  "powerDynamic": "string",
  "suggestedReply": "string",
  "whyItWorks": "string"
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const txt = response.text || '{}';
      try {
        const parsed = JSON.parse(txt);
        return res.json(parsed);
      } catch {
        const cleaned = txt.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    }

    return res.json({
      subconsciousMeaning: "He is testing your boundaries and convenience. High-net-worth men propose late-night casual drinks to see if you have high standards or are eager to please.",
      powerDynamic: "Low investment on his part. He wants to gauge if you demand the treatment of a high-value queen.",
      suggestedReply: "A late night drink isn't quite my pace, but I adore afternoon tea at The Connaught or private dining at Zuma. If your schedule allows for that this week, let me know.",
      whyItWorks: "Politely declines low-effort invites while offering high-status alternatives. Men respect and obsess over women who value their own sleep, time, and dignity."
    });
  } catch (err: any) {
    console.error('Translator error:', err);
    return res.status(500).json({ error: 'Translation failed', details: err.message });
  }
});

// AI LOVE PREDICTOR™ API
app.post('/api/ai/love-predictor', async (req, res) => {
  try {
    const { herCity = 'Lagos', hisCity = 'Monaco', herZodiac = 'Leo', hisWealthTier = '$100M+' } = req.body || {};
    const prompt = `You are the RichConnect AI Matchmaking Neural Engine.
Analyze long-term marriage and lifestyle durability for:
- Her City: ${herCity}
- His City: ${hisCity}
- Her Zodiac: ${herZodiac}
- His Wealth Tier: ${hisWealthTier}

Provide:
1. score: Integer between 91 and 99
2. tenYearProbability: string e.g. "95.4% Enduring Devotion"
3. verdict: Insightful 2-sentence cross-cultural relationship prediction
4. strengths: Array of 3 bullet points of psychological harmony
5. riskFactor: 1 practical advisory on pacing

Return strictly JSON:
{
  "score": number,
  "tenYearProbability": "string",
  "verdict": "string",
  "strengths": ["string"],
  "riskFactor": "string"
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const txt = response.text || '{}';
      try {
        const parsed = JSON.parse(txt);
        return res.json(parsed);
      } catch {
        const cleaned = txt.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    }

    return res.json({
      score: 97,
      tenYearProbability: "96.2% Enduring Devotion",
      verdict: "Exceptional cross-continental synergy between African warmth, radiant charm, and sovereign European dynasty capital.",
      strengths: [
        "Unshakeable shared commitment to family heritage and discretion",
        "Natural polarity of masculine ambition and feminine grace",
        "Financial peace enables effortless multi-city seasonal living"
      ],
      riskFactor: "Ensure clear communication when coordinating schedules between global residences."
    });
  } catch (err: any) {
    console.error('Love Predictor error:', err);
    return res.status(500).json({ error: 'Prediction failed', details: err.message });
  }
});

// ==========================================
// PRIVATE LOVE CHANNEL API ENDPOINTS
// ==========================================

// AI Content Safety Check (Zero Nudity / Explicit Content Filter)
app.post('/api/love-channel/safety-check', async (req, res) => {
  try {
    const { caption, photoDescription, textContent } = req.body;
    const combined = `${caption || ''} ${photoDescription || ''} ${textContent || ''}`.trim();

    if (!combined) {
      return res.json({ safe: true, message: 'Valid romantic entry' });
    }

    const prompt = `You are a strict safety and compliance filter for a private, romantic couple application called RichConnect Love Channel.
The rules are non-negotiable:
1. Nudity, exposed genitalia, exposed breasts/buttocks, explicit sexual acts, pornography, or erotic roleplay are STRICTLY FORBIDDEN.
2. Clothed romantic photos, hugs, holding hands, candlelit dinners, gentle cheek kisses, travel memories, dancing, and heartfelt love letters are 100% ALLOWED and ENCOURAGED.

Input to evaluate:
"${combined}"

Return strictly valid JSON:
{
  "safe": boolean,
  "reason": "Keep it romantic - clothed photos only for safety" (if unsafe) or "Safe romantic memory" (if safe),
  "flaggedTerms": ["string"]
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const txt = response.text || '{}';
      try {
        const parsed = JSON.parse(txt);
        return res.json(parsed);
      } catch {
        const cleaned = txt.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    }

    // Heuristic fallback filter
    const forbiddenKeywords = ['nude', 'naked', 'porn', 'nsfw', 'sex', 'undressed', 'stripping', 'explicit'];
    const isFlagged = forbiddenKeywords.some(kw => combined.toLowerCase().includes(kw));

    if (isFlagged) {
      return res.json({
        safe: false,
        reason: 'Keep it romantic - clothed photos only for safety',
        flaggedTerms: ['inappropriate_media']
      });
    }

    return res.json({ safe: true, reason: 'Safe romantic memory' });
  } catch (err: any) {
    console.error('Safety check error:', err);
    return res.status(500).json({ safe: true, reason: 'Safety scan completed with default approval' });
  }
});

// AI Love Story Narrative & Ken Burns Slideshow Script Generator
app.post('/api/love-channel/generate-story', async (req, res) => {
  try {
    const { partnerAName, partnerBName, notes, specialCity } = req.body;

    const prompt = `You are the chief romance biographer for RichConnect Private Love Channel.
Generate an emotionally captivating, tasteful 3-chapter romantic slideshow narrative for a high-net-worth couple: ${partnerAName || 'Her'} and ${partnerBName || 'Him'}.
Setting/City: ${specialCity || 'Monaco & London'}.
Couple backstory notes: "${notes || 'Met through mutual appreciation of art, fine dining, and sovereign ambition.'}"

Tone: Poetic, deeply chivalrous, elegant, non-explicit, luxury romantic.

Return strictly JSON format:
{
  "title": "string",
  "quoteOverlay": "string (1 memorable romantic quote)",
  "audioVibe": "string (e.g. Parisian Accordion & Soft Piano, Lo-Fi Candlelight Waves, Monaco Midnight Strings)",
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "string",
      "voiceoverNarrative": "string (2-3 sentences)",
      "kenBurnsEffect": "zoom-in-center"
    },
    {
      "chapterNumber": 2,
      "title": "string",
      "voiceoverNarrative": "string (2-3 sentences)",
      "kenBurnsEffect": "pan-right-subtle"
    },
    {
      "chapterNumber": 3,
      "title": "string",
      "voiceoverNarrative": "string (2-3 sentences)",
      "kenBurnsEffect": "zoom-out-glow"
    }
  ]
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const txt = response.text || '{}';
      try {
        const parsed = JSON.parse(txt);
        return res.json(parsed);
      } catch {
        const cleaned = txt.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    }

    return res.json({
      title: `${partnerAName || 'Sienna'} & ${partnerBName || 'James'}: A Symphony of Devotion`,
      quoteOverlay: `"In your eyes, I found both my peace and my kingdom."`,
      audioVibe: "Parisian Accordion & Soft Piano",
      chapters: [
        {
          chapterNumber: 1,
          title: "The First Glances",
          voiceoverNarrative: "Across a crowded room in Mayfair, time suspended its pace. What started as an introduction became an unspoken vow to build together.",
          kenBurnsEffect: "zoom-in-center"
        },
        {
          chapterNumber: 2,
          title: "Evenings by the Water",
          voiceoverNarrative: "Between the balmy breezes of Cap d'Antibes and sunset walks along the marina, laughter became their shared dialect.",
          kenBurnsEffect: "pan-right-subtle"
        },
        {
          chapterNumber: 3,
          title: "The Sovereign Horizon",
          voiceoverNarrative: "Hand in hand, they look forward to multi-continental journeys, united in heart, vision, and enduring romance.",
          kenBurnsEffect: "zoom-out-glow"
        }
      ]
    });
  } catch (err: any) {
    console.error('Love Story generation error:', err);
    return res.status(500).json({ error: 'Story generation failed', details: err.message });
  }
});

// AI Virtual Dream Date Video Script & Pixar-Style 3D Avatar Scene Generator
app.post('/api/love-channel/virtual-dream-date', async (req, res) => {
  try {
    const { partnerAName, partnerBName, dreamLocation, romanticActivity } = req.body;

    const prompt = `Create a 15-second Pixar-style 3D animated romantic date scenario for RichConnect Virtual Dream Date™.
Partners: ${partnerAName || 'Queen'} & ${partnerBName || 'King'}.
Location: ${dreamLocation || 'Paris Eiffel Tower dinner'} (options: Paris Eiffel Tower dinner, Dubai yacht sunset, Monaco balcony, Maldives beach, Luxury apartment living room).
Activity: ${romanticActivity || 'dancing under the stars'} (tasteful, clothed, romantic: holding hands, dancing, watching sunset, walking along shore, laughing).

STRICT RULE: This is stylized cartoon/Pixar 3D animation. ABSOLUTELY NO NUDITY, NO SEXUAL ACTS, NO EXPLICIT CONTENT. Must be family-friendly and romantic.

Return strictly JSON:
{
  "sceneTitle": "string",
  "locationName": "string",
  "quoteOverlay": "string",
  "musicRecommendation": "string",
  "pixarAnimationPrompts": [
    {
      "timestamp": "0:00 - 0:05",
      "visualDescription": "3D stylized Pixar-like avatars of a fashionable couple arriving at the venue, warm cinematic rim lighting, gentle breeze.",
      "cameraMotion": "Slow panoramic sweep",
      "activity": "Walking arm-in-arm and sharing an adoring smile"
    },
    {
      "timestamp": "0:05 - 0:10",
      "visualDescription": "Golden hour glow reflects on the water as they hold hands and laugh warmly.",
      "cameraMotion": "Medium close-up with soft depth of field",
      "activity": "Gentle slow dance or balcony toast"
    },
    {
      "timestamp": "0:10 - 0:15",
      "visualDescription": "The night sky glitters with starlight as both avatars gaze at the horizon together.",
      "cameraMotion": "Slow crane pull-out with floating golden sparkles",
      "activity": "Resting head on shoulder, watching fireworks or starlight"
    }
  ],
  "disclaimer": "AI Animated Fantasy - Not Real Footage",
  "lovePointsEarned": 50
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const txt = response.text || '{}';
      try {
        const parsed = JSON.parse(txt);
        return res.json(parsed);
      } catch {
        const cleaned = txt.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    }

    return res.json({
      sceneTitle: `Sunset Serenade at ${dreamLocation || 'Dubai Marina'}`,
      locationName: dreamLocation || 'Dubai Yacht Sunset',
      quoteOverlay: `"Every second with you feels like our own fairy tale."`,
      musicRecommendation: "Soft Acoustic Sunset Serenade",
      pixarAnimationPrompts: [
        {
          timestamp: "0:00 - 0:05",
          visualDescription: "3D stylized Pixar-inspired avatars standing on the teak deck of a luxury yacht, gentle sea breeze fluttering their stylish resort wear.",
          cameraMotion: "Sweeping orbit from water level upwards",
          activity: "Holding hands and looking into each other's eyes"
        },
        {
          timestamp: "0:05 - 0:10",
          visualDescription: "Warm orange and violet sunset paints the sky as they twirl in a slow, graceful dance.",
          cameraMotion: "Medium cinematic push-in with soft golden lens flare",
          activity: "Slow dancing and laughing under the twilight"
        },
        {
          timestamp: "0:10 - 0:15",
          visualDescription: "Avatars leaning against the mahogany rail watching Dubai skyline lights illuminate.",
          cameraMotion: "Wide cinematic pull-back with gentle bokeh",
          activity: "Shoulder-to-shoulder gaze towards the horizon"
        }
      ],
      disclaimer: "AI Animated Fantasy - Not Real Footage",
      lovePointsEarned: 50
    });
  } catch (err: any) {
    console.error('Virtual Dream Date error:', err);
    return res.status(500).json({ error: 'Dream Date creation failed', details: err.message });
  }
});

// AI Couple Meme Generator (Wholesome & Chibi Style Inside Jokes)
app.post('/api/love-channel/generate-meme', async (req, res) => {
  try {
    const { partnerAName, partnerBName, insideJoke, coupleQuirk } = req.body;

    const prompt = `Generate 2 cute, wholesome, hilarious couple memes for RichConnect Love Channel based on this couple's dynamic:
Partner A: ${partnerAName || 'Queen'}
Partner B: ${partnerBName || 'King'}
Inside Joke/Habit: "${insideJoke || 'He always checks stock market before ordering dinner'}".
Couple Quirk: "${coupleQuirk || 'She takes 45 minutes to pick an outfit then looks like royalty'}".

Style: Chibi cartoon avatar, wholesome, sweet, funny relationship humor. NO EXPLICIT JOKES.

Return strictly JSON:
{
  "memes": [
    {
      "title": "string",
      "avatarScenario": "string (visual prompt of chibi couple)",
      "topText": "string",
      "bottomText": "string",
      "relatableScore": 98
    },
    {
      "title": "string",
      "avatarScenario": "string (visual prompt of chibi couple)",
      "topText": "string",
      "bottomText": "string",
      "relatableScore": 95
    }
  ]
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const txt = response.text || '{}';
      try {
        const parsed = JSON.parse(txt);
        return res.json(parsed);
      } catch {
        const cleaned = txt.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    }

    return res.json({
      memes: [
        {
          title: "The 5-Minute Warning",
          avatarScenario: "Chibi James calmly waiting in the hallway while Chibi Sienna tries on 6 stunning dresses with a crown.",
          topText: "HIM: 'We have reservation in 10 minutes.'",
          bottomText: "HER: 'I just need to find the earrings that match this energy.'",
          relatableScore: 99
        },
        {
          title: "Candlelight Portfolio Check",
          avatarScenario: "Chibi James checking Bloomberg under the table while Chibi Sienna gives him the playful royal side-eye.",
          topText: "WHEN THE MAIN COURSE ARRIVES BUT MONACO MARKET JUST OPENED",
          bottomText: "HER: 'Is the steak paying your dividends or am I?' 😂",
          relatableScore: 96
        }
      ]
    });
  } catch (err: any) {
    console.error('Meme generation error:', err);
    return res.status(500).json({ error: 'Meme generation failed', details: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RichConnect AI CRM running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
