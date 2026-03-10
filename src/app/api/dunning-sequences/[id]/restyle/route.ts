import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const TONE_DESCRIPTIONS: Record<string, string> = {
  friendly: "Casual, warm, human. Use contractions, be reassuring, sound like a helpful friend.",
  professional: "Clean, business-like, confident. Clear and polished but not cold.",
  direct: "Short, action-oriented, no fluff. Get to the point fast.",
  empathetic: "Warm, understanding, acknowledge the customer's situation. Be genuinely caring.",
  formal: "Corporate, polished, respectful. Proper grammar, no slang, dignified tone.",
};

const STEP_INTENTS = [
  "Gentle first notice. Payment just failed. Keep it light and reassuring.",
  "Follow-up reminder. Payment still outstanding. Slightly more concern.",
  "Escalation. Multiple retry failures. Make it clear action is needed.",
  "Urgent notice. Subscription at risk. Create genuine urgency.",
  "Final notice. Account will be cancelled. Last chance to act.",
];

/**
 * POST — restyle all emails in a sequence to a given tone.
 * Body: { tone: "friendly" | "professional" | "direct" | "empathetic" | "formal" }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const tone = body.tone as string;

  if (!tone || !TONE_DESCRIPTIONS[tone]) {
    return NextResponse.json({ error: "Invalid tone" }, { status: 400 });
  }

  // Verify ownership
  const { data: seq } = await supabase
    .from("rk_dunning_sequences")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!seq) return NextResponse.json({ error: "Sequence not found" }, { status: 404 });

  // Get existing emails
  const { data: emails } = await supabase
    .from("rk_dunning_emails")
    .select("id, step_number, delay_hours")
    .eq("sequence_id", id)
    .order("step_number", { ascending: true });

  if (!emails || emails.length === 0) {
    return NextResponse.json({ error: "No emails to restyle" }, { status: 400 });
  }

  // Generate new copy for each email
  if (!OPENAI_API_KEY) {
    return NextResponse.json({
      error: "AI generation is not configured. Please contact support.",
    }, { status: 500 });
  }

  const toneDesc = TONE_DESCRIPTIONS[tone];

  const prompt = `You are a dunning email copywriter. Generate a ${emails.length}-step dunning email sequence for SaaS subscription payment recovery.

Tone: ${toneDesc}

Rules:
- Never use dashes (em dash, en dash, or hyphens as sentence separators)
- Never use bullet points or lists in the email body
- Keep each email concise (3-5 short paragraphs max)
- Each email needs: subject line and plain text body
- Emails should escalate in urgency from step 1 to step ${emails.length}
- Address the customer as "Hi there" (not by name, we'll personalize later)
- Don't include literal CTA button text in the body (we add buttons separately)
- Sign off simply, no "Team" signatures needed

${emails.map((e, i) => `Step ${e.step_number} (sent ${e.delay_hours}h after payment failure): ${STEP_INTENTS[i] || "Recovery email"}`).join("\n")}

Respond in JSON format:
[
  { "step": 1, "subject": "...", "body_text": "..." },
  { "step": 2, "subject": "...", "body_text": "..." },
  ...
]`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      console.error("[restyle] OpenAI error:", await res.text());
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    const parsed = JSON.parse(content);
    const newEmails = parsed.emails || parsed.steps || parsed;

    if (!Array.isArray(newEmails) || newEmails.length === 0) {
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    // Update each email in the database
    for (const email of emails) {
      const generated = newEmails.find(
        (g: { step: number }) => g.step === email.step_number
      );
      if (!generated) continue;

      const bodyText = generated.body_text || generated.body || "";
      // Convert plain text to basic HTML
      const bodyHtml = bodyText
        .split("\n\n")
        .map((p: string) => `<p>${p.trim()}</p>`)
        .join("\n");

      await supabase
        .from("rk_dunning_emails")
        .update({
          subject: generated.subject,
          body_text: bodyText,
          body_html: bodyHtml,
          is_ai_generated: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", email.id);
    }

    return NextResponse.json({ success: true, tone, updated: emails.length });
  } catch (err) {
    console.error("[restyle] Error:", err);
    return NextResponse.json({ error: "Failed to restyle emails" }, { status: 500 });
  }
}
