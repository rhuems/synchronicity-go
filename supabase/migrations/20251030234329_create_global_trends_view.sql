/*
  # Create Global Trends Analytics

  1. New View
    - `global_tag_trends` - Aggregates tag usage across all public synchronicities
    - Shows tag name, usage count, and trend data
  
  2. Security
    - View is accessible to authenticated users
    - Only includes data from public/shared synchronicities
*/

-- Create a view for global tag trends
CREATE OR REPLACE VIEW global_tag_trends AS
SELECT 
  unnest(tags) as tag,
  COUNT(*) as usage_count,
  COUNT(DISTINCT user_id) as unique_users,
  MAX(occurred_at) as last_used
FROM synchronicities
WHERE visibility = 'shared'
  AND tags IS NOT NULL
  AND array_length(tags, 1) > 0
GROUP BY unnest(tags)
ORDER BY usage_count DESC;

-- Grant access to authenticated users
GRANT SELECT ON global_tag_trends TO authenticated;