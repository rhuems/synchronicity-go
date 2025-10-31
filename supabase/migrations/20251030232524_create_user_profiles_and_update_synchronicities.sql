/*
  # Create user profiles and update synchronicities

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users(id)
      - `display_name` (text) - User's chosen display name
      - `share_synchronicities` (boolean) - Whether user opts into public sharing
      - `created_at` (timestamptz) - When profile was created
      - `updated_at` (timestamptz) - When profile was last updated

  2. Changes to existing tables
    - Add `photo_url` (text, optional) to `synchronicities` - URL to uploaded photo
    - Add `visibility` (text) to `synchronicities` - Either 'private' or 'shared'
    - Add `display_name` (text) to `synchronicities` - Cached display name for public views

  3. Security
    - Enable RLS on `profiles` table
    - Users can read their own profile
    - Users can update their own profile
    - Users can insert their own profile
    - Add policy for viewing public synchronicities from users who opt-in

  4. Indexes
    - Index on visibility and tags for public feed queries
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  share_synchronicities boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add new columns to synchronicities
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'synchronicities' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE synchronicities ADD COLUMN photo_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'synchronicities' AND column_name = 'visibility'
  ) THEN
    ALTER TABLE synchronicities ADD COLUMN visibility text DEFAULT 'private' CHECK (visibility IN ('private', 'shared'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'synchronicities' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE synchronicities ADD COLUMN display_name text;
  END IF;
END $$;

-- Add policy for viewing public synchronicities
CREATE POLICY "Users can view public synchronicities"
  ON synchronicities FOR SELECT
  TO authenticated
  USING (
    visibility = 'shared'
    OR auth.uid() = user_id
  );

-- Create indexes for public feed queries
CREATE INDEX IF NOT EXISTS idx_synchronicities_visibility ON synchronicities(visibility);
CREATE INDEX IF NOT EXISTS idx_synchronicities_visibility_tags ON synchronicities(visibility, tags) WHERE visibility = 'shared';