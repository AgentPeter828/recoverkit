-- Create the missing rk_stripe_connections table
-- Migration 005 prefixed all domain tables except stripe_connections
-- The app code references rk_stripe_connections everywhere

CREATE TABLE IF NOT EXISTS rk_stripe_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_account_id TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    livemode BOOLEAN DEFAULT false,
    scope TEXT,
    business_name TEXT,
    connected_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id),
    UNIQUE(stripe_account_id)
);

ALTER TABLE rk_stripe_connections ENABLE ROW LEVEL SECURITY;

-- User-level access
CREATE POLICY "rk_sc_crud" ON rk_stripe_connections
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Service role access (for OAuth callback which uses service client)
CREATE POLICY "rk_sc_service" ON rk_stripe_connections
    FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX idx_rk_stripe_connections_user ON rk_stripe_connections(user_id);
