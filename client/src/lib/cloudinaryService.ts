// Cloudinary Configuration for Live Image Uploads
export const CLOUDINARY_CONFIG = {
  // Environment variables - set these in Netlify and local .env
  CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  UPLOAD_PRESET: 'ml_default', // Default unsigned preset (works immediately)
  API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY || '', // Optional for signed uploads
  
  // Folder structure for different image types
  FOLDERS: {
    CAROUSEL: 'binal_showcase/carousel',
    GALLERY: 'binal_showcase/gallery',
  }
};

// Upload image to Cloudinary
export const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
  // Validate configuration
  if (!CLOUDINARY_CONFIG.CLOUD_NAME || CLOUDINARY_CONFIG.CLOUD_NAME === 'demo') {
    throw new Error('Cloudinary Cloud Name not configured. Please set VITE_CLOUDINARY_CLOUD_NAME environment variable.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.secure_url; // Returns the uploaded image URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Upload image from URL (for existing functionality)
export const uploadUrlToCloudinary = async (imageUrl: string, folder: string): Promise<string> => {
  // Validate configuration
  if (!CLOUDINARY_CONFIG.CLOUD_NAME || CLOUDINARY_CONFIG.CLOUD_NAME === 'demo') {
    throw new Error('Cloudinary Cloud Name not configured. Please set VITE_CLOUDINARY_CLOUD_NAME environment variable.');
  }

  const formData = new FormData();
  formData.append('file', imageUrl);
  formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary URL upload failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary URL upload error:', error);
    throw error;
  }
};

// Setup instructions
export const displayCloudinarySetup = () => {
  console.log(`
📸 CLOUDINARY SETUP INSTRUCTIONS:

1. Go to https://cloudinary.com and create a free account (10GB free storage)

2. Get your credentials:
   - Dashboard → Account Details
   - Note: Cloud Name, API Key

3. Create Upload Preset:
   - Settings → Upload → Upload Presets
   - Click "Add upload preset"
   - Preset name: binal_photography
   - Signing mode: Unsigned
   - Save

4. Update CLOUDINARY_CONFIG in src/lib/cloudinaryService.ts:
   - CLOUD_NAME: Your cloud name
   - UPLOAD_PRESET: binal_photography

5. Your images will be stored in the cloud permanently!

Free tier includes:
- 25 GB storage
- 25 GB bandwidth/month
- Image transformations
- Perfect for photography portfolios!
  `);
};