// Cloudinary Configuration for Live Image Uploads
export const CLOUDINARY_CONFIG = {
  // Your Cloudinary credentials
  CLOUD_NAME: 'dwm2bmzxd',
  UPLOAD_PRESET: 'binal_unsigned', // Your custom unsigned preset
  API_KEY: '839428298188293', // Your API key
  
  // Folder structure for different image types
  FOLDERS: {
    CAROUSEL: 'binal_showcase/carousel',
    GALLERY: 'binal_showcase/gallery',
  }
};

// Upload image to Cloudinary with fallback presets
export const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
  // Validate configuration
  if (!CLOUDINARY_CONFIG.CLOUD_NAME || CLOUDINARY_CONFIG.CLOUD_NAME === 'demo') {
    throw new Error('Cloudinary Cloud Name not configured. Please set VITE_CLOUDINARY_CLOUD_NAME environment variable.');
  }

  // Try multiple presets in order of preference
  const presetsToTry = [
    CLOUDINARY_CONFIG.UPLOAD_PRESET, // Custom preset
    'ml_default',                     // Cloudinary default
    '',                              // No preset (might work for some accounts)
  ];

  for (let i = 0; i < presetsToTry.length; i++) {
    const preset = presetsToTry[i];
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (preset) {
        formData.append('upload_preset', preset);
      }
      
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Upload successful with preset: ${preset || 'none'}`);
        return data.secure_url;
      } else {
        const errorText = await response.text();
        console.warn(`❌ Upload failed with preset '${preset}': ${response.status} - ${errorText}`);
        
        // If this is the last preset to try, throw the error
        if (i === presetsToTry.length - 1) {
          throw new Error(`All upload presets failed. Last error: ${response.status} - ${errorText}`);
        }
      }
    } catch (error) {
      console.warn(`❌ Upload attempt ${i + 1} failed:`, error);
      
      // If this is the last preset to try, throw the error
      if (i === presetsToTry.length - 1) {
        throw error;
      }
    }
  }

  throw new Error('All upload attempts failed');
};

// Upload image from URL (for existing functionality)
export const uploadUrlToCloudinary = async (imageUrl: string, folder: string): Promise<string> => {
  // Validate configuration
  if (!CLOUDINARY_CONFIG.CLOUD_NAME || CLOUDINARY_CONFIG.CLOUD_NAME === 'demo') {
    throw new Error('Cloudinary Cloud Name not configured. Please set VITE_CLOUDINARY_CLOUD_NAME environment variable.');
  }

  // Try multiple presets in order of preference
  const presetsToTry = [
    CLOUDINARY_CONFIG.UPLOAD_PRESET, // Custom preset
    'ml_default',                     // Cloudinary default
    '',                              // No preset (might work for some accounts)
  ];

  for (let i = 0; i < presetsToTry.length; i++) {
    const preset = presetsToTry[i];
    
    try {
      const formData = new FormData();
      formData.append('file', imageUrl);
      
      if (preset) {
        formData.append('upload_preset', preset);
      }
      
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ URL upload successful with preset: ${preset || 'none'}`);
        return data.secure_url;
      } else {
        const errorText = await response.text();
        console.warn(`❌ URL upload failed with preset '${preset}': ${response.status} - ${errorText}`);
        
        if (i === presetsToTry.length - 1) {
          throw new Error(`All upload presets failed for URL. Last error: ${response.status} - ${errorText}`);
        }
      }
    } catch (error) {
      console.warn(`❌ URL upload attempt ${i + 1} failed:`, error);
      
      if (i === presetsToTry.length - 1) {
        throw error;
      }
    }
  }

  throw new Error('All URL upload attempts failed');
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