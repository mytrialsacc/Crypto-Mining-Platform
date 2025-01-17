/*
  # Fix RLS policies for user balances

  1. Changes
    - Add INSERT and UPDATE policies for user_balances table
    - Ensure trigger can modify balances
  
  2. Security Updates
    - Allow authenticated users to have their balances created/updated
    - Maintain data integrity with proper RLS policies
*/

-- Add INSERT policy for user_balances
CREATE POLICY "Users can have balances created"
  ON user_balances
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policy for user_balances
CREATE POLICY "Users can have their balances updated"
  ON user_balances
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable security definer on the trigger function to bypass RLS
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
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