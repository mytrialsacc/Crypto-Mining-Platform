/*
  # Add VIP Plans Support

  1. New Tables
    - `user_plans`
      - `user_id` (uuid, primary key, references auth.users)
      - `plan_id` (text, not null)
      - `purchased_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `user_plans` table
    - Add policies for users to:
      - View their own plan
      - Insert/update their plan
*/

-- Create user_plans table
CREATE TABLE IF NOT EXISTS user_plans (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  plan_id text NOT NULL,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own plan"
  ON user_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plan"
  ON user_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plan"
  ON user_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Set default free plan for existing users
INSERT INTO user_plans (user_id, plan_id)
SELECT id, 'free'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;