/*
  # Create synchronicities table

  1. New Tables
    - `synchronicities`
      - `id` (uuid, primary key) - Unique identifier for each synchronicity
      - `user_id` (uuid, foreign key) - References auth.users, owner of the synchronicity
      - `title` (text) - Short title/description of the synchronicity
      - `description` (text) - Detailed description of what happened
      - `location` (text, optional) - Where it occurred
      - `occurred_at` (timestamptz) - When it happened
      - `category` (text, optional) - Type of synchronicity (e.g., 'number', 'meeting', 'coincidence')
      - `created_at` (timestamptz) - When the entry was created
      - `updated_at` (timestamptz) - When the entry was last updated

  2. Security
    - Enable RLS on `synchronicities` table
    - Add policy for users to read their own synchronicities
    - Add policy for users to insert their own synchronicities
    - Add policy for users to update their own synchronicities
    - Add policy for users to delete their own synchronicities

  3. Indexes
    - Index on user_id for fast queries
    - Index on occurred_at for chronological sorting
*/

CREATE TABLE IF NOT EXISTS synchronicities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  location text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE synchronicities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own synchronicities"
  ON synchronicities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own synchronicities"
  ON synchronicities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own synchronicities"
  ON synchronicities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own synchronicities"
  ON synchronicities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_synchronicities_user_id ON synchronicities(user_id);
CREATE INDEX IF NOT EXISTS idx_synchronicities_occurred_at ON synchronicities(occurred_at DESC);