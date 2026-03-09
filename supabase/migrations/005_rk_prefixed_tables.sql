-- RecoverKit prefixed domain tables
-- The app code uses rk_ prefixed tables to avoid collisions on shared Supabase instances

-- Recovery Campaigns
CREATE TABLE IF NOT EXISTS rk_recovery_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_invoice_id TEXT NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    stripe_subscription_id TEXT,
    customer_email TEXT,
    customer_name TEXT,
    amount_due INTEGER NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'active' CHECK (status IN ('active','recovered','failed','cancelled')),
    failure_code TEXT,
    failure_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 5,
    next_retry_at TIMESTAMPTZ,
    recovered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rk_recovery_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rk_rc_crud" ON rk_recovery_campaigns FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rk_rc_service" ON rk_recovery_campaigns FOR ALL USING (true) WITH CHECK (true);

-- Recovery Attempts
CREATE TABLE IF NOT EXISTS rk_recovery_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES rk_recovery_campaigns(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    attempt_type TEXT DEFAULT 'retry' CHECK (attempt_type IN ('retry','email','payment_link')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','success','failed','skipped')),
    stripe_payment_intent_id TEXT,
    error_code TEXT,
    error_message TEXT,
    scheduled_at TIMESTAMPTZ,
    executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rk_recovery_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rk_ra_crud" ON rk_recovery_attempts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rk_ra_service" ON rk_recovery_attempts FOR ALL USING (true) WITH CHECK (true);

-- Dunning Sequences
CREATE TABLE IF NOT EXISTS rk_dunning_sequences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Default Sequence',
    description TEXT,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rk_dunning_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rk_ds_crud" ON rk_dunning_sequences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rk_ds_service" ON rk_dunning_sequences FOR ALL USING (true) WITH CHECK (true);

-- Dunning Emails
CREATE TABLE IF NOT EXISTS rk_dunning_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sequence_id UUID NOT NULL REFERENCES rk_dunning_sequences(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL DEFAULT 1,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    delay_hours INTEGER NOT NULL DEFAULT 24,
    is_ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rk_dunning_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rk_de_crud" ON rk_dunning_emails FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rk_de_service" ON rk_dunning_emails FOR ALL USING (true) WITH CHECK (true);

-- Payment Update Pages
CREATE TABLE IF NOT EXISTS rk_payment_update_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    title TEXT DEFAULT 'Update Your Payment Method',
    message TEXT,
    brand_color TEXT DEFAULT '#6366f1',
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rk_payment_update_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rk_pup_crud" ON rk_payment_update_pages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rk_pup_service" ON rk_payment_update_pages FOR ALL USING (true) WITH CHECK (true);

-- Sent Emails
CREATE TABLE IF NOT EXISTS rk_sent_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES rk_recovery_campaigns(id) ON DELETE CASCADE,
    dunning_email_id UUID REFERENCES rk_dunning_emails(id) ON DELETE SET NULL,
    to_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent','delivered','opened','clicked','bounced','failed')),
    resend_message_id TEXT,
    sent_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rk_sent_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rk_se_crud" ON rk_sent_emails FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rk_se_service" ON rk_sent_emails FOR ALL USING (true) WITH CHECK (true);
