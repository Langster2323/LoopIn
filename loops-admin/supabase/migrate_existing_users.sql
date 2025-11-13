-- This script creates profiles for users who signed up before the trigger was set up
-- Run this in your Supabase SQL Editor if you have existing users without profiles

INSERT INTO public.profiles (id, email, full_name)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', '') as full_name
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

