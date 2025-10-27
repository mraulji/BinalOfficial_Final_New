// Temporary debug script to check gallery data
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://extotujyzndfstziqebq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dG90dWp5em5kZnN0emlxZWJxIiwicm9sZSI6ImFub25iIiwiaWF0IjoxNzYxNDk1Mzc4LCJleHAiOjIwNzcwNzEzNzh9.iVbFisR7EGy1N-GdKRwlMacqvYZd9LjgsKkxZq0p9GM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugGallery() {
  console.log('🔍 Fetching gallery data from Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching gallery:', error);
      return;
    }
    
    console.log(`📊 Found ${data?.length || 0} gallery items:`);
    
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        console.log(`\n${index + 1}. Gallery Item ${item.id}:`);
        console.log(`   - Title: ${item.title || 'No title'}`);
        console.log(`   - Category: ${item.category || 'No category'}`);
        console.log(`   - Primary Category: ${item.primary_category || 'None'}`);
        console.log(`   - Secondary Category: ${item.secondary_category || 'None'}`);
        console.log(`   - URL Type: ${item.url ? (item.url.startsWith('data:') ? 'Base64 Data URL' : 'External URL') : 'No URL'}`);
        console.log(`   - URL Length: ${item.url ? item.url.length : 0} characters`);
        console.log(`   - URL Preview: ${item.url ? item.url.substring(0, 100) + '...' : 'No URL'}`);
        console.log(`   - Created: ${item.created_at}`);
        console.log(`   - Updated: ${item.updated_at}`);
      });
    } else {
      console.log('   No gallery items found in database');
    }
    
  } catch (err) {
    console.error('❌ Connection error:', err);
  }
}

debugGallery();