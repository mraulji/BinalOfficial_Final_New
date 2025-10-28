import { useState, useEffect } from 'react';

interface ImageDimensionsProps {
  imageUrl: string;
  imageId: string;
}

export function ImageDimensions({ imageUrl, imageId }: ImageDimensionsProps) {
  const [dimensions, setDimensions] = useState<{width: number, height: number} | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageUrl || !imageUrl.trim()) {
      setDimensions(null);
      return;
    }

    setLoading(true);
    const img = new Image();
    
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setLoading(false);
    };
    
    img.onerror = () => {
      console.error(`Failed to load image for dimensions: ${imageId}`);
      setDimensions(null);
      setLoading(false);
    };
    
    img.src = imageUrl;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, imageId]);

  if (loading) {
    return (
      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded border">
        📏 Loading dimensions...
      </div>
    );
  }

  if (!dimensions) {
    return (
      <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border">
        📏 No dimensions
      </div>
    );
  }

  return (
    <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded border font-mono">
      📏 {dimensions.width} × {dimensions.height}
    </div>
  );
}