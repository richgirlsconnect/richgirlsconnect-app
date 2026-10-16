// Supabase Edge Function: Matchmaker Agent
// Trigger: Cron 2x daily or on-demand HTTP POST
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
    const groqKey = Deno.env.get("GROQ_API_KEY") || "";
    let matchData = {
      score: 96,
      reason: "Aligned high-net-worth status and cross-cultural synergy. Global mobility across London, Lagos, and Monaco.",
      synergyFactors: ["Cross-Cultural Synergy", "Wealth Tier Alignment", "Monogamous Intent"]
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
            { role: "system", content: "You are the RichConnect AI Matchmaker evaluating high-net-worth candidates. Output JSON with score (0-100), reason, and synergyFactors array." },
            { role: "user", content: "Evaluate cross-cultural alignment for VIP private clients." }
          ],
          response_format: { type: "json_object" }
        })
      });
      if (res.ok) {
        const json = await res.json();
        matchData = JSON.parse(json.choices[0].message.content);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        agent: "Matchmaker Agent",
        schedule: "Cron 2x Daily + On Demand",
        execution: "Supabase Edge Function (Deno)",
        match: matchData
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
