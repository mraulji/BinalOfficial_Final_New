import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Globe } from 'lucide-react';
import { uploadToCloudinary, uploadUrlToCloudinary, CLOUDINARY_CONFIG } from '@/lib/cloudinaryService';

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
    
    setIsUploading(true);
    try {
      // Determine folder based on context
      const folder = imageId.includes('carousel') 
        ? CLOUDINARY_CONFIG.FOLDERS.CAROUSEL 
        : CLOUDINARY_CONFIG.FOLDERS.GALLERY;
      
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file, folder);
      
      console.log(`✅ SimpleImageUpload: Cloudinary success for ${imageId}, URL: ${cloudinaryUrl}`);
      onUpdate(imageId, cloudinaryUrl);
      setUrlInput(cloudinaryUrl);
      
      toast({
        title: "Image uploaded successfully!",
        description: "Your image is now stored in the cloud.",
      });
    } catch (error) {
      console.error(`❌ Cloudinary upload error for ${imageId}:`, error);
      toast({
        title: "Upload failed",
        description: "Please check your Cloudinary configuration or try again.",
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
                onUpdate(imageId, cloudinaryUrl);
                setUrlInput(cloudinaryUrl);
                
                toast({
                  title: "Image uploaded successfully!",
                  description: "External URL has been uploaded to our cloud storage.",
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