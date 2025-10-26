import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image, Link } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentUrl?: string;
  uniqueId?: string; // Add unique identifier
}

export function ImageUpload({ onImageUploaded, currentUrl, uniqueId }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (30MB limit)
    if (file.size > 30 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 30MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        const fullUrl = `${window.location.origin}${result.url}`;
        console.log(`📸 ImageUpload calling callback for uniqueId: ${uniqueId}, URL: ${fullUrl}`);
        onImageUploaded(fullUrl);
        setUrlInput(fullUrl);
        toast({
          title: "Upload successful",
          description: "Image uploaded and optimized",
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
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

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleUrlSubmit = () => {
    if (urlInput) {
      onImageUploaded(urlInput);
      toast({
        title: "URL updated",
        description: "Image URL has been set",
      });
    }
  };

  const clearImage = () => {
    setUrlInput('');
    onImageUploaded('');
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 text-muted-foreground">
              <Upload className="w-full h-full" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports JPG, PNG, WebP (max 30MB)
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button 
                variant="outline" 
                disabled={isUploading}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Image className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Select Image'}
              </Button>
              
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* URL Input Alternative */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link className="w-4 h-4" />
          <span>Or enter image URL:</span>
        </div>
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1"
          />
          <Button 
            variant="outline" 
            onClick={handleUrlSubmit}
            disabled={!urlInput}
          >
            Set URL
          </Button>
          {urlInput && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={clearImage}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Current Image Preview */}
      {urlInput && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Current Image:</div>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={urlInput}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => {
                    toast({
                      title: "Image load error",
                      description: "Failed to load image from URL",
                      variant: "destructive",
                    });
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground break-all">
                {urlInput}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}