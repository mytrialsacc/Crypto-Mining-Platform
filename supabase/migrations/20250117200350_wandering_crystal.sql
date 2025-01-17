/*
  # Add user cards table

  1. New Tables
    - `user_cards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `card_number` (text, last 4 digits only)
      - `expiry_date` (text)
      - `is_default` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `user_cards` table
    - Add policies for users to manage their own cards
*/

-- Create user_cards table
CREATE TABLE IF NOT EXISTS user_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  card_number text NOT NULL,
  expiry_date text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own cards"
  ON user_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards"
  ON user_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
  ON user_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
  ON user_cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS user_cards_user_id_idx ON user_cards(user_id);

-- Function to ensure only one default card per user
CREATE OR REPLACE FUNCTION update_default_card()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE user_cards
    SET is_default = false
    WHERE user_id = NEW.user_id
    AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to manage default cards
CREATE TRIGGER manage_default_card
  BEFORE INSERT OR UPDATE OF is_default
  ON user_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_default_card();