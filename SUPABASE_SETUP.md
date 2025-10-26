# 🚀 Supabase Setup Instructions

## Step 1: Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" (100% FREE)
3. Sign up with GitHub/Google/Email
4. Create a new project:
   - **Project name**: `binal-studio` 
   - **Database password**: Choose a strong password
   - **Region**: Choose closest to your location
   - Click "Create new project"

## Step 2: Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefg.supabase.co`)
   - **Anon public key** (long string starting with `eyJ...`)

## Step 3: Update Environment Variables
1. Open `.env` file in your project root
2. Replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 4: Create Database Tables
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase_schema.sql` file
3. Paste into SQL Editor and click "Run"
4. This creates:
   - `carousel_items` table (5 default images)
   - `gallery_items` table (12 default images) 
   - `budget_entries` table
   - Proper permissions and indexes

## Step 5: Deploy to Netlify
1. Add environment variables to Netlify:
   - Go to Site Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Redeploy your site

## ✅ What You Get

### ✨ **Instant Cross-Browser Sync**
- Admin uploads image in Chrome → Instantly visible in Edge/Safari/Mobile
- Real-time updates across all devices
- No more browser cache issues!

### 🔧 **Admin Features**
- Upload images via admin dashboard
- Images automatically save to Supabase
- Budget entries stored in database
- Real-time admin panel updates

### 📱 **Multi-Device Support**  
- Desktop, mobile, tablet - all sync perfectly
- No localStorage dependencies
- Professional database backend

### 🆓 **Free Tier Limits**
- 500MB database storage
- 1GB file storage  
- 2 million API requests/month
- Perfect for small businesses!

## 🔧 Testing Your Setup

1. **Check Configuration**: Open browser console, should see:
   ```
   ✅ Loaded X carousel images from database
   ✅ Real-time subscriptions active  
   ```

2. **Test Admin Upload**: 
   - Go to `/admin` (password: `binal123`)
   - Upload image in Carousel tab
   - Open another browser/device
   - See instant sync without refresh!

3. **Verify Database**: In Supabase dashboard → Table Editor, see your uploaded images

## 🆘 Troubleshooting

- **"Using fallback data"**: Environment variables not set correctly
- **Database errors**: Run the SQL schema again
- **Images not syncing**: Check browser console for API errors

## 📞 Need Help?
The setup takes 5-10 minutes. Your cross-browser sync issues will be completely solved! 🎉