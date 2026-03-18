-- Email OAuth tokens for Gmail/Outlook relay sending
CREATE TABLE rk_email_oauth_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('gmail', 'outlook')),
  email text NOT NULL,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider)
);

ALTER TABLE rk_email_oauth_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tokens" ON rk_email_oauth_tokens
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON rk_email_oauth_tokens
  FOR ALL USING (true)
  WITH CHECK (true);
