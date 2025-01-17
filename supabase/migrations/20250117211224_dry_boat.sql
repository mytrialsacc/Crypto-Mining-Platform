/*
  # Create withdrawals table

  1. New Tables
    - `withdrawals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric, withdrawal amount)
      - `crypto_type` (text, type of cryptocurrency)
      - `wallet_address` (text, destination wallet)
      - `status` (text, withdrawal status)
      - `created_at` (timestamp)
      - `processed_at` (timestamp, when withdrawal was processed)

  2. Security
    - Enable RLS on `withdrawals` table
    - Add policies for users to manage their withdrawals
    - Add constraint for valid withdrawal status
*/

-- Create withdrawals table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS withdrawals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    amount numeric NOT NULL CHECK (amount > 0),
    crypto_type text NOT NULL,
    wallet_address text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    processed_at timestamptz,
    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
      REFERENCES auth.users(id)
      ON DELETE CASCADE,
    CONSTRAINT valid_crypto_type
      CHECK (crypto_type IN ('bitcoin', 'ethereum', 'dogecoin')),
    CONSTRAINT valid_status
      CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
  );

  -- Create index if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE indexname = 'withdrawals_user_id_idx'
  ) THEN
    CREATE INDEX withdrawals_user_id_idx ON withdrawals(user_id);
  END IF;

  -- Create index for status lookups
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE indexname = 'withdrawals_status_idx'
  ) THEN
    CREATE INDEX withdrawals_status_idx ON withdrawals(status);
  END IF;

EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error creating table or constraints: %', SQLERRM;
END $$;

-- Enable RLS
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Users can create withdrawal requests" ON withdrawals;

-- Create policies
CREATE POLICY "Users can view their own withdrawals"
  ON withdrawals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawal requests"
  ON withdrawals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);