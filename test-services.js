import { supabase } from './client/src/lib/supabase.js';

console.log('🔄 Testing Supabase connection and services table...');

async function testConnection() {
  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('videos') // Use existing table to test connection
      .select('count')
      .limit(1);
      
    if (connectionError) {
      console.log('❌ Connection failed:', connectionError.message);
      return;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test services table existence
    const { data: servicesTest, error: servicesError } = await supabase
      .from('services')
      .select('count')
      .limit(1);
      
    if (servicesError) {
      console.log('❌ Services table error:', servicesError.message);
      console.log('💡 You need to run the services_budget_setup.sql in your Supabase dashboard');
      return;
    }
    
    console.log('✅ Services table exists and accessible');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testConnection();