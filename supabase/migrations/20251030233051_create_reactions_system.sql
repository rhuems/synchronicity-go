/*
  # Create emoji reactions system

  1. New Tables
    - `reactions`
      - `id` (uuid, primary key) - Unique identifier for each reaction
      - `synchronicity_id` (uuid, foreign key) - References synchronicities(id)
      - `user_id` (uuid, foreign key) - References auth.users(id)
      - `emoji` (text) - The emoji reaction (❤️, ✨, 🔮)
      - `created_at` (timestamptz) - When the reaction was created

  2. Security
    - Enable RLS on `reactions` table
    - Users can view reactions on public synchronicities
    - Users can insert their own reactions
    - Users can delete their own reactions
    - Prevent duplicate reactions (same user + emoji + synchronicity)

  3. Indexes
    - Index on synchronicity_id for fast queries
    - Unique constraint to prevent duplicate reactions
*/

CREATE TABLE IF NOT EXISTS reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  synchronicity_id uuid NOT NULL REFERENCES synchronicities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji text NOT NULL CHECK (emoji IN ('❤️', '✨', '🔮')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(synchronicity_id, user_id, emoji)
);

ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reactions on public synchronicities"
  ON reactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM synchronicities
      WHERE synchronicities.id = reactions.synchronicity_id
      AND synchronicities.visibility = 'shared'
    )
  );

CREATE POLICY "Users can insert own reactions"
  ON reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_reactions_synchronicity_id ON reactions(synchronicity_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);