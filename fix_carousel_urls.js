import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://extotujyzndfstziqebq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dG90dWp5em5kZnN0emlxZWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTUzNzgsImV4cCI6MjA3NzA3MTM3OH0.iVbFisR7EGy1N-GdKRwlMacqvYZd9LjgsKkxZq0p9GM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCarouselUrls() {
  try {
    console.log('🔄 Fetching current carousel data...');
    
    const { data: carouselItems, error } = await supabase
      .from('carousel_items')
      .select('*')
      .order('position');

    if (error) {
      console.error('❌ Error fetching carousel:', error);
      return;
    }

    console.log(`📊 Found ${carouselItems.length} carousel items`);
    
    for (const item of carouselItems) {
      console.log(`\n🔍 Processing item ${item.id}:`);
      console.log(`Current URL: ${item.url}`);
      
      let cleanUrl = item.url;
      
      // Check if the URL is a JSON string
      if (item.url && item.url.startsWith('{') && item.url.includes('"url":')) {
        try {
          const jsonData = JSON.parse(item.url);
          if (jsonData.url) {
            cleanUrl = jsonData.url;
            console.log(`🔧 Extracted URL from JSON: ${cleanUrl}`);
            
            // Update the database with the clean URL
            const { error: updateError } = await supabase
              .from('carousel_items')
              .update({ url: cleanUrl })
              .eq('id', item.id);
              
            if (updateError) {
              console.error(`❌ Error updating item ${item.id}:`, updateError);
            } else {
              console.log(`✅ Updated item ${item.id} with clean URL`);
            }
          }
        } catch (parseError) {
          console.log(`⚠️ Item ${item.id} URL is not JSON, keeping as is`);
        }
      } else {
        console.log(`✅ Item ${item.id} URL is already clean`);
      }
    }
    
    console.log('\n🎉 Carousel URL cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error in fixCarouselUrls:', error);
  }
}

fixCarouselUrls();