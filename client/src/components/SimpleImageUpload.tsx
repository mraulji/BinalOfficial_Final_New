import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

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
    console.log(`🔧 SimpleImageUpload: Starting upload for ${imageId}`);
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        const fullUrl = `${window.location.origin}${result.url}`;
        console.log(`✅ SimpleImageUpload: Success for ${imageId}, calling onUpdate with ${fullUrl}`);
        onUpdate(imageId, fullUrl);
        setUrlInput(fullUrl);
      }
    } catch (error) {
      console.error(`❌ Upload error for ${imageId}:`, error);
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
        onBlur={() => {
          if (urlInput && urlInput !== currentUrl) {
            console.log(`🔗 URL update for ${imageId}: ${urlInput}`);
            onUpdate(imageId, urlInput);
          }
        }}
      />
    </div>
  );
}