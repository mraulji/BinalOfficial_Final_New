-- Supabase Database Schema for Binal Studio

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create carousel_items table
CREATE TABLE IF NOT EXISTS public.carousel_items (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gallery_items table  
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    category TEXT DEFAULT 'general',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create budget_entries table
CREATE TABLE IF NOT EXISTS public.budget_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    event_date TEXT,
    services TEXT[] NOT NULL DEFAULT '{}',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    additional_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default carousel data
INSERT INTO public.carousel_items (id, url, title, subtitle, position) VALUES
('1', '/assets/elegant_wedding_phot_05974a70-CKZAz0Dr.jpg', 'Capturing Life''s Beautiful Moments', 'Professional Photography & Videography Services', 1),
('2', '/assets/elegant_wedding_phot_8033b843-D2nl5dnx.jpg', 'Your Story, Beautifully Told', 'Wedding, Events, Portraits & More', 2),
('3', '/assets/elegant_wedding_phot_e91b357a-dJUKuqqd.jpg', 'Excellence in Every Frame', 'Premium Photography Services Since 2015', 3),
('4', '/assets/elegant_wedding_phot_3de44adb-DscHmboQ.jpg', 'Creating Timeless Memories', 'From Weddings to Corporate Events', 4),
('5', '/assets/elegant_wedding_phot_3f411a48-Dvy0zL9h.jpg', 'Professional Quality, Personal Touch', 'Your Trusted Photography Partner', 5)
ON CONFLICT (id) DO NOTHING;

-- Insert default gallery data
INSERT INTO public.gallery_items (id, url, title, category, is_primary) VALUES
('g1', '/assets/elegant_wedding_phot_05974a70-CKZAz0Dr.jpg', 'Wedding Photography', 'wedding', true),
('g2', '/assets/elegant_wedding_phot_8033b843-D2nl5dnx.jpg', 'Wedding Photography', 'wedding', false),
('g3', '/assets/elegant_wedding_phot_e91b357a-dJUKuqqd.jpg', 'Wedding Photography', 'wedding', false),
('g4', '/assets/elegant_wedding_phot_3de44adb-DscHmboQ.jpg', 'Wedding Photography', 'wedding', false),
('g5', '/assets/elegant_wedding_phot_3f411a48-Dvy0zL9h.jpg', 'Wedding Photography', 'wedding', false),
('g6', '/assets/professional_portrai_1d85d32c-7prJeMxg.jpg', 'Professional Portrait', 'portrait', true),
('g7', '/assets/professional_portrai_3fa2857e-CbXqR-sM.jpg', 'Professional Portrait', 'portrait', false),
('g8', '/assets/professional_portrai_ccaa3530-DjDNIQXf.jpg', 'Professional Portrait', 'portrait', false),
('g9', '/assets/professional_portrai_0548cfb5-C5aAS_pr.jpg', 'Professional Portrait', 'portrait', false),
('g10', '/assets/corporate_event_phot_dde28f36-XoPQX_sy.jpg', 'Corporate Event', 'corporate', true),
('g11', '/assets/corporate_event_phot_6ff478b6-D6zOvBMc.jpg', 'Corporate Event', 'corporate', false),
('g12', '/assets/corporate_event_phot_833549ab-C4UnSjaA.jpg', 'Corporate Event', 'corporate', false)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) - Allow public read access
ALTER TABLE public.carousel_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON public.carousel_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.carousel_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.carousel_items FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.gallery_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.gallery_items FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON public.budget_entries FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.budget_entries FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_carousel_position ON public.carousel_items(position);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_budget_created ON public.budget_entries(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_carousel_updated_at BEFORE UPDATE ON public.carousel_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON public.gallery_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_updated_at BEFORE UPDATE ON public.budget_entries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();