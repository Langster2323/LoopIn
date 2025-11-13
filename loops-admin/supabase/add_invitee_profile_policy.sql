-- Add RLS policy to allow users to view invitee profiles from their conversions
-- This fixes the "Unknown User" issue in conversion rates

-- Drop the policy if it already exists
DROP POLICY IF EXISTS "Users can view invitee profiles from their conversions" ON public.profiles;

-- Create the policy
CREATE POLICY "Users can view invitee profiles from their conversions"
  ON public.profiles FOR SELECT
  USING (
    id IN (
      SELECT invitee_id 
      FROM public.conversions 
      WHERE inviter_id = auth.uid()
    )
  );

