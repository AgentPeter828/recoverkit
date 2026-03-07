import { z } from "zod";

/** Dunning email creation */
export const dunningEmailSchema = z.object({
  sequence_id: z.string().uuid(),
  subject: z.string().min(1, "Subject is required").max(200, "Subject must be 200 characters or less"),
  body_html: z.string().min(1, "Body HTML is required").max(10000, "Body must be 10,000 characters or less"),
  body_text: z.string().max(10000).optional(),
  step_number: z.number().int().min(1).max(10).optional().default(1),
  delay_hours: z.number().int().min(1).optional().default(24),
});

/** Dunning sequence creation */
export const dunningSequenceSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be 200 characters or less"),
  description: z.string().max(1000).nullable().optional(),
});

/** Payment page creation */
export const paymentPageSchema = z.object({
  title: z.string().min(1).max(200).optional().default("Update Your Payment Method"),
  message: z.string().max(2000).optional().default(
    "Your recent payment failed. Please update your payment method to continue your subscription."
  ),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .max(100)
    .optional(),
  brand_color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Brand color must be a valid hex color (e.g. #6366f1)")
    .optional()
    .default("#6366f1"),
  logo_url: z.string().url().nullable().optional(),
});

/** Campaign creation (from webhook) — validates the required fields */
export const campaignCreateSchema = z.object({
  stripe_invoice_id: z.string().min(1, "stripe_invoice_id is required"),
  stripe_customer_id: z.string().min(1),
  customer_email: z.string().email().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  amount_due: z.number().int().min(0, "amount_due must be >= 0"),
  currency: z.string().min(1),
});

/** Campaign update */
export const campaignUpdateSchema = z.object({
  status: z.enum(["active", "recovered", "failed", "cancelled"]).optional(),
  max_retries: z.number().int().min(1).max(20).optional(),
});

/** Send email request */
export const sendEmailRequestSchema = z.object({
  campaign_id: z.string().uuid(),
  dunning_email_id: z.string().uuid(),
});

/** Retry request */
export const retryRequestSchema = z.object({
  campaign_id: z.string().uuid(),
});
