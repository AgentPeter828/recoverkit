import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * GET — generate a recommended payment page message based on the user's
 * existing dunning email tone, business name, and communication style.
 */
export async function GET() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Gather context about the user's account
  const [emailsResult, pagesResult, connectionResult] = await Promise.all([
    // Get their dunning emails to analyze tone
    supabase
      .from("rk_dunning_emails")
      .select("subject, body_text, step_number")
      .eq("user_id", user.id)
      .order("step_number", { ascending: true })
      .limit(5),
    // Get existing payment pages for consistency
    supabase
      .from("rk_payment_update_pages")
      .select("title, message")
      .eq("user_id", user.id)
      .limit(3),
    // Get business info from Stripe connection
    supabase
      .from("rk_stripe_connections")
      .select("business_name, stripe_account_id")
      .eq("user_id", user.id)
      .single(),
  ]);

  const emails = emailsResult.data || [];
  const existingPages = pagesResult.data || [];
  const connection = connectionResult.data;
  const businessName = connection?.business_name || null;
  const userEmail = user.email || "";
  const displayName = user.user_metadata?.full_name || userEmail.split("@")[0];

  // If no AI key, return a smart default based on whatever we know
  if (!OPENAI_API_KEY) {
    const fallback = businessName
      ? `There was an issue with your recent ${businessName} payment. Please update your payment details below to keep your account active. It only takes a moment.`
      : "There was an issue with your recent payment. Please update your payment details below to keep your account active. It only takes a moment.";
    return NextResponse.json({ message: fallback, source: "default" });
  }

  // Build context for the AI
  const emailSamples = emails
    .map((e) => `Step ${e.step_number} subject: "${e.subject}"\n${e.body_text?.slice(0, 200) || ""}`)
    .join("\n\n");

  const existingPageMessages = existingPages
    .map((p) => p.message)
    .filter(Boolean)
    .join("\n");

  const prompt = `You are a copywriting assistant for a SaaS payment recovery tool. 
A user needs a short message for their payment update page (the page customers see when they need to update their credit card after a failed payment).

Generate ONE message (2-3 sentences max) that matches the tone and style of their existing communications.

Context about this user:
- Business name: ${businessName || "Unknown"}
- User name: ${displayName}
${emails.length > 0 ? `\nTheir existing dunning email style:\n${emailSamples}` : ""}
${existingPageMessages ? `\nTheir existing payment page messages:\n${existingPageMessages}` : ""}

Rules:
- Match the tone of their existing emails (formal/casual/friendly/direct)
- If no existing emails, use a warm professional tone
- 2-3 sentences maximum
- Don't use dashes (em dash or hyphens as separators)
- Don't use bullet points
- Include the business name naturally if known
- The message should reassure the customer and explain what to do
- Output ONLY the message text, nothing else`;

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
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      console.error("[recommended-message] OpenAI error:", await res.text());
      return NextResponse.json({
        message: businessName
          ? `There was an issue with your recent ${businessName} payment. Please update your payment details below to keep your account active.`
          : "There was an issue with your recent payment. Please update your payment details below to keep your account active.",
        source: "fallback",
      });
    }

    const data = await res.json();
    const message = data.choices?.[0]?.message?.content?.trim();

    if (!message) {
      return NextResponse.json({
        message: "There was an issue with your recent payment. Please update your payment details below to keep your account active.",
        source: "fallback",
      });
    }

    return NextResponse.json({ message, source: "ai" });
  } catch (err) {
    console.error("[recommended-message] Error:", err);
    return NextResponse.json({
      message: "There was an issue with your recent payment. Please update your payment details below to keep your account active.",
      source: "fallback",
    });
  }
}
