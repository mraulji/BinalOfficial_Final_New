-- Binal Studio Services and Budget Tables Setup
-- Run this SQL in your Supabase SQL Editor

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    base_price integer NOT NULL DEFAULT 0,
    unit text NOT NULL DEFAULT 'per event',
    icon text NOT NULL DEFAULT 'Camera',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on services" ON public.services
FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS services_created_at_idx ON public.services(created_at);

-- Insert default services
INSERT INTO public.services (id, name, description, base_price, unit, icon, created_at, updated_at) 
VALUES 
  ('s1', 'Photography', 'High-quality professional photography for all occasions. Includes 300 edited photos delivered digitally.', 50000, 'per event', 'Camera', NOW(), NOW()),
  ('s2', 'Videography', 'Cinematic video coverage with professional editing and color grading. Full HD or 4K options available.', 75000, 'per event', 'Video', NOW(), NOW()),
  ('s3', 'Drone Services', 'Aerial photography and videography for stunning bird''s-eye perspectives of your special moments.', 25000, 'per session', 'Plane', NOW(), NOW()),
  ('s4', 'Photo Framing', 'Premium quality photo printing and custom framing services. Choose from various frame styles and sizes.', 5000, 'per frame', 'Frame', NOW(), NOW()),
  ('s5', 'Photo Albums', 'Luxury wedding and event albums with premium binding and archival-quality printing.', 15000, 'per album', 'Book', NOW(), NOW()),
  ('s6', 'Pre-Wedding Shoot', 'Romantic outdoor or studio pre-wedding photography session. Includes outfit changes and multiple locations.', 35000, 'per session', 'Heart', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    base_price = EXCLUDED.base_price,
    unit = EXCLUDED.unit,
    icon = EXCLUDED.icon,
    updated_at = NOW();

-- Create budget entries table
CREATE TABLE IF NOT EXISTS public.budget_entries (
    id text PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    event_date text,
    additional_notes text,
    services jsonb NOT NULL DEFAULT '[]',
    total_cost integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.budget_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on budget_entries" ON public.budget_entries
FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS budget_entries_created_at_idx ON public.budget_entries(created_at);
CREATE INDEX IF NOT EXISTS budget_entries_email_idx ON public.budget_entries(email);

-- Verify table creation
SELECT 'Services and Budget tables created successfully!' as status;
SELECT COUNT(*) as service_count FROM public.services;
SELECT COUNT(*) as budget_count FROM public.budget_entries;