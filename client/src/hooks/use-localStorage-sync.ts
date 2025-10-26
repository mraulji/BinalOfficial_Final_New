import { useState, useEffect } from 'react';

// Custom hook to listen for localStorage changes
export function useLocalStorageSync<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('localStorage-update', {
        detail: { key, value }
      }));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    // Listen for custom events (same tab)
    window.addEventListener('localStorage-update', handleStorageChange as EventListener);
    
    // Listen for storage events (different tabs)
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('localStorage-update', handleStorageChange as EventListener);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [key]);

  return [storedValue, setValue];
}

// Hook specifically for carousel images
export function useCarouselImages() {
  const { getCarouselImages } = require('@/lib/data');
  return useLocalStorageSync('binal_carousel_images', getCarouselImages());
}

// Hook specifically for gallery images  
export function useGalleryImages() {
  const { getGalleryImages } = require('@/lib/data');
  return useLocalStorageSync('binal_gallery_images', getGalleryImages());
}