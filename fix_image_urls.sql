-- Update carousel and gallery images with working placeholder URLs
-- Using Unsplash for high-quality placeholder images

-- Update Carousel Items with placeholder URLs
UPDATE public.carousel_items SET 
  url = 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop&crop=center'
WHERE id = 'c1';

UPDATE public.carousel_items SET 
  url = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop&crop=center'
WHERE id = 'c2';

UPDATE public.carousel_items SET 
  url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=center'
WHERE id = 'c3';

UPDATE public.carousel_items SET 
  url = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop&crop=center'
WHERE id = 'c4';

UPDATE public.carousel_items SET 
  url = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop&crop=center'
WHERE id = 'c5';

-- Update Gallery Items with placeholder URLs
-- Wedding Photos (various wedding photography)
UPDATE public.gallery_items SET 
  url = 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=400&fit=crop&crop=center'
WHERE id = 'g1';

UPDATE public.gallery_items SET 
  url = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&crop=center'
WHERE id = 'g2';

UPDATE public.gallery_items SET 
  url = 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=600&h=400&fit=crop&crop=center'
WHERE id = 'g3';

UPDATE public.gallery_items SET 
  url = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop&crop=center'
WHERE id = 'g4';

UPDATE public.gallery_items SET 
  url = 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop&crop=center'
WHERE id = 'g5';

-- Portrait Photos (professional portraits)
UPDATE public.gallery_items SET 
  url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center'
WHERE id = 'g6';

UPDATE public.gallery_items SET 
  url = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=400&fit=crop&crop=center'
WHERE id = 'g7';

UPDATE public.gallery_items SET 
  url = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop&crop=center'
WHERE id = 'g8';

UPDATE public.gallery_items SET 
  url = 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&h=400&fit=crop&crop=center'
WHERE id = 'g9';

-- Corporate Event Photos (business/corporate events)
UPDATE public.gallery_items SET 
  url = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop&crop=center'
WHERE id = 'g10';

UPDATE public.gallery_items SET 
  url = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop&crop=center'
WHERE id = 'g11';

UPDATE public.gallery_items SET 
  url = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop&crop=center'
WHERE id = 'g12';