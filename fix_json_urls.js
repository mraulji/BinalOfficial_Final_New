import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://extotujyzndfstziqebq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dG90dWp5em5kZnN0emlxZWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTUzNzgsImV4cCI6MjA3NzA3MTM3OH0.iVbFisR7EGy1N-GdKRwlMacqvYZd9LjgsKkxZq0p9GM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCarouselJsonUrls() {
  console.log('🚨 EMERGENCY FIX: Extracting URLs from JSON strings...');

  try {
    // Get all carousel items
    const { data: carouselItems, error } = await supabase
      .from('carousel_items')
      .select('*');

    if (error) {
      console.error('Error fetching carousel items:', error);
      return;
    }

    for (const item of carouselItems) {
      console.log(`\n🔧 Fixing item ${item.id}:`);
      console.log(`Current URL field: ${item.url}`);
      
      let actualUrl = item.url;
      
      // If the URL is a JSON string, parse it
      if (typeof item.url === 'string' && item.url.startsWith('{')) {
        try {
          const parsed = JSON.parse(item.url);
          actualUrl = parsed.url;
          console.log(`✅ Extracted URL: ${actualUrl}`);
        } catch (parseError) {
          console.log(`❌ Failed to parse JSON for item ${item.id}`);
          continue;
        }
      } else {
        console.log(`✅ URL is already clean: ${actualUrl}`);
        continue;
      }

      // Update the database with the clean URL
      const { error: updateError } = await supabase
        .from('carousel_items')
        .update({ url: actualUrl })
        .eq('id', item.id);

      if (updateError) {
        console.error(`❌ Failed to update item ${item.id}:`, updateError);
      } else {
        console.log(`✅ Updated item ${item.id} with clean URL`);
      }
    }

    console.log('\n🎉 Carousel URLs have been cleaned!');
    console.log('📍 Refresh your browser to see the fix');

  } catch (error) {
    console.error('❌ Error fixing carousel URLs:', error);
  }
}

// Run the fix
fixCarouselJsonUrls();