import { updateGlobalCacheBuster } from './cacheManager';

// Cloudinary Configuration for Live Image Uploads
export const CLOUDINARY_CONFIG = {
  // Your Cloudinary credentials
  CLOUD_NAME: 'dwm2bmzxd',
  UPLOAD_PRESET: 'binal_unsigned', // Your custom unsigned preset
  API_KEY: '839428298188293', // Your API key
  
  // File size limits (Cloudinary free tier: exactly 10,485,760 bytes)
  MAX_FILE_SIZE: 10485760, // Exact Cloudinary limit in bytes
  COMPRESSION_QUALITY: 0.8, // 80% quality for compression
  
  // Folder structure for different image types
  FOLDERS: {
    CAROUSEL: 'binal_showcase/carousel',
    GALLERY: 'binal_showcase/gallery',
  }
};

// Compress image file if it's too large with aggressive compression
const compressImage = (file: File, maxSize: number, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    if (file.size <= maxSize) {
      resolve(file); // File is already small enough
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // More aggressive compression - target 80% of max size for safety buffer
      const targetSize = maxSize * 0.8; // Leave 20% buffer
      const ratio = Math.sqrt(targetSize / file.size);
      
      canvas.width = Math.floor(img.width * ratio);
      canvas.height = Math.floor(img.height * ratio);

      // Ensure minimum dimensions
      if (canvas.width < 300) {
        const aspectRatio = img.height / img.width;
        canvas.width = 300;
        canvas.height = Math.floor(300 * aspectRatio);
      }

      // Draw compressed image with better quality settings
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      // Try progressively lower quality until size is acceptable
      const tryCompress = (attemptQuality: number) => {
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size <= maxSize) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              console.log(`📦 Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(1)}MB (${(attemptQuality * 100).toFixed(0)}% quality)`);
              resolve(compressedFile);
            } else if (attemptQuality > 0.3) {
              // Try lower quality
              tryCompress(attemptQuality - 0.1);
            } else {
              // If even 30% quality is too large, reduce dimensions more
              canvas.width = Math.floor(canvas.width * 0.8);
              canvas.height = Math.floor(canvas.height * 0.8);
              
              if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              }
              
              tryCompress(0.7); // Start over with lower dimensions
            }
          },
          file.type,
          attemptQuality
        );
      };

      // Start compression attempt
      tryCompress(quality);
    };

    img.onerror = () => {
      resolve(file); // Fallback to original if image loading fails
    };

    img.src = URL.createObjectURL(file);
  });
};

// Upload image to Cloudinary with automatic compression and cache-busting
export const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
  // Validate configuration
  if (!CLOUDINARY_CONFIG.CLOUD_NAME || CLOUDINARY_CONFIG.CLOUD_NAME === 'demo') {
    throw new Error('Cloudinary Cloud Name not configured. Please set VITE_CLOUDINARY_CLOUD_NAME environment variable.');
  }

  // Check file size and compress if necessary
  let fileToUpload = file;
  if (file.size > CLOUDINARY_CONFIG.MAX_FILE_SIZE) {
    console.log(`📏 File ${file.name} is ${(file.size / 1024 / 1024).toFixed(1)}MB, compressing...`);
    fileToUpload = await compressImage(file, CLOUDINARY_CONFIG.MAX_FILE_SIZE, CLOUDINARY_CONFIG.COMPRESSION_QUALITY);
  }

  // Create unique filename to prevent caching issues
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const fileExtension = fileToUpload.name.split('.').pop() || 'jpg';
  const uniqueFilename = `${timestamp}_${randomId}.${fileExtension}`;
  
  // Create a new file with unique name
  const uniqueFile = new File([fileToUpload], uniqueFilename, {
    type: fileToUpload.type,
    lastModified: fileToUpload.lastModified,
  });

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
      formData.append('file', uniqueFile); // Use unique filename for cache-busting
      
      if (preset) {
        formData.append('upload_preset', preset);
      }
      
      if (folder) {
        formData.append('folder', folder);
      }
      
      // Add transformation parameters for additional cache-busting
      formData.append('public_id', `${folder.replace('/', '_')}_${timestamp}_${randomId}`);

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
        
        // Update global cache buster to force refresh on all browsers
        updateGlobalCacheBuster();
        
        // Return the clean URL (cache buster will be added by cacheManager)
        console.log(`🔄 New image uploaded: ${data.secure_url}`);
        
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

// Upload image from URL with cache-busting
export const uploadUrlToCloudinary = async (imageUrl: string, folder: string): Promise<string> => {
  // Validate configuration
  if (!CLOUDINARY_CONFIG.CLOUD_NAME || CLOUDINARY_CONFIG.CLOUD_NAME === 'demo') {
    throw new Error('Cloudinary Cloud Name not configured. Please set VITE_CLOUDINARY_CLOUD_NAME environment variable.');
  }

  // Create unique identifiers for cache-busting
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);

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
      
      // Add unique public_id for cache-busting
      formData.append('public_id', `${folder.replace('/', '_')}_url_${timestamp}_${randomId}`);

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
        
        // Update global cache buster to force refresh on all browsers
        updateGlobalCacheBuster();
        
        // Return the clean URL (cache buster will be added by cacheManager)
        console.log(`🔄 New image uploaded: ${data.secure_url}`);
        
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

// Force refresh image in all browsers by updating the cache-buster parameter
export const refreshImageCache = (url: string): string => {
  const timestamp = Date.now();
  
  // Remove existing cache-buster parameter if present
  const baseUrl = url.split('?')[0];
  
  // Add new cache-buster parameter
  const refreshedUrl = `${baseUrl}?v=${timestamp}`;
  
  console.log(`🔄 Refreshing image cache: ${refreshedUrl}`);
  return refreshedUrl;
};

// Preload image to ensure it's cached for other browsers/devices
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      console.log(`📱 Image preloaded for all devices: ${url}`);
      resolve();
    };
    img.onerror = () => {
      console.warn(`❌ Failed to preload image: ${url}`);
      reject(new Error('Failed to preload image'));
    };
    img.src = url;
  });
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