// Automatic URL sync and redirect system for cross-browser image sharing
// This ensures ALL browsers automatically get the latest image URLs

interface ImageMapping {
  [key: string]: string; // imageId -> cloudinaryUrl
}

class AutoUrlSync {
  private carouselMappings: ImageMapping = {};
  private galleryMappings: ImageMapping = {};
  
  // Add an image mapping and update URL
  addMapping(id: string, url: string, type: 'carousel' | 'gallery') {
    if (type === 'carousel') {
      this.carouselMappings[id] = url;
    } else {
      this.galleryMappings[id] = url;
    }
    
    this.updateBrowserUrl();
    console.log(`🔄 Added ${type} mapping: ${id} → ${url}`);
  }
  
  // Get all mappings for a type
  getMappings(type: 'carousel' | 'gallery'): ImageMapping {
    return type === 'carousel' ? this.carouselMappings : this.galleryMappings;
  }
  
  // Update the browser URL with all mappings
  private updateBrowserUrl() {
    const allMappings = {
      ...Object.fromEntries(Object.entries(this.carouselMappings).map(([k, v]) => [`c${k}`, v])),
      ...Object.fromEntries(Object.entries(this.galleryMappings).map(([k, v]) => [`g${k}`, v]))
    };
    
    if (Object.keys(allMappings).length > 0) {
      const params = new URLSearchParams(allMappings);
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      
      // Update URL without reload
      window.history.replaceState(null, '', newUrl);
      console.log(`📡 Updated URL with ${Object.keys(allMappings).length} image mappings`);
      
      // Also save to localStorage as backup
      localStorage.setItem('image_url_mappings', JSON.stringify(allMappings));
    }
  }
  
  // Load mappings from URL or localStorage
  loadMappings() {
    // Try URL first
    const urlParams = new URLSearchParams(window.location.search);
    const urlMappings: { [key: string]: string } = {};
    
    urlParams.forEach((value, key) => {
      if ((key.startsWith('c') || key.startsWith('g')) && key.length > 1) {
        urlMappings[key] = value;
      }
    });
    
    // If no URL mappings, try localStorage
    let mappings = urlMappings;
    if (Object.keys(mappings).length === 0) {
      try {
        const stored = localStorage.getItem('image_url_mappings');
        if (stored) {
          mappings = JSON.parse(stored);
        }
      } catch (error) {
        console.warn('Failed to load stored mappings:', error);
      }
    }
    
    // Parse mappings
    for (const [key, url] of Object.entries(mappings)) {
      if (key.startsWith('c')) {
        const id = key.substring(1);
        this.carouselMappings[id] = url;
      } else if (key.startsWith('g')) {
        const id = key.substring(1);
        this.galleryMappings[id] = url;
      }
    }
    
    const totalMappings = Object.keys(this.carouselMappings).length + Object.keys(this.galleryMappings).length;
    if (totalMappings > 0) {
      console.log(`📥 Loaded ${totalMappings} image mappings from URL/storage`);
      
      // Update URL to ensure consistency
      this.updateBrowserUrl();
    }
  }
  
  // Get updated URL for an image, or return original if no mapping
  getUpdatedUrl(id: string, type: 'carousel' | 'gallery', originalUrl: string): string {
    const mapping = type === 'carousel' ? this.carouselMappings[id] : this.galleryMappings[id];
    if (mapping && mapping !== originalUrl) {
      console.log(`🔄 Overriding ${type}[${id}]: ${originalUrl} → ${mapping}`);
      return mapping;
    }
    return originalUrl;
  }
  
  // Check if we have any mappings
  hasMappings(): boolean {
    return Object.keys(this.carouselMappings).length > 0 || Object.keys(this.galleryMappings).length > 0;
  }
  
  // Clear all mappings
  clear() {
    this.carouselMappings = {};
    this.galleryMappings = {};
    localStorage.removeItem('image_url_mappings');
    
    // Clean URL
    const newUrl = `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState(null, '', newUrl);
    console.log('🧹 Cleared all image mappings');
  }
}

// Export singleton
export const autoUrlSync = new AutoUrlSync();

// Initialize and check for redirects
export const initializeAutoUrlSync = () => {
  // Load existing mappings
  autoUrlSync.loadMappings();
  
  // If this browser doesn't have URL params but should, try to get them from a known source
  if (!window.location.search && !autoUrlSync.hasMappings()) {
    // Check if we can get the latest mappings from another source
    checkForLatestMappings();
  }
  
  console.log('🌍 Auto URL sync initialized');
};

// Check for the latest mappings from various sources
const checkForLatestMappings = async () => {
  try {
    // Try to get mappings from localStorage of other tabs
    const stored = localStorage.getItem('image_url_mappings');
    if (stored) {
      const mappings = JSON.parse(stored);
      
      // Add URL params and redirect
      const params = new URLSearchParams(mappings);
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      
      console.log('🔄 Redirecting to URL with image mappings...');
      window.location.href = newUrl;
    }
  } catch (error) {
    console.warn('Could not check for latest mappings:', error);
  }
};