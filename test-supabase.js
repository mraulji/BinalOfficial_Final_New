// Simple Supabase connection test
// Run this in browser console to test connection

const testSupabaseConnection = async () => {
  const url = 'https://extotujyzndfstzigebq.supabase.co';
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dG90dWp5em5kZnN0emlxZWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTUzNzgsImV4cCI6MjA3NzA3MTM3OH0.iVbFisR7EGy1N-GdKRwlMacqvYZd9LjgsKkxZq0p9GM';
  
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test basic connectivity
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    console.log('✅ Response status:', response.status);
    console.log('✅ Response headers:', response.headers);
    
    if (response.ok) {
      console.log('🎉 Supabase connection successful!');
    } else {
      console.log('❌ Supabase connection failed:', response.statusText);
    }
  } catch (error) {
    console.log('❌ Connection error:', error);
  }
};

// Run the test
testSupabaseConnection();