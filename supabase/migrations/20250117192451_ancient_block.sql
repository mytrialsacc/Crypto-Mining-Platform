/*
  # Initial Schema Setup for Crypto Mining Platform

  1. New Tables
    - `mining_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `coin_type` (text)
      - `start_time` (timestamptz)
      - `last_pause_time` (timestamptz)
      - `is_mining` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `mining_sessions` table
    - Add policies for users to manage their mining sessions
*/

CREATE TABLE mining_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  coin_type text NOT NULL,
  start_time timestamptz DEFAULT now(),
  last_pause_time timestamptz,
  is_mining boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mining_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mining sessions"
  ON mining_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mining sessions"
  ON mining_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mining sessions"
  ON mining_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);