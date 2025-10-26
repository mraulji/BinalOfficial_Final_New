# Cloudinary Setup Guide for BinalShowcase

## Overview
Your website now uses Cloudinary for cloud image storage, which works perfectly with Netlify's static hosting. This setup ensures image uploads work on your live website.

## Step 1: Create Cloudinary Account
1. Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up for a free account (provides 25GB storage and 25GB bandwidth per month)
3. Verify your email address

## Step 2: Create Upload Preset
1. In your Cloudinary Dashboard, go to **Settings** (gear icon) → **Upload**
2. Scroll down to **Upload presets** section
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `binal_unsigned`
   - **Signing Mode**: **Unsigned** (important!)
   - **Folder**: `binal_showcase` (optional)
   - **Auto-create folders**: **Yes**
   - Leave other settings as default
5. Click **Save**

## Step 3: Configure Environment Variables

### For Local Development:
1. Create a `.env` file in your project root (if not exists):
```bash
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_API_KEY=your_api_key_here
```

### For Netlify Deployment:
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add these variables:
   - **VITE_CLOUDINARY_CLOUD_NAME**: `your_cloud_name_here`
   - **VITE_CLOUDINARY_API_KEY**: `your_api_key_here`

## Step 4: Update Your Code
The Cloudinary configuration is already set up in `client/src/lib/cloudinaryService.ts`. Just replace the placeholder values:

```typescript
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your_cloud_name_here',
  API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY || 'your_api_key_here',
  UPLOAD_PRESET: 'ml_default', // You can create a custom preset for more control
  FOLDERS: {
    CAROUSEL: 'binal_showcase/carousel',
    GALLERY: 'binal_showcase/gallery',
    SERVICES: 'binal_showcase/services'
  }
};
```

## Step 5: Test the Setup

### Local Testing:
1. Add your credentials to `.env`
2. Restart your development server: `npm run dev`
3. Go to admin dashboard and try uploading an image

### Live Testing:
1. Add environment variables to Netlify
2. Deploy your changes: `git push origin main`
3. Test image upload on your live site

## Features Included

✅ **File Upload**: Drag & drop or browse files  
✅ **URL Import**: Paste external image URLs (automatically uploaded to Cloudinary)  
✅ **Cloud Storage**: All images stored in Cloudinary with optimized delivery  
✅ **Auto Folders**: Images organized by type (carousel, gallery, services)  
✅ **Error Handling**: Graceful fallbacks and user notifications  
✅ **Free Tier**: 25GB storage should handle thousands of images  

## Security Notes

- Never commit your API Secret to version control
- The API Key is safe to expose in frontend code
- Consider creating upload presets for additional security
- Monitor your Cloudinary usage in the dashboard

## Troubleshooting

### Images not uploading:
1. Check browser console for error messages
2. Verify environment variables are set correctly
3. Ensure your Cloudinary account is active

### "Unauthorized" errors:
1. Double-check your Cloud Name and API Key
2. Make sure there are no extra spaces in environment variables

### Quota exceeded:
1. Check your Cloudinary dashboard usage
2. Consider upgrading plan or optimizing existing images

## Optional: Custom Upload Preset
For more control, create a custom upload preset in Cloudinary:
1. Go to Settings → Upload → Upload presets
2. Create new preset with your desired settings
3. Update `UPLOAD_PRESET` in the config

Your website is now ready for production with cloud image storage! 🚀