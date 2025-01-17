/*
  # Add minimum withdrawal amount constraint

  1. Changes
    - Add minimum withdrawal amount constraint of $10 to withdrawals table
    - Update existing constraint for amount validation
*/

DO $$ 
BEGIN
  -- Drop existing amount check constraint if it exists
  ALTER TABLE withdrawals 
  DROP CONSTRAINT IF EXISTS withdrawals_amount_check;

  -- Add new constraint with $10 minimum
  ALTER TABLE withdrawals
  ADD CONSTRAINT withdrawals_amount_check 
  CHECK (amount >= 10);

EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error updating constraint: %', SQLERRM;
END $$;