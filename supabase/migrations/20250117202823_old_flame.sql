/*
  # Add crypto payment validations

  1. Changes
    - Add transaction age validation
    - Add transaction hash uniqueness validation
    - Add status validation
*/

-- Create crypto_payments table if not exists (idempotent check)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'crypto_payments'
  ) THEN
    RAISE EXCEPTION 'crypto_payments table must exist before adding constraints';
  END IF;
END $$;

-- Add status check constraint
ALTER TABLE crypto_payments
DROP CONSTRAINT IF EXISTS valid_status;

ALTER TABLE crypto_payments
ADD CONSTRAINT valid_status 
CHECK (status IN ('pending', 'verified', 'failed'));

-- Add unique constraint for transaction hash
ALTER TABLE crypto_payments
DROP CONSTRAINT IF EXISTS unique_transaction_hash;

ALTER TABLE crypto_payments
ADD CONSTRAINT unique_transaction_hash 
UNIQUE (transaction_hash);

-- Add transaction age check
ALTER TABLE crypto_payments
DROP CONSTRAINT IF EXISTS recent_transaction;

ALTER TABLE crypto_payments
ADD CONSTRAINT recent_transaction 
CHECK (created_at >= NOW() - INTERVAL '1 hour');

-- Add index for transaction hash lookups
CREATE INDEX IF NOT EXISTS idx_crypto_payments_hash 
ON crypto_payments(transaction_hash);