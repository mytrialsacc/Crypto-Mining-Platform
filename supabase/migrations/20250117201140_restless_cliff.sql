/*
  # Add CVC column to user_cards table

  1. Changes
    - Add CVC column to user_cards table with a temporary NULL constraint
    - After adding the column, modify it to be NOT NULL
    
  2. Security
    - No changes to existing RLS policies needed
    - CVC will be protected by existing row-level security
*/

-- Add CVC column initially allowing NULL
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_cards' 
    AND column_name = 'cvc'
  ) THEN
    -- First add the column allowing NULL
    ALTER TABLE user_cards ADD COLUMN cvc text;
    
    -- Set a default value for existing rows
    UPDATE user_cards SET cvc = '000' WHERE cvc IS NULL;
    
    -- Now make it NOT NULL
    ALTER TABLE user_cards ALTER COLUMN cvc SET NOT NULL;
  END IF;
END $$;