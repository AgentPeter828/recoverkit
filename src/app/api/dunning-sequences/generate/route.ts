import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const TONE_DESCRIPTIONS: Record<string, string> = {
  friendly:
    "Casual, warm, human. Use contractions, be reassuring, sound like a helpful friend.",
  professional:
    "Clean, business-like, confident. Clear and polished but not cold.",
  direct: "Short, action-oriented, no fluff. Get to the point fast.",
  empathetic:
    "Warm, understanding, acknowledge the customer's situation. Be genuinely caring.",
  formal:
    "Corporate, polished, respectful. Proper grammar, no slang, dignified tone.",
};

const STEP_INTENTS = [
  "Gentle first notice. Payment just failed. Keep it light and reassuring.",
  "Follow-up reminder. Payment still outstanding. Slightly more concern.",
  "Escalation. Multiple retry failures. Make it clear action is needed.",
  "Urgent notice. Subscription at risk. Create genuine urgency.",
  "Final notice. Account will be cancelled. Last chance to act.",
];

const DELAY_HOURS = [4, 24, 72, 120, 240];

/**
 * POST — generate a 5-step dunning email sequence using Gemini Flash,
 * personalised to the user's business description and chosen tone.
 *
 * Body: { businessDescription: string, tone: string }
 */
export async function POST(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { businessDescription, tone, websiteUrl, senderName } = body as {
    businessDescription: string;
    tone: string;
    websiteUrl?: string;
    senderName?: string;
  };

  if (!businessDescription?.trim()) {
    return NextResponse.json(
      { error: "Please describe your business" },
      { status: 400 }
    );
  }
  if (!tone || !TONE_DESCRIPTIONS[tone]) {
    return NextResponse.json({ error: "Invalid tone" }, { status: 400 });
  }

  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "AI generation is not configured. Please contact support." },
      { status: 500 }
    );
  }

  const toneDesc = TONE_DESCRIPTIONS[tone];

  const signOff = senderName ? `Regards,\n${senderName}` : "Regards,\nThe Team";
  const websiteNote = websiteUrl
    ? `\n- Naturally mention or link to the business website (${websiteUrl}) where appropriate — e.g. "visit ${websiteUrl} if you need help" or "log in at ${websiteUrl}". Don't force it into every email, just where it fits.`
    : "";

  const prompt = `You are an expert dunning email copywriter. Generate a 5-step dunning email sequence for a SaaS/subscription business.

About the business:
${businessDescription.trim()}

Tone: ${toneDesc}

Rules:
- Never use dashes (em dash, en dash, or hyphens as sentence separators)
- Never use bullet points or lists in the email body
- Keep each email concise (3-5 short paragraphs max)
- Each email needs: subject line and plain text body
- Emails should escalate in urgency from step 1 to step 5
- Start every email with a greeting on its own line (e.g. "Hi there," or "Hey," or "Hello,") followed by a blank line before the body
- Don't include literal CTA button text in the body (we add buttons separately)
- End every email with a sign-off on its own line: "${signOff}"
- Reference the type of business/service naturally where appropriate (don't be generic)${websiteNote}

Steps:
${STEP_INTENTS.map((intent, i) => `Step ${i + 1} (sent ${DELAY_HOURS[i]}h after payment failure): ${intent}`).join("\n")}

Respond ONLY with a JSON array, no wrapping object:
[
  { "step": 1, "subject": "...", "body_text": "..." },
  { "step": 2, "subject": "...", "body_text": "..." },
  { "step": 3, "subject": "...", "body_text": "..." },
  { "step": 4, "subject": "...", "body_text": "..." },
  { "step": 5, "subject": "...", "body_text": "..." }
]`;

  try {
    const res = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://recoverkit.dev",
          "X-Title": "RecoverKit",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 3000,
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!res.ok) {
      console.error("[generate] OpenRouter error:", await res.text());
      return NextResponse.json(
        { error: "AI generation failed" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let newEmails: Array<{
      step: number;
      subject: string;
      body_text: string;
    }>;
    try {
      const parsed = JSON.parse(content);
      newEmails = Array.isArray(parsed)
        ? parsed
        : parsed.emails || parsed.steps || [];
    } catch {
      console.error("[generate] Failed to parse Gemini response:", content);
      return NextResponse.json(
        { error: "Invalid AI response" },
        { status: 500 }
      );
    }

    if (newEmails.length === 0) {
      return NextResponse.json(
        { error: "No emails generated" },
        { status: 500 }
      );
    }

    // Check if user already has a default sequence — delete it to start fresh
    const { data: existingSeq } = await supabase
      .from("rk_dunning_sequences")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .single();

    if (existingSeq) {
      await supabase
        .from("rk_dunning_emails")
        .delete()
        .eq("sequence_id", existingSeq.id);
      await supabase
        .from("rk_dunning_sequences")
        .delete()
        .eq("id", existingSeq.id);
    }

    // Create the sequence
    const { data: sequence, error: seqError } = await supabase
      .from("rk_dunning_sequences")
      .insert({
        user_id: user.id,
        name: "Recovery Sequence",
        description: `AI-generated ${tone} sequence for: ${businessDescription.slice(0, 100)}`,
        is_default: true,
        is_active: true,
      })
      .select("id")
      .single();

    if (seqError || !sequence) {
      console.error("[generate] Failed to create sequence:", seqError?.message);
      return NextResponse.json(
        { error: "Failed to save sequence" },
        { status: 500 }
      );
    }

    // Insert emails
    const emailRows = newEmails.map((email, i) => {
      const bodyText = email.body_text || "";
      const bodyHtml = bodyText
        .split("\n\n")
        .map((p: string) => `<p>${p.trim()}</p>`)
        .join("\n");

      return {
        user_id: user.id,
        sequence_id: sequence.id,
        step_number: email.step || i + 1,
        subject: email.subject,
        body_html: bodyHtml,
        body_text: bodyText,
        delay_hours: DELAY_HOURS[i] || 24,
        is_ai_generated: true,
      };
    });

    const { error: emailError } = await supabase
      .from("rk_dunning_emails")
      .insert(emailRows);

    if (emailError) {
      console.error("[generate] Failed to create emails:", emailError.message);
      await supabase
        .from("rk_dunning_sequences")
        .delete()
        .eq("id", sequence.id);
      return NextResponse.json(
        { error: "Failed to save emails" },
        { status: 500 }
      );
    }

    await logAudit(user.id, "sequence_created", {
      sequence_id: sequence.id,
      tone,
      ai_model: "gemini-3-flash-preview",
      business_description: businessDescription.slice(0, 200),
      website_url: websiteUrl || null,
      sender_name: senderName || null,
    });

    return NextResponse.json({
      success: true,
      sequence_id: sequence.id,
      email_count: emailRows.length,
    });
  } catch (err) {
    console.error("[generate] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate emails" },
      { status: 500 }
    );
  }
}
