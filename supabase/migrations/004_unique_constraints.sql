-- Add UNIQUE constraints to prevent race conditions
-- and audit log table for tracking user actions

-- Prevent duplicate recovery campaigns for the same invoice
ALTER TABLE recovery_campaigns
  ADD CONSTRAINT recovery_campaigns_stripe_invoice_id_key UNIQUE (stripe_invoice_id);

-- Prevent duplicate payment page slugs
ALTER TABLE payment_update_pages
  ADD CONSTRAINT payment_update_pages_slug_key UNIQUE (slug);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- RLS for audit_log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own audit logs"
  ON audit_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage audit logs"
  ON audit_log FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
