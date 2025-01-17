/*
  # Create user wallets table for cryptocurrency withdrawals

  1. New Tables
    - `user_wallets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `address` (text, wallet address)
      - `crypto_type` (text, type of cryptocurrency)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_wallets` table
    - Add policies for users to manage their own wallet addresses
    - Add constraint for valid cryptocurrency types
*/

-- Safely create the user_wallets table
DO $$ 
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS user_wallets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    address text NOT NULL,
    crypto_type text NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
      REFERENCES auth.users(id)
      ON DELETE CASCADE
  );

  -- Add the crypto_type constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'valid_crypto_type'
  ) THEN
    ALTER TABLE user_wallets
    ADD CONSTRAINT valid_crypto_type
    CHECK (crypto_type IN ('bitcoin', 'ethereum', 'dogecoin'));
  END IF;

  -- Create index if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE indexname = 'user_wallets_user_id_idx'
  ) THEN
    CREATE INDEX user_wallets_user_id_idx ON user_wallets(user_id);
  END IF;

EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error creating table or constraints: %', SQLERRM;
END $$;

-- Enable RLS
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own wallets" ON user_wallets;
DROP POLICY IF EXISTS "Users can insert their own wallets" ON user_wallets;
DROP POLICY IF EXISTS "Users can update their own wallets" ON user_wallets;
DROP POLICY IF EXISTS "Users can delete their own wallets" ON user_wallets;

-- Create new policies
CREATE POLICY "Users can view their own wallets"
  ON user_wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallets"
  ON user_wallets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets"
  ON user_wallets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallets"
  ON user_wallets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);