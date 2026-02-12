-- RecoverKit Domain Tables
-- Product: RecoverKit — AI-powered failed payment recovery for SaaS

-- Stripe OAuth connections from customers
CREATE TABLE public.stripe_connections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_account_id text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  livemode boolean DEFAULT false,
  scope text,
  business_name text,
  connected_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(stripe_account_id)
);

ALTER TABLE public.stripe_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own stripe_connections" ON public.stripe_connections
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_stripe_connections_user ON public.stripe_connections(user_id);

-- Recovery campaigns (one per failed invoice)
CREATE TABLE public.recovery_campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id text NOT NULL,
  stripe_customer_id text NOT NULL,
  stripe_subscription_id text,
  customer_email text,
  customer_name text,
  amount_due integer NOT NULL DEFAULT 0,
  currency text DEFAULT 'usd',
  status text DEFAULT 'active' CHECK (status IN ('active', 'recovered', 'failed', 'cancelled')),
  failure_code text,
  failure_message text,
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 5,
  next_retry_at timestamptz,
  recovered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.recovery_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own recovery_campaigns" ON public.recovery_campaigns
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_recovery_campaigns_user ON public.recovery_campaigns(user_id);
CREATE INDEX idx_recovery_campaigns_status ON public.recovery_campaigns(status);
CREATE INDEX idx_recovery_campaigns_next_retry ON public.recovery_campaigns(next_retry_at);
CREATE INDEX idx_recovery_campaigns_invoice ON public.recovery_campaigns(stripe_invoice_id);

-- Individual recovery attempts (retries)
CREATE TABLE public.recovery_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id uuid NOT NULL REFERENCES public.recovery_campaigns(id) ON DELETE CASCADE,
  attempt_number integer NOT NULL DEFAULT 1,
  attempt_type text DEFAULT 'retry' CHECK (attempt_type IN ('retry', 'email', 'payment_link')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'skipped')),
  stripe_payment_intent_id text,
  error_code text,
  error_message text,
  scheduled_at timestamptz,
  executed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.recovery_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own recovery_attempts" ON public.recovery_attempts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_recovery_attempts_campaign ON public.recovery_attempts(campaign_id);
CREATE INDEX idx_recovery_attempts_user ON public.recovery_attempts(user_id);

-- Dunning email sequences (templates)
CREATE TABLE public.dunning_sequences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Default Sequence',
  description text,
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.dunning_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own dunning_sequences" ON public.dunning_sequences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_dunning_sequences_user ON public.dunning_sequences(user_id);

-- Individual emails in a dunning sequence
CREATE TABLE public.dunning_emails (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence_id uuid NOT NULL REFERENCES public.dunning_sequences(id) ON DELETE CASCADE,
  step_number integer NOT NULL DEFAULT 1,
  subject text NOT NULL,
  body_html text NOT NULL,
  body_text text,
  delay_hours integer NOT NULL DEFAULT 24,
  is_ai_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.dunning_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own dunning_emails" ON public.dunning_emails
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_dunning_emails_sequence ON public.dunning_emails(sequence_id);
CREATE INDEX idx_dunning_emails_user ON public.dunning_emails(user_id);

-- Payment update pages (hosted links for customers)
CREATE TABLE public.payment_update_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text DEFAULT 'Update Your Payment Method',
  message text DEFAULT 'Your recent payment failed. Please update your payment method to continue your subscription.',
  brand_color text DEFAULT '#6366f1',
  logo_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(slug)
);

ALTER TABLE public.payment_update_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own payment_update_pages" ON public.payment_update_pages
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_payment_update_pages_user ON public.payment_update_pages(user_id);
CREATE INDEX idx_payment_update_pages_slug ON public.payment_update_pages(slug);

-- Sent dunning emails log
CREATE TABLE public.sent_emails (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id uuid NOT NULL REFERENCES public.recovery_campaigns(id) ON DELETE CASCADE,
  dunning_email_id uuid REFERENCES public.dunning_emails(id) ON DELETE SET NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  status text DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  resend_message_id text,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.sent_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own sent_emails" ON public.sent_emails
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_sent_emails_campaign ON public.sent_emails(campaign_id);
CREATE INDEX idx_sent_emails_user ON public.sent_emails(user_id);
