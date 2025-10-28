import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Globe } from 'lucide-react';
import { updateGlobalCacheBuster } from '@/lib/cacheManager';

interface SimpleImageUploadProps {
  imageId: string;
  currentUrl?: string;
  onUpdate: (imageId: string, url: string) => void;
  disableCompression?: boolean; // New prop to disable compression for carousel images
}

export function SimpleImageUpload({ imageId, currentUrl, onUpdate, disableCompression = false }: SimpleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const { toast } = useToast();

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const compressImage = (file: File, maxSizeKB: number = 100): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (maintain aspect ratio) - smaller for header safety
        const maxWidth = 800;
        const maxHeight = 600;
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
        
        // Try different quality levels to get under size limit
        let quality = 0.8;
        let result = canvas.toDataURL(file.type, quality);
        
        // Reduce quality if still too large
        while (result.length > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          result = canvas.toDataURL(file.type, quality);
        }
        
        // Final safety check - if still too large, reject
        if (result.length > maxSizeKB * 1024) {
          console.warn(`❌ Image still too large after compression: ${(result.length / 1024).toFixed(1)}KB`);
          // Use a very small fallback image or reject
          result = canvas.toDataURL('image/jpeg', 0.1);
        }
        
        console.log(`📦 Image compressed: ${(file.size / 1024).toFixed(1)}KB → ${(result.length / 1024).toFixed(1)}KB`);
        resolve(result);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    console.log(`🔧 SimpleImageUpload: Converting image to base64 for ${imageId}`);
    
    // Check file size
    const fileSizeKB = file.size / 1024;
    
    setIsUploading(true);
    try {
      let imageDataUrl: string;
      
      if (disableCompression) {
        // For carousel images - use moderate compression to avoid localStorage quota
        console.log(`🎠 Carousel mode: Using moderate compression for storage (${fileSizeKB.toFixed(1)}KB)`);
        
        // Use larger compression settings for carousel to maintain quality while fitting in localStorage
        const carouselMaxSizeKB = 500; // Increased size limit for carousel
        
        if (fileSizeKB > carouselMaxSizeKB) {
          toast({
            title: "Optimizing carousel image...",
            description: `Compressing ${fileSizeKB.toFixed(1)}KB image for storage`,
          });
          imageDataUrl = await compressImage(file, carouselMaxSizeKB);
        } else {
          imageDataUrl = await convertToBase64(file);
        }
      } else {
        // For gallery images - use original compression logic
        const maxSizeKB = 100;
        
        if (fileSizeKB > maxSizeKB) {
          toast({
            title: "Compressing image...",
            description: `File is ${fileSizeKB.toFixed(1)}KB. Compressing for faster loading...`,
          });
          imageDataUrl = await compressImage(file, maxSizeKB);
        } else {
          imageDataUrl = await convertToBase64(file);
        }
        
        // Size validation for gallery images
        const dataUrlSizeKB = new Blob([imageDataUrl]).size / 1024;
        if (dataUrlSizeKB > 150) {
          throw new Error(`Image data URL too large (${dataUrlSizeKB.toFixed(1)}KB) - may cause browser issues`);
        }
      }
      
      const finalSizeKB = new Blob([imageDataUrl]).size / 1024;
      console.log(`✅ SimpleImageUpload: Image processed for ${imageId} (${finalSizeKB.toFixed(1)}KB)`);
      
      // Check if the final result might cause localStorage quota issues
      if (finalSizeKB > 1000) { // 1MB warning
        console.warn(`⚠️ Large image size may cause storage issues: ${finalSizeKB.toFixed(1)}KB`);
      }
      
      // Update URL input and trigger callback
      onUpdate(imageId, imageDataUrl);
      setUrlInput(imageDataUrl);
      
      // Force a global cache refresh to ensure all components see the new image
      updateGlobalCacheBuster();
      
      toast({
        title: "Image uploaded successfully!",
        description: disableCompression 
          ? `Carousel image optimized (${finalSizeKB.toFixed(1)}KB)`
          : fileSizeKB > 100 
            ? "Image was compressed and is ready to use!"
            : "Your image is ready and will load instantly!",
      });
    } catch (error) {
      console.error(`❌ Image processing error for ${imageId}:`, error);
      
      let errorMessage = "Please try a different image file.";
      if (error instanceof Error) {
        if (error.message.includes("File size")) {
          errorMessage = "Image is too large. Please try a smaller image.";
        } else if (error.message.includes("Invalid")) {
          errorMessage = "Invalid image format. Please use JPG, PNG, or WebP.";
        }
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id={`file-input-${imageId}`}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => document.getElementById(`file-input-${imageId}`)?.click()}
        disabled={isUploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Button>
      
      <Input
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        placeholder="Or paste image URL"
        onBlur={async () => {
          if (urlInput && urlInput !== currentUrl) {
            console.log(`🔗 URL update for ${imageId}: ${urlInput}`);
            
            // Check if it's a valid URL format
            if (urlInput.startsWith('http://') || urlInput.startsWith('https://') || 
                urlInput.startsWith('data:')) {
              // Valid URL - use directly (much faster than re-uploading)
              console.log(`✅ SimpleImageUpload: Using direct URL for ${imageId}`);
              onUpdate(imageId, urlInput);
              updateGlobalCacheBuster();
              
              toast({
                title: "URL updated successfully!",
                description: "Image URL has been updated and is now visible everywhere!",
              });
            } else {
              toast({
                title: "Invalid URL",
                description: "Please enter a valid image URL starting with http:// or https://",
                variant: "destructive",
              });
            }
          }
        }}
      />
    </div>
  );
}