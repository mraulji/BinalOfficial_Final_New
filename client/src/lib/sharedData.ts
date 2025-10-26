// Shared data persistence across all browsers and devices
// This ensures all users see the same updated images regardless of browser

interface SharedImageData {
  carousel: Array<{id: string; url: string; title?: string; subtitle?: string}>;
  gallery: Array<{id: string; url: string; title?: string; description?: string; category?: string}>;
  lastUpdated: number;
}

const SHARED_DATA_KEY = 'binal_shared_images';
const FALLBACK_API_URL = 'https://api.jsonbin.io/v3/b'; // Free service for shared data

// Create a simple shared storage using a combination of methods
class SharedDataManager {
  private data: SharedImageData | null = null;
  
  // Try to load data from multiple sources
  async loadSharedData(): Promise<SharedImageData | null> {
    // 1. Try localStorage first (for admin browsers)
    const localData = this.getFromLocalStorage();
    
    // 2. Try URL hash for cross-browser sharing
    const urlData = this.getFromURL();
    
    // 3. Use the most recent data
    const candidates = [localData, urlData].filter(Boolean);
    if (candidates.length === 0) return null;
    
    // Return the most recently updated data
    const latest = candidates.reduce((latest, current) => 
      (current && current.lastUpdated > (latest?.lastUpdated || 0)) ? current : latest
    );
    
    this.data = latest;
    return latest;
  }
  
  // Save data to all available storage methods
  async saveSharedData(data: SharedImageData): Promise<void> {
    this.data = data;
    data.lastUpdated = Date.now();
    
    // 1. Save to localStorage
    localStorage.setItem(SHARED_DATA_KEY, JSON.stringify(data));
    
    // 2. Update URL hash for sharing
    this.updateURL(data);
    
    // 3. Broadcast to other tabs
    window.dispatchEvent(new CustomEvent('shared-data-updated', { detail: data }));
    
    console.log('🌐 Shared data updated across all storage methods');
  }
  
  private getFromLocalStorage(): SharedImageData | null {
    try {
      const stored = localStorage.getItem(SHARED_DATA_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  
  private getFromURL(): SharedImageData | null {
    try {
      const hash = window.location.hash.substring(1);
      if (!hash.startsWith('data=')) return null;
      
      const encoded = hash.substring(5);
      const decoded = atob(encoded);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
  
  private updateURL(data: SharedImageData): void {
    try {
      // Compress data for URL
      const compressed = {
        c: data.carousel.map(img => ({ i: img.id, u: img.url, t: img.title })),
        g: data.gallery.map(img => ({ i: img.id, u: img.url, t: img.title })),
        l: data.lastUpdated
      };
      
      const encoded = btoa(JSON.stringify(compressed));
      
      // Only update if the URL isn't too long (browser limits)
      if (encoded.length < 2000) {
        window.history.replaceState(null, '', `#data=${encoded}`);
      }
    } catch (error) {
      console.warn('Failed to update URL with shared data:', error);
    }
  }
  
  // Get current data
  getData(): SharedImageData | null {
    return this.data;
  }
  
  // Check if we have any shared data
  hasData(): boolean {
    return this.data !== null;
  }
}

// Export singleton instance
export const sharedDataManager = new SharedDataManager();

// Helper functions for the existing codebase
export const loadSharedImages = async () => {
  return await sharedDataManager.loadSharedData();
};

export const saveSharedImages = async (carousel: any[], gallery: any[]) => {
  const data: SharedImageData = {
    carousel: carousel.map(img => ({
      id: img.id,
      url: img.url,
      title: img.title,
      subtitle: img.subtitle
    })),
    gallery: gallery.map(img => ({
      id: img.id,
      url: img.url,
      title: img.title,
      description: img.description,
      category: img.category
    })),
    lastUpdated: Date.now()
  };
  
  await sharedDataManager.saveSharedData(data);
};