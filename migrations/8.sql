
-- Add stripe_payment_link to pricing_packages
ALTER TABLE pricing_packages ADD COLUMN stripe_payment_link TEXT;

-- Add UTM tracking fields to leads
ALTER TABLE leads ADD COLUMN utm_source TEXT;
ALTER TABLE leads ADD COLUMN utm_medium TEXT;
ALTER TABLE leads ADD COLUMN utm_campaign TEXT;
ALTER TABLE leads ADD COLUMN referrer TEXT;
