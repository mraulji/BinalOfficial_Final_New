import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://extotujyzndfstziqebq.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dG90dWp5em5kZnN0emlxZWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTUzNzgsImV4cCI6MjA3NzA3MTM3OH0.iVbFisR7EGy1N-GdKRwlMacqvYZd9LjgsKkxZq0p9GM'
);

async function checkData() {
  console.log('🔍 Checking Supabase data...');
  
  const { data: carousel, error: carouselError } = await supabase
    .from('carousel_items')
    .select('*')
    .order('id');
    
  const { data: gallery, error: galleryError } = await supabase
    .from('gallery_items')
    .select('*')
    .order('id');
  
  console.log('🎠 Carousel data:', carousel);
  console.log('🎠 Carousel error:', carouselError);
  console.log('');
  console.log('🖼️ Gallery data:', gallery);
  console.log('🖼️ Gallery error:', galleryError);
}

checkData();