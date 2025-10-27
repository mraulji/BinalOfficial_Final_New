import { supabase } from './supabase';

export interface SupabaseStorageConfig {
  BUCKETS: {
    IMAGES: string;
  };
  FOLDERS: {
    CAROUSEL: string;
    GALLERY: string;
  };
}

export const SUPABASE_STORAGE_CONFIG: SupabaseStorageConfig = {
  BUCKETS: {
    IMAGES: 'binal-images'
  },
  FOLDERS: {
    CAROUSEL: 'carousel',
    GALLERY: 'gallery'
  }
};

/**
 * Upload image to Supabase Storage
 */
export const uploadToSupabaseStorage = async (
  file: File, 
  folder: string = 'gallery'
): Promise<string> => {
  try {
    console.log(`🔄 Uploading ${file.name} to Supabase Storage...`);
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(SUPABASE_STORAGE_CONFIG.BUCKETS.IMAGES)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase Storage upload error:', error);
      throw error;
    }

    console.log('✅ Supabase Storage upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(SUPABASE_STORAGE_CONFIG.BUCKETS.IMAGES)
      .getPublicUrl(fileName);

    console.log('🔗 Supabase Storage public URL:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('❌ Error uploading to Supabase Storage:', error);
    throw error;
  }
};

/**
 * Delete image from Supabase Storage
 */
export const deleteFromSupabaseStorage = async (url: string): Promise<void> => {
  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part === SUPABASE_STORAGE_CONFIG.BUCKETS.IMAGES);
    if (bucketIndex === -1) {
      console.log('⚠️ URL is not from Supabase Storage, skipping delete');
      return;
    }
    
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    
    const { error } = await supabase.storage
      .from(SUPABASE_STORAGE_CONFIG.BUCKETS.IMAGES)
      .remove([filePath]);

    if (error) {
      console.error('❌ Error deleting from Supabase Storage:', error);
      throw error;
    }

    console.log('✅ File deleted from Supabase Storage');
  } catch (error) {
    console.error('❌ Error in deleteFromSupabaseStorage:', error);
    throw error;
  }
};

/**
 * Initialize Supabase Storage buckets
 */
export const initializeSupabaseStorage = async (): Promise<void> => {
  try {
    console.log('🔄 Initializing Supabase Storage...');
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }

    const bucketExists = buckets.some(bucket => bucket.name === SUPABASE_STORAGE_CONFIG.BUCKETS.IMAGES);
    
    if (!bucketExists) {
      console.log('🔄 Creating images bucket...');
      const { error: createError } = await supabase.storage.createBucket(SUPABASE_STORAGE_CONFIG.BUCKETS.IMAGES, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
      });

      if (createError) {
        console.error('❌ Error creating bucket:', createError);
        return;
      }
      
      console.log('✅ Images bucket created successfully');
    } else {
      console.log('✅ Images bucket already exists');
    }
    
  } catch (error) {
    console.error('❌ Error initializing Supabase Storage:', error);
  }
};

/**
 * Compress image if needed (optional, for client-side optimization)
 */
export const compressImageIfNeeded = (file: File, maxSizeBytes: number = 10485760): Promise<File> => {
  return new Promise((resolve) => {
    if (file.size <= maxSizeBytes) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions (maintain aspect ratio)
      const maxWidth = 1920;
      const maxHeight = 1080;
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          console.log(`📦 Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      }, file.type, 0.8);
    };

    img.src = URL.createObjectURL(file);
  });
};