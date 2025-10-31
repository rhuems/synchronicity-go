/*
  # Fix Security and Performance Issues

  1. Add Missing Index
    - Add index for point_transactions.synchronicity_id foreign key

  2. Fix RLS Policies for Better Performance
    - Replace auth.uid() with (select auth.uid()) in all policies
    - This prevents re-evaluation for each row

  3. Consolidate Multiple Permissive SELECT Policies
    - Combine the two SELECT policies on synchronicities into one

  4. Fix Function Search Path
    - Set search_path for award_points function to be immutable

  5. Note on Unused Indexes
    - Indexes are kept as they will be used as the app scales
    - These are preventive measures for future query performance
*/

-- Add missing index on foreign key
CREATE INDEX IF NOT EXISTS idx_point_transactions_synchronicity_id 
ON point_transactions(synchronicity_id);

-- Drop existing RLS policies that need to be fixed
DROP POLICY IF EXISTS "Users can view own synchronicities" ON synchronicities;
DROP POLICY IF EXISTS "Users can insert own synchronicities" ON synchronicities;
DROP POLICY IF EXISTS "Users can update own synchronicities" ON synchronicities;
DROP POLICY IF EXISTS "Users can delete own synchronicities" ON synchronicities;
DROP POLICY IF EXISTS "Users can view public synchronicities" ON synchronicities;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

DROP POLICY IF EXISTS "Users can insert own reactions" ON reactions;
DROP POLICY IF EXISTS "Users can delete own reactions" ON reactions;

DROP POLICY IF EXISTS "Users can view own point transactions" ON point_transactions;
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;

-- Recreate synchronicities policies with optimized RLS (consolidated SELECT policy)
CREATE POLICY "Users can view own or public synchronicities"
  ON synchronicities FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = user_id 
    OR visibility = 'shared'
  );

CREATE POLICY "Users can insert own synchronicities"
  ON synchronicities FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own synchronicities"
  ON synchronicities FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own synchronicities"
  ON synchronicities FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Recreate profiles policies with optimized RLS
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Recreate reactions policies with optimized RLS
CREATE POLICY "Users can insert own reactions"
  ON reactions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own reactions"
  ON reactions FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Recreate point_transactions policy with optimized RLS
CREATE POLICY "Users can view own point transactions"
  ON point_transactions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Recreate achievements policy with optimized RLS
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Fix function search_path to be immutable
DROP FUNCTION IF EXISTS award_points(uuid, integer, text, uuid);

CREATE OR REPLACE FUNCTION award_points(
  p_user_id uuid,
  p_points integer,
  p_reason text,
  p_synchronicity_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO point_transactions (user_id, points, reason, synchronicity_id)
  VALUES (p_user_id, p_points, p_reason, p_synchronicity_id);
  
  UPDATE profiles
  SET points = points + p_points,
      level = FLOOR((points + p_points) / 100) + 1
  WHERE id = p_user_id;
END;
$$;