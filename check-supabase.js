#!/usr/bin/env node
// Supabase Setup Verification Script

const fs = require('fs');
const path = require('path');

console.log('🚀 Supabase Setup Verification\n');

// Check if .env file exists and has Supabase variables
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL') && !envContent.includes('YOUR_SUPABASE_URL_HERE');
  const hasSupabaseKey = envContent.includes('VITE_SUPABASE_ANON_KEY') && !envContent.includes('YOUR_SUPABASE_ANON_KEY_HERE');
  
  console.log('✅ .env file found');
  console.log(`${hasSupabaseUrl ? '✅' : '❌'} VITE_SUPABASE_URL configured`);
  console.log(`${hasSupabaseKey ? '✅' : '❌'} VITE_SUPABASE_ANON_KEY configured`);
  
  if (!hasSupabaseUrl || !hasSupabaseKey) {
    console.log('\n⚠️  Please update .env with your Supabase credentials');
    console.log('📖 See SUPABASE_SETUP.md for detailed instructions\n');
  } else {
    console.log('\n🎉 Supabase configuration looks good!');
    console.log('🔗 Run "npm run build" and deploy to test cross-browser sync\n');
  }
} else {
  console.log('❌ .env file not found');
  console.log('📖 See SUPABASE_SETUP.md for setup instructions\n');
}

// Check if SQL schema file exists
const sqlPath = path.join(process.cwd(), 'supabase_schema.sql');
if (fs.existsSync(sqlPath)) {
  console.log('✅ Database schema file found (supabase_schema.sql)');
  console.log('💡 Copy this file content to Supabase SQL Editor\n');
} else {
  console.log('❌ Database schema file missing\n');
}

// Check if Supabase client is installed
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const hasSupabase = packageJson.dependencies && packageJson.dependencies['@supabase/supabase-js'];
  
  console.log(`${hasSupabase ? '✅' : '❌'} @supabase/supabase-js installed`);
  
  if (!hasSupabase) {
    console.log('🔧 Run: npm install @supabase/supabase-js\n');
  }
}

console.log('📚 Next Steps:');
console.log('1. Follow SUPABASE_SETUP.md instructions');
console.log('2. Build and deploy: npm run build');
console.log('3. Test cross-browser sync at your live URL');
console.log('4. Upload images via /admin dashboard');
console.log('5. See instant sync across all devices! 🎉');