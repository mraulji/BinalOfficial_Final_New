import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://extotujyzndfstziqebq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dG90dWp5em5kZnN0emlxZWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTUzNzgsImV4cCI6MjA3NzA3MTM3OH0.iVbFisR7EGy1N-GdKRwlMacqvYZd9LjgsKkxZq0p9GM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCarouselUrls() {
  console.log('🔧 Fixing carousel URLs with correct IDs...');

  // The database uses IDs '1', '2', '3', '4', '5' not 'c1', 'c2', etc.
  const carouselUpdates = [
    { id: '1', url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop&crop=center' },
    { id: '2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop&crop=center' },
    { id: '3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=center' },
    { id: '4', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop&crop=center' },
    { id: '5', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop&crop=center' }
  ];

  try {
    // Update carousel images with correct IDs
    for (const update of carouselUpdates) {
      const { error } = await supabase
        .from('carousel_items')
        .update({ url: update.url })
        .eq('id', update.id);
      
      if (error) {
        console.error(`❌ Failed to update carousel ${update.id}:`, error);
      } else {
        console.log(`✅ Updated carousel ${update.id}: ${update.url}`);
      }
    }

    console.log('🎉 Carousel URLs fixed!');
    console.log('📍 Refresh your browser to see the changes');

  } catch (error) {
    console.error('❌ Error fixing carousel URLs:', error);
  }
}

// Run the fix
fixCarouselUrls();