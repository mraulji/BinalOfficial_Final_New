import React, { useState, useEffect } from 'react';
import { addCacheBuster, getGlobalCacheBuster } from '@/lib/cacheManager';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallback?: string;
}

export const CachedImage: React.FC<CachedImageProps> = ({ 
  src, 
  fallback, 
  onLoad,
  onError,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src) {
      // Add cache buster to the source URL
      const cacheBustedSrc = addCacheBuster(src);
      setImageSrc(cacheBustedSrc);
      setHasError(false);
      
      console.log(`🖼️ CachedImage: ${src} → ${cacheBustedSrc}`);
    }
  }, [src, getGlobalCacheBuster()]); // Re-render when cache version changes

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(false);
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`❌ Image failed to load: ${imageSrc}`);
    setHasError(true);
    onError?.(e);
  };

  // Show fallback if error and fallback is provided
  const displaySrc = hasError && fallback ? fallback : imageSrc;

  return (
    <img
      {...props}
      src={displaySrc}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};