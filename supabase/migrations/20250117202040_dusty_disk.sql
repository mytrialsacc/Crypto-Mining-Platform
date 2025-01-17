/*
  # Add crypto payment verification

  1. New Tables
    - `crypto_payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `plan_id` (text)
      - `amount` (numeric)
      - `crypto_type` (text)
      - `transaction_hash` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `verified_at` (timestamptz)

  2. Security
    - Enable RLS on crypto_payments table
    - Add policies for authenticated users
*/

-- Create crypto_payments table
CREATE TABLE IF NOT EXISTS crypto_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan_id text NOT NULL,
  amount numeric NOT NULL,
  crypto_type text NOT NULL,
  transaction_hash text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz
);

-- Enable RLS
ALTER TABLE crypto_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own crypto payments"
  ON crypto_payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crypto payments"
  ON crypto_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS crypto_payments_user_id_idx ON crypto_payments(user_id);
CREATE INDEX IF NOT EXISTS crypto_payments_status_idx ON crypto_payments(status);