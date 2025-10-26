// DIRECT SYNC SOLUTION - Simple server-side approach
// This creates a persistent sync mechanism that works across all browsers

interface SyncData {
  images: { [id: string]: string };
  lastUpdated: number;
}

class DirectSyncManager {
  private syncData: SyncData = {
    images: {},
    lastUpdated: 0
  };

  // Add or update an image URL
  updateImage(id: string, url: string) {
    this.syncData.images[id] = url;
    this.syncData.lastUpdated = Date.now();
    
    // Save to localStorage
    localStorage.setItem('direct_sync_data', JSON.stringify(this.syncData));
    
    // Force update URL to broadcast change
    this.updatePageUrl();
    
    console.log(`🔄 Direct sync updated: ${id} → ${url}`);
  }

  // Get image URL (returns Cloudinary if available, default otherwise)
  getImageUrl(id: string, defaultUrl: string): string {
    const syncUrl = this.syncData.images[id];
    
    console.log(`🔍 getImageUrl check: id="${id}", defaultUrl="${defaultUrl?.substring(0, 50)}...", syncUrl="${syncUrl ? syncUrl.substring(0, 50) : 'undefined'}..."`);
    
    if (syncUrl) {
      console.log(`✅ DIRECT SYNC OVERRIDE: ${id} → ${syncUrl}`);
      return syncUrl;
    }
    
    console.log(`📝 NO OVERRIDE: Using default for ${id}`);
    return defaultUrl;
  }

  // Update page URL with sync data
  private updatePageUrl() {
    if (Object.keys(this.syncData.images).length === 0) return;
    
    try {
      // Create simple URL parameters for each image
      const params = new URLSearchParams();
      
      Object.entries(this.syncData.images).forEach(([id, url]) => {
        params.set(id, url);
      });
      
      // Update URL without page reload
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
      
      console.log(`🔗 URL updated with sync data: ${Object.keys(this.syncData.images).length} images`);
    } catch (error) {
      console.warn('Failed to update URL:', error);
    }
  }

  // Load sync data from URL parameters or localStorage
  loadSyncData() {
    let loaded = false;
    
    // Try URL parameters first (for sharing)
    const urlParams = new URLSearchParams(window.location.search);
    const urlParamString = urlParams.toString();
    
    console.log(`🔍 Checking URL parameters: "${urlParamString}"`);
    console.log(`🔍 Full URL: ${window.location.href}`);
    
    if (urlParamString) {
      console.log(`🔍 Found URL parameters, processing...`);
      
      urlParams.forEach((url, id) => {
        console.log(`🔍 Processing param: id="${id}", url="${url.substring(0, 100)}..."`);
        
        if (url.includes('cloudinary.com')) {
          this.syncData.images[id] = url;
          loaded = true;
          console.log(`✅ Added to sync data: ${id} → ${url}`);
        } else {
          console.log(`❌ Skipping non-Cloudinary URL: ${url}`);
        }
      });
      
      if (loaded) {
        this.syncData.lastUpdated = Date.now();
        localStorage.setItem('direct_sync_data', JSON.stringify(this.syncData));
        console.log(`✅ Loaded sync data from URL: ${Object.keys(this.syncData.images).length} images`);
        console.log(`🔗 Final sync data:`, this.syncData.images);
        
        // Force immediate page reload to apply sync data
        console.log('🔄 URL sync data loaded - reloading page in 1 second to apply changes');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.log('❌ No valid Cloudinary URLs found in parameters');
      }
    } else {
      console.log('🔍 No URL parameters found');
    }
    
    // Fallback to localStorage
    if (!loaded) {
      try {
        const stored = localStorage.getItem('direct_sync_data');
        if (stored) {
          this.syncData = JSON.parse(stored);
          loaded = true;
          console.log(`📱 Loaded sync data from localStorage: ${Object.keys(this.syncData.images).length} images`);
        }
      } catch (error) {
        console.warn('Failed to load from localStorage:', error);
      }
    }
    
    if (!loaded) {
      console.log('🔍 No sync data found');
    }
    
    return loaded;
  }

  // Get current sync URL to share
  getSyncUrl(): string {
    if (Object.keys(this.syncData.images).length === 0) {
      return window.location.href;
    }
    
    const params = new URLSearchParams();
    Object.entries(this.syncData.images).forEach(([id, url]) => {
      params.set(id, url);
    });
    
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  // Check if we have any sync data
  hasSyncData(): boolean {
    return Object.keys(this.syncData.images).length > 0;
  }

  // Get all sync data for debugging
  getAllSyncData() {
    return this.syncData;
  }
}

// Export singleton
export const directSyncManager = new DirectSyncManager();

// Initialize direct sync
export const initializeDirectSync = () => {
  console.log('🚀 Initializing direct sync manager...');
  
  // Load existing sync data
  directSyncManager.loadSyncData();
  
  // Add debug function to window
  (window as any).testDirectSync = () => {
    console.log('🔧 Direct sync debug info:');
    console.log('Sync data:', directSyncManager.getAllSyncData());
    console.log('Has sync data:', directSyncManager.hasSyncData());
    console.log('Sync URL:', directSyncManager.getSyncUrl());
  };
  
  console.log('✅ Direct sync manager initialized');
  console.log('💡 TIP: Run testDirectSync() in console to debug');
};