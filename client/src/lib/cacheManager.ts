// Global cache management for ensuring images update across all browsers and devices
let globalCacheBuster = Date.now();

// Update the global cache buster when images are uploaded
export const updateGlobalCacheBuster = () => {
  globalCacheBuster = Date.now();
  console.log(`🔄 Global cache buster updated: ${globalCacheBuster}`);
  
  // Store in localStorage to persist across page reloads
  localStorage.setItem('binal_image_cache_version', globalCacheBuster.toString());
  
  // Force refresh of all images on the current page
  refreshAllImagesOnPage();
};

// Get current cache buster version
export const getGlobalCacheBuster = () => {
  // Check localStorage first, then use current timestamp
  const stored = localStorage.getItem('binal_image_cache_version');
  return stored ? parseInt(stored, 10) : globalCacheBuster;
};

// Add cache buster to any image URL
export const addCacheBuster = (url: string) => {
  if (!url || url.startsWith('data:')) return url;
  
  const cacheBuster = getGlobalCacheBuster();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}cb=${cacheBuster}`;
};

// Force refresh all images on the current page
const refreshAllImagesOnPage = () => {
  const images = document.querySelectorAll('img[src*="res.cloudinary.com"], img[src*="cloudinary"]');
  const cacheBuster = getGlobalCacheBuster();
  
  images.forEach((img) => {
    const imgElement = img as HTMLImageElement;
    const originalSrc = imgElement.src;
    
    // Remove old cache buster and add new one
    const baseSrc = originalSrc.split('?')[0];
    const newSrc = `${baseSrc}?cb=${cacheBuster}`;
    
    if (originalSrc !== newSrc) {
      console.log(`🔄 Refreshing image: ${baseSrc}`);
      imgElement.src = newSrc;
    }
  });
};

// Initialize cache buster on page load
export const initializeCacheManagement = () => {
  // Update global cache buster if needed
  const stored = localStorage.getItem('binal_image_cache_version');
  if (!stored) {
    updateGlobalCacheBuster();
  }
  
  // Refresh images on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refreshAllImagesOnPage);
  } else {
    refreshAllImagesOnPage();
  }
  
  console.log(`🌐 Cache management initialized with version: ${getGlobalCacheBuster()}`);
};

// Hook for React components to force image refresh
export const useImageCacheBuster = () => {
  return {
    addCacheBuster,
    refreshAllImages: refreshAllImagesOnPage,
    updateCache: updateGlobalCacheBuster,
    currentVersion: getGlobalCacheBuster()
  };
};