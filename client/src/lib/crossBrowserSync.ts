// Simple cross-browser image URL sharing using Netlify redirects and query parameters
// This ensures all browsers get the same updated image URLs

interface ImageUpdate {
  id: string;
  url: string;
  type: 'carousel' | 'gallery';
  timestamp: number;
}

class SimpleCrossBrowserSync {
  private updates: ImageUpdate[] = [];
  
  // Add an image update
  addUpdate(id: string, url: string, type: 'carousel' | 'gallery') {
    const update: ImageUpdate = {
      id,
      url,
      type,
      timestamp: Date.now()
    };
    
    this.updates.push(update);
    this.saveToURL();
    this.broadcastUpdate();
    
    console.log(`📡 Added cross-browser update: ${type}[${id}] → ${url}`);
  }
  
  // Get all updates for a specific type
  getUpdates(type: 'carousel' | 'gallery'): ImageUpdate[] {
    return this.updates.filter(update => update.type === type);
  }
  
  // Save updates to URL for cross-browser sharing
  private saveToURL() {
    try {
      const compressed = this.updates.map(u => `${u.type[0]}${u.id}=${encodeURIComponent(u.url)}`);
      const urlParams = compressed.join('&');
      
      // Update URL without page reload
      const newUrl = `${window.location.pathname}?img=${btoa(urlParams)}${window.location.hash}`;
      window.history.replaceState(null, '', newUrl);
      
      console.log(`🔗 Updated URL with ${this.updates.length} image updates`);
    } catch (error) {
      console.warn('Failed to update URL:', error);
    }
  }
  
  // Load updates from URL on page load
  loadFromURL() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const imgData = urlParams.get('img');
      
      if (imgData) {
        const decoded = atob(imgData);
        const pairs = decoded.split('&');
        
        this.updates = pairs.map(pair => {
          const [key, url] = pair.split('=');
          const type = (key[0] === 'c' ? 'carousel' : 'gallery') as 'carousel' | 'gallery';
          const id = key.substring(1);
          
          return {
            id,
            url: decodeURIComponent(url),
            type,
            timestamp: Date.now()
          };
        }).filter(update => update.id && update.url);
        
        console.log(`📥 Loaded ${this.updates.length} image updates from URL`);
      }
    } catch (error) {
      console.warn('Failed to load from URL:', error);
    }
  }
  
  // Broadcast update to other tabs
  private broadcastUpdate() {
    window.dispatchEvent(new CustomEvent('cross-browser-sync', {
      detail: { updates: this.updates }
    }));
  }
  
  // Check if we have an update for a specific image
  hasUpdate(id: string, type: 'carousel' | 'gallery'): boolean {
    return this.updates.some(update => update.id === id && update.type === type);
  }
  
  // Get updated URL for a specific image
  getUpdatedUrl(id: string, type: 'carousel' | 'gallery'): string | null {
    const update = this.updates.find(update => update.id === id && update.type === type);
    return update ? update.url : null;
  }
  
  // Clear all updates
  clear() {
    this.updates = [];
    const newUrl = `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState(null, '', newUrl);
    console.log('🧹 Cleared all cross-browser updates');
  }
}

// Export singleton instance
export const crossBrowserSync = new SimpleCrossBrowserSync();

// Initialize on page load
export const initializeCrossBrowserSync = () => {
  crossBrowserSync.loadFromURL();
  
  // Listen for storage events from other tabs
  window.addEventListener('cross-browser-sync', (event) => {
    console.log('📡 Received cross-browser sync event:', (event as CustomEvent).detail);
  });
  
  console.log('🌐 Cross-browser sync initialized');
};