import { createClient } from '@supabase/supabase-js';

// Supabase configuration (using correct credentials from .env)
const supabaseUrl = 'https://extotujyzndfstziqebq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dG90dWp5em5kZnN0emlxZWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTUzNzgsImV4cCI6MjA3NzA3MTM3OH0.iVbFisR7EGy1N-GdKRwlMacqvYZd9LjgsKkxZq0p9GM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixImageUrls() {
  console.log('🔧 Starting to fix image URLs in Supabase...');

  // Working image URLs from Unsplash
  const carouselUpdates = [
    { id: 'c1', url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop&crop=center' },
    { id: 'c2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop&crop=center' },
    { id: 'c3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=center' },
    { id: 'c4', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop&crop=center' },
    { id: 'c5', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop&crop=center' }
  ];

  const galleryUpdates = [
    { id: 'g1', url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=400&fit=crop&crop=center' },
    { id: 'g2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&crop=center' },
    { id: 'g3', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=600&h=400&fit=crop&crop=center' },
    { id: 'g4', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop&crop=center' },
    { id: 'g5', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop&crop=center' },
    { id: 'g6', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center' },
    { id: 'g7', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=400&fit=crop&crop=center' },
    { id: 'g8', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop&crop=center' },
    { id: 'g9', url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&h=400&fit=crop&crop=center' },
    { id: 'g10', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop&crop=center' },
    { id: 'g11', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop&crop=center' },
    { id: 'g12', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop&crop=center' }
  ];

  try {
    // Update carousel images
    console.log('🎠 Updating carousel images...');
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

    // Update gallery images
    console.log('🖼️ Updating gallery images...');
    for (const update of galleryUpdates) {
      const { error } = await supabase
        .from('gallery_items')
        .update({ url: update.url })
        .eq('id', update.id);
      
      if (error) {
        console.error(`❌ Failed to update gallery ${update.id}:`, error);
      } else {
        console.log(`✅ Updated gallery ${update.id}: ${update.url}`);
      }
    }

    console.log('🎉 All image URLs have been fixed!');
    console.log('📍 Refresh your browser to see the changes');

  } catch (error) {
    console.error('❌ Error fixing image URLs:', error);
  }
}

// Run the fix
fixImageUrls();