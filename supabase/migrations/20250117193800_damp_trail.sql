/*
  # Add Mining Rewards System

  1. Changes
    - Add earnings column to mining_sessions table
    - Create user_balances table to track total earnings
    - Add triggers to automatically update user balances
  
  2. New Tables
    - user_balances
      - user_id (uuid, primary key, references auth.users)
      - balance (numeric, default 0.00000100)
      - updated_at (timestamptz)
  
  3. Security
    - Enable RLS on user_balances
    - Add policies for users to read their own balance
    - Add policies for the system to update balances
*/

-- Add earnings column to mining_sessions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mining_sessions' 
    AND column_name = 'earnings'
  ) THEN
    ALTER TABLE mining_sessions 
    ADD COLUMN earnings numeric DEFAULT 0.00000100;
  END IF;
END $$;

-- Create user_balances table
CREATE TABLE IF NOT EXISTS user_balances (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  balance numeric DEFAULT 0.00000100,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_balances
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- Create policies for user_balances
CREATE POLICY "Users can view their own balance"
  ON user_balances
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update user balance
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_balances (user_id, balance)
  VALUES (NEW.user_id, NEW.earnings)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    balance = user_balances.balance + NEW.earnings,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for mining_sessions
DROP TRIGGER IF EXISTS update_balance_on_mining ON mining_sessions;
CREATE TRIGGER update_balance_on_mining
  AFTER INSERT OR UPDATE OF earnings
  ON mining_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_balance();

-- Create initial balances for existing users
INSERT INTO user_balances (user_id, balance)
SELECT id, 0.00000100
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;