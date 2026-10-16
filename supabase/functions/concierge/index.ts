// Supabase Edge Function: Concierge Agent
// Trigger: Event-based ONLY when user chats AI / requests wingman
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query = "", partnerName = "VIP Candidate" } = await req.json().catch(() => ({}));
    const groqKey = Deno.env.get("GROQ_API_KEY") || "";

    let concierge = {
      reply: `For planning an effortless rendezvous with ${partnerName}, reserve a corner table at a private members club like Oswald's or 5 Hertford Street in Mayfair. Prioritize cultural conversation, genuine curiosity, and relaxed charisma.`,
      icebreakers: [
        `"I was just reflecting on international art curation—let's continue that thought over vintage champagne."`,
        `"Between meetings in London and Lagos, my Thursday evening is reserved for exceptional company."`
      ],
      recommendedVenue: "Oswald's Mayfair, London",
      etiquetteTip: "Discreetly arrange valet and table champagne prior to arrival."
    };

    if (groqKey) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are the RichConnect AI Concierge for high-net-worth courtship. Output JSON with {reply: string, icebreakers: string[], recommendedVenue: string, etiquetteTip: string}." },
            { role: "user", content: `Query: "${query}", Partner: "${partnerName}"` }
          ],
          response_format: { type: "json_object" }
        })
      });
      if (res.ok) {
        const json = await res.json();
        concierge = JSON.parse(json.choices[0].message.content);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        agent: "Concierge Agent",
        trigger: "USER_CHAT_EVENT",
        execution: "Supabase Edge Function (Deno - Event Driven)",
        concierge
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
