import React, { useState, useEffect } from 'react';
import { addCacheBuster, getGlobalCacheBuster } from '@/lib/cacheManager';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | any; // Allow objects to be passed (will extract URL)
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
      // Debug what we're receiving
      console.log('🔍 CachedImage received src:', typeof src, src);
      
      let actualUrl = src;
      
      // Handle different types of src
      if (typeof src === 'object' && src !== null) {
        // Direct object passed
        actualUrl = (src as any).url || src;
        console.log('🔧 Extracted URL from object:', actualUrl);
      } else if (typeof src === 'string') {
        // Check if string is actually JSON
        if (src.startsWith('{') && src.endsWith('}')) {
          try {
            const parsed = JSON.parse(src);
            actualUrl = parsed.url || src;
            console.log('🔧 Extracted URL from JSON string:', actualUrl);
          } catch (e) {
            // Not valid JSON, use as-is
            actualUrl = src;
          }
        } else {
          // Regular URL string
          actualUrl = src;
        }
      }
      
      // Ensure we have a clean string URL
      const urlString = typeof actualUrl === 'string' ? actualUrl : String(actualUrl);
      
      // Validate URL before proceeding
      if (!urlString || urlString === 'undefined' || urlString === 'null') {
        console.warn('⚠️ Invalid URL received:', urlString);
        return;
      }
      
      // Add cache buster to the source URL
      const cacheBustedSrc = addCacheBuster(urlString);
      setImageSrc(cacheBustedSrc);
      setHasError(false);
      
      console.log(`🖼️ CachedImage: ${urlString} → ${cacheBustedSrc}`);
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