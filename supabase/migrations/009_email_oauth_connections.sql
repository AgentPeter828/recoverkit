-- Email OAuth connections for Gmail and Outlook sending
-- Stores OAuth tokens so users can send dunning emails through their own accounts

CREATE TABLE IF NOT EXISTS rk_email_oauth_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook')),
    email TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_expires_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'expired', 'revoked')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, provider)
);

ALTER TABLE rk_email_oauth_connections ENABLE ROW LEVEL SECURITY;

-- User-level access
CREATE POLICY "rk_eoc_crud" ON rk_email_oauth_connections
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Service role access (for OAuth callbacks)
CREATE POLICY "rk_eoc_service" ON rk_email_oauth_connections
    FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX idx_rk_email_oauth_connections_user ON rk_email_oauth_connections(user_id);
CREATE INDEX idx_rk_email_oauth_connections_provider ON rk_email_oauth_connections(user_id, provider);
