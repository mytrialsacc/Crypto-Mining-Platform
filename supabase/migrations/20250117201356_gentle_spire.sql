/*
  # Add address fields to user_cards table

  1. Changes
    - Add address fields to user_cards table:
      - address (text)
      - city (text)
      - state (text)
      - postal_code (text)
    
  2. Security
    - No changes to existing RLS policies needed
    - Address fields will be protected by existing row-level security
*/

-- Add address fields
ALTER TABLE user_cards 
ADD COLUMN IF NOT EXISTS address text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS state text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS postal_code text NOT NULL DEFAULT '';