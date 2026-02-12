/**
 * AI dunning email generator — uses OpenAI to write compelling recovery emails.
 * Falls back to templates when OPENAI_API_KEY is not set.
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface GenerateEmailParams {
  step_number: number;
  customer_name?: string;
  business_name?: string;
  amount: string;
  currency: string;
  tone?: "friendly" | "urgent" | "professional";
}

interface GeneratedEmail {
  subject: string;
  body_html: string;
  body_text: string;
  is_ai_generated: boolean;
}

const FALLBACK_TEMPLATES: Record<number, { subject: string; body: string }> = {
  1: {
    subject: "Your payment didn't go through — let's fix it",
    body: `<p>Hi {{name}},</p>
<p>We noticed your recent payment of <strong>{{amount}} {{currency}}</strong> didn't go through. This happens sometimes — expired cards, bank holds, etc.</p>
<p>To keep your subscription active, please update your payment method using the button below. It only takes a minute.</p>
<p>If you've already resolved this, feel free to ignore this email.</p>
<p>Thanks,<br>{{business}}</p>`,
  },
  2: {
    subject: "Quick reminder: payment update needed",
    body: `<p>Hi {{name}},</p>
<p>Just a friendly reminder that we still need an updated payment method for your subscription ({{amount}} {{currency}}).</p>
<p>We'd hate for you to lose access. Click below to update your card — it's quick and secure.</p>
<p>Best,<br>{{business}}</p>`,
  },
  3: {
    subject: "Action needed: your subscription is at risk",
    body: `<p>Hi {{name}},</p>
<p>We've tried to process your payment of <strong>{{amount}} {{currency}}</strong> multiple times without success. Your subscription will be cancelled soon if we can't collect payment.</p>
<p>Please update your payment method now to avoid any interruption.</p>
<p>— {{business}}</p>`,
  },
  4: {
    subject: "Last chance to keep your subscription",
    body: `<p>Hi {{name}},</p>
<p>This is our final reminder. Your payment of <strong>{{amount}} {{currency}}</strong> has failed and your subscription will be cancelled within 48 hours.</p>
<p>If you'd like to keep your account active, please update your payment method right away.</p>
<p>We appreciate your business.<br>{{business}}</p>`,
  },
  5: {
    subject: "We're sorry to see you go",
    body: `<p>Hi {{name}},</p>
<p>Your subscription has been cancelled due to the unpaid balance of <strong>{{amount}} {{currency}}</strong>.</p>
<p>If this was a mistake, you can reactivate at any time by updating your payment method below. We'll be here whenever you're ready to come back.</p>
<p>All the best,<br>{{business}}</p>`,
  },
};

function applyTemplate(template: string, params: GenerateEmailParams): string {
  return template
    .replace(/\{\{name\}\}/g, params.customer_name || "there")
    .replace(/\{\{amount\}\}/g, params.amount)
    .replace(/\{\{currency\}\}/g, params.currency.toUpperCase())
    .replace(/\{\{business\}\}/g, params.business_name || "The Team");
}

export async function generateDunningEmail(params: GenerateEmailParams): Promise<GeneratedEmail> {
  // Use AI if available
  if (OPENAI_API_KEY) {
    try {
      const tone = params.tone || (params.step_number <= 2 ? "friendly" : params.step_number <= 4 ? "professional" : "urgent");
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You write dunning (failed payment recovery) emails for SaaS businesses. Write in a ${tone} tone. Return JSON with "subject" and "body_html" and "body_text" fields. The HTML should be simple paragraphs (no full HTML doc). Step ${params.step_number} of 5 in the sequence — earlier steps are gentler, later steps are more urgent.`,
            },
            {
              role: "user",
              content: `Write a dunning email (step ${params.step_number}/5) for customer "${params.customer_name || "the customer"}" who owes ${params.amount} ${params.currency.toUpperCase()} to "${params.business_name || "our SaaS"}". Keep it concise (3-4 paragraphs max).`,
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 500,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = JSON.parse(data.choices[0].message.content);
        return {
          subject: content.subject,
          body_html: content.body_html,
          body_text: content.body_text || content.body_html.replace(/<[^>]*>/g, ""),
          is_ai_generated: true,
        };
      }
    } catch (err) {
      console.warn("[ai-dunning] OpenAI call failed, using template:", err);
    }
  }

  // Fallback to templates
  console.warn("[ai-dunning] No OPENAI_API_KEY, using template for step", params.step_number);
  const template = FALLBACK_TEMPLATES[Math.min(params.step_number, 5)] || FALLBACK_TEMPLATES[1];
  const bodyHtml = applyTemplate(template.body, params);
  return {
    subject: template.subject,
    body_html: bodyHtml,
    body_text: bodyHtml.replace(/<[^>]*>/g, ""),
    is_ai_generated: false,
  };
}
