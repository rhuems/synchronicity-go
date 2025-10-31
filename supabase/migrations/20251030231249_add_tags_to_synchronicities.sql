/*
  # Add tags support to synchronicities

  1. Changes
    - Add `tags` column to `synchronicities` table as an array of text
    - This allows each synchronicity to have multiple hashtags/tags
    - Users can tag their synchronicities with predefined or custom tags

  2. Notes
    - Using array type for simple tag storage without separate table
    - Common tags include: 1111, 222, 333, crow, owl, whitefeather, etc.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'synchronicities' AND column_name = 'tags'
  ) THEN
    ALTER TABLE synchronicities ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_synchronicities_tags ON synchronicities USING GIN(tags);