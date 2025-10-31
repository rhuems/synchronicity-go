/*
  # Create points and achievements system

  1. Changes to profiles table
    - Add `points` (integer) - Total spiritual points earned
    - Add `level` (integer) - User level based on points
    - Add `streak_days` (integer) - Current daily logging streak

  2. New Tables
    - `point_transactions`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid, foreign key) - References auth.users(id)
      - `points` (integer) - Points earned (positive) or spent (negative)
      - `reason` (text) - Why points were awarded
      - `synchronicity_id` (uuid, optional) - Related synchronicity
      - `created_at` (timestamptz) - When points were earned

    - `achievements`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid, foreign key) - References auth.users(id)
      - `badge_type` (text) - Type of achievement
      - `earned_at` (timestamptz) - When achievement was earned

  3. Security
    - Enable RLS on all tables
    - Users can view their own points and achievements
    - Only system can insert point transactions (future: use triggers)

  4. Indexes
    - Index on user_id for fast queries
    - Index on created_at for chronological sorting

  5. Notes
    - Points awarded for:
      - Daily logs: 10 points
      - Special timing (11:11, 2:22, etc.): 25 points
      - Rare/divine hashtags: 15 points
      - First shared synchronicity: 50 points
      - 7-day streak: 100 points
*/

-- Add points columns to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'points'
  ) THEN
    ALTER TABLE profiles ADD COLUMN points integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'level'
  ) THEN
    ALTER TABLE profiles ADD COLUMN level integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'streak_days'
  ) THEN
    ALTER TABLE profiles ADD COLUMN streak_days integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_log_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_log_date date;
  END IF;
END $$;

-- Create point_transactions table
CREATE TABLE IF NOT EXISTS point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points integer NOT NULL,
  reason text NOT NULL,
  synchronicity_id uuid REFERENCES synchronicities(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own point transactions"
  ON point_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created_at ON point_transactions(created_at DESC);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type text NOT NULL,
  earned_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);

-- Create function to award points
CREATE OR REPLACE FUNCTION award_points(
  p_user_id uuid,
  p_points integer,
  p_reason text,
  p_synchronicity_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert transaction
  INSERT INTO point_transactions (user_id, points, reason, synchronicity_id)
  VALUES (p_user_id, p_points, p_reason, p_synchronicity_id);
  
  -- Update user's total points
  UPDATE profiles
  SET points = points + p_points,
      level = FLOOR((points + p_points) / 100) + 1
  WHERE id = p_user_id;
END;
$$;