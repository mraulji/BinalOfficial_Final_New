import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Globe } from 'lucide-react';
import { uploadToCloudinary, uploadUrlToCloudinary, CLOUDINARY_CONFIG, preloadImage, refreshImageCache } from '@/lib/cloudinaryService';

interface SimpleImageUploadProps {
  imageId: string;
  currentUrl?: string;
  onUpdate: (imageId: string, url: string) => void;
}

export function SimpleImageUpload({ imageId, currentUrl, onUpdate }: SimpleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    console.log(`🔧 SimpleImageUpload: Starting Cloudinary upload for ${imageId}`);
    
    // Check file size and show appropriate message
    const fileSizeMB = (file.size / 1024 / 1024);
    const maxSizeBytes = 10485760; // Exact Cloudinary limit
    const maxSizeMB = maxSizeBytes / 1024 / 1024;
    
    if (file.size > maxSizeBytes) {
      toast({
        title: "Large file detected",
        description: `File is ${fileSizeMB.toFixed(1)}MB. Compressing to fit ${maxSizeMB.toFixed(1)}MB limit...`,
      });
    }
    
    setIsUploading(true);
    try {
      // Determine folder based on context
      const folder = imageId.includes('carousel') 
        ? CLOUDINARY_CONFIG.FOLDERS.CAROUSEL 
        : CLOUDINARY_CONFIG.FOLDERS.GALLERY;
      
      // Upload to Cloudinary (with automatic compression if needed)
      const cloudinaryUrl = await uploadToCloudinary(file, folder);
      
      console.log(`✅ SimpleImageUpload: Cloudinary success for ${imageId}, URL: ${cloudinaryUrl}`);
      
      // Preload image to ensure it's ready for all browsers/devices
      try {
        await preloadImage(cloudinaryUrl);
      } catch (error) {
        console.warn('Image preload failed, but upload was successful');
      }
      
      onUpdate(imageId, cloudinaryUrl);
      setUrlInput(cloudinaryUrl);
      
      toast({
        title: "Image uploaded successfully!",
        description: file.size > maxSizeBytes 
          ? "Large image was compressed and uploaded. Visible on all devices!"
          : "Your image is now stored in the cloud and visible everywhere!",
      });
    } catch (error) {
      console.error(`❌ Cloudinary upload error for ${imageId}:`, error);
      
      let errorMessage = "Please try a smaller image or check your connection.";
      if (error instanceof Error) {
        if (error.message.includes("File size too large")) {
          errorMessage = `Image is too large. Please use an image smaller than ${maxSizeMB.toFixed(1)}MB.`;
        } else if (error.message.includes("Invalid image")) {
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
            
            // Check if it's already a valid cloud URL or if it needs to be uploaded
            if (urlInput.startsWith('https://res.cloudinary.com/') || 
                urlInput.startsWith('data:') || 
                urlInput.length < 10) {
              // Already a Cloudinary URL, data URL, or invalid URL - use as-is
              onUpdate(imageId, urlInput);
            } else {
              // External URL - upload to Cloudinary for better performance and reliability
              try {
                setIsUploading(true);
                
                const folder = imageId.includes('carousel') 
                  ? CLOUDINARY_CONFIG.FOLDERS.CAROUSEL 
                  : CLOUDINARY_CONFIG.FOLDERS.GALLERY;
                
                const cloudinaryUrl = await uploadUrlToCloudinary(urlInput, folder);
                
                console.log(`✅ SimpleImageUpload: URL uploaded to Cloudinary for ${imageId}`);
                
                // Preload image to ensure it's ready for all browsers/devices
                try {
                  await preloadImage(cloudinaryUrl);
                } catch (error) {
                  console.warn('Image preload failed, but upload was successful');
                }
                
                onUpdate(imageId, cloudinaryUrl);
                setUrlInput(cloudinaryUrl);
                
                toast({
                  title: "Image uploaded successfully!",
                  description: "External URL has been uploaded and is now visible everywhere!",
                });
              } catch (error) {
                console.error(`❌ URL upload error for ${imageId}:`, error);
                
                // Fallback to original URL if Cloudinary fails
                onUpdate(imageId, urlInput);
                
                toast({
                  title: "Using external URL",
                  description: "Could not upload to cloud storage, using original URL.",
                  variant: "destructive",
                });
              } finally {
                setIsUploading(false);
              }
            }
          }
        }}
      />
    </div>
  );
}