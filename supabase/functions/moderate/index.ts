// Supabase Edge Function: Moderation Agent
// Trigger: Event-based ONLY when message or image is sent
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
    const { text = "", imageUrl = "" } = await req.json().catch(() => ({}));
    const groqKey = Deno.env.get("GROQ_API_KEY") || "";

    let evaluation = {
      allowed: true,
      severity: "safe",
      flags: [],
      reason: "Message compliant with RichConnect luxury communication standards."
    };

    if (/wire|cashapp|crypto|scam|threat/i.test(text)) {
      evaluation = {
        allowed: false,
        severity: "warning",
        flags: ["Security Policy Intercept"],
        reason: "Financial solicitation or sensitive keywords detected."
      };
    }

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
            { role: "system", content: "You are the RichConnect Moderation Agent. Evaluate text/image for toxicity, off-platform leaks, and financial scams. Output JSON with {allowed: boolean, severity: 'safe'|'warning'|'blocked', flags: string[], reason: string}." },
            { role: "user", content: `Text: "${text}", Image: "${imageUrl}"` }
          ],
          response_format: { type: "json_object" }
        })
      });
      if (res.ok) {
        const json = await res.json();
        evaluation = JSON.parse(json.choices[0].message.content);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        agent: "Moderation Agent",
        trigger: "MESSAGE_SENT_EVENT",
        execution: "Supabase Edge Function (Deno - Event Driven)",
        evaluation
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
