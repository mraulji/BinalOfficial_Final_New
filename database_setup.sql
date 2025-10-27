-- Binal Studio Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
    id text PRIMARY KEY,
    youtube_id text NOT NULL,
    title text NOT NULL,
    thumbnail text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on videos" ON public.videos
FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON public.videos(created_at);

-- Insert default videos
INSERT INTO public.videos (id, youtube_id, title, thumbnail, created_at, updated_at) 
VALUES 
  ('video-1', '9No-FiEInLA', 'Wedding Photography Showcase', '', NOW(), NOW()),
  ('video-2', 'ZmD3F_rdj8s', 'Portrait Session Highlights', '', NOW(), NOW()),
  ('video-3', 'Mfz3kFNVopk', 'Event Photography Reel', '', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Verify table creation
SELECT 'Videos table created successfully!' as status;
SELECT COUNT(*) as video_count FROM public.videos;