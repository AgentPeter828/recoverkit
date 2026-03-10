-- Email sending domains for customers
CREATE TABLE IF NOT EXISTS rk_email_domains (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    resend_domain_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','verified','failed')),
    dns_records JSONB DEFAULT '[]'::jsonb,
    from_name TEXT,
    from_email TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    verified_at TIMESTAMPTZ,
    UNIQUE(user_id, domain)
);
ALTER TABLE rk_email_domains ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "rk_ed_crud" ON rk_email_domains FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "rk_ed_service" ON rk_email_domains FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
