// Force all browsers to use the same image URLs through a global config endpoint
// This creates a simple API that all browsers can check for the latest image URLs

interface GlobalImageConfig {
  carousel: { [id: string]: string };
  gallery: { [id: string]: string };
  lastUpdated: number;
}

class GlobalConfigManager {
  private config: GlobalImageConfig = {
    carousel: {},
    gallery: {},
    lastUpdated: 0
  };

  // Update an image URL and save to global config
  updateImageUrl(id: string, url: string, type: 'carousel' | 'gallery') {
    if (type === 'carousel') {
      this.config.carousel[id] = url;
    } else {
      this.config.gallery[id] = url;
    }
    
    this.config.lastUpdated = Date.now();
    this.saveConfig();
    
    console.log(`🌐 Global config updated: ${type}[${id}] → ${url}`);
  }

  // Get the current URL for an image (returns Cloudinary URL if available)
  getImageUrl(id: string, type: 'carousel' | 'gallery', defaultUrl: string): string {
    const configUrl = type === 'carousel' ? this.config.carousel[id] : this.config.gallery[id];
    
    if (configUrl && configUrl !== defaultUrl) {
      console.log(`🔄 ✅ OVERRIDE: Using global config URL for ${type}[${id}]: ${defaultUrl} → ${configUrl}`);
      return configUrl;
    }
    
    console.log(`📝 NO OVERRIDE: ${type}[${id}] using default: ${defaultUrl}`);
    return defaultUrl;
  }

  // Save config to multiple locations for cross-browser access
  private saveConfig() {
    // 1. Save to localStorage
    localStorage.setItem('global_image_config', JSON.stringify(this.config));
    
    // 2. Save to URL hash for sharing
    try {
      const compressed = btoa(JSON.stringify(this.config));
      window.location.hash = `config=${compressed}`;
      console.log(`🔗 Updated URL hash with global config`);
    } catch (error) {
      console.warn('Failed to update URL hash:', error);
    }
    
    // 3. Broadcast to other tabs/windows
    window.dispatchEvent(new CustomEvent('global-config-updated', {
      detail: this.config
    }));
  }

  // Load config from URL, localStorage, or other sources
  loadConfig() {
    let loaded = false;
    let source = '';

    console.log(`🔍 Loading config - URL hash: ${window.location.hash}`);

    // Try URL hash first (highest priority for cross-browser sharing)
    if (window.location.hash.startsWith('#config=')) {
      try {
        const compressed = window.location.hash.substring(8);
        console.log(`🔓 Decoding hash: ${compressed.substring(0, 50)}...`);
        const decoded = atob(compressed);
        this.config = JSON.parse(decoded);
        loaded = true;
        source = 'URL hash';
        console.log(`📥 SUCCESS: Loaded config from URL hash: ${Object.keys(this.config.carousel).length + Object.keys(this.config.gallery).length} images`);
        console.log(`📋 Config details:`, this.config);
      } catch (error) {
        console.error('❌ Failed to load config from URL hash:', error);
        console.log('📝 Raw hash:', window.location.hash);
      }
    }

    // Fallback to localStorage
    if (!loaded) {
      try {
        const stored = localStorage.getItem('global_image_config');
        if (stored) {
          this.config = JSON.parse(stored);
          loaded = true;
          source = 'localStorage';
          console.log(`📥 Loaded config from localStorage: ${Object.keys(this.config.carousel).length + Object.keys(this.config.gallery).length} images`);
        }
      } catch (error) {
        console.warn('Failed to load config from localStorage:', error);
      }
    }

    if (loaded) {
      console.log(`✅ Global config loaded from ${source} - will apply to images`);
    } else {
      console.log(`❌ No global config found in URL hash or localStorage`);
    }
  }

  // Force refresh all images on the page to use global config
  forceRefreshAllImages() {
    // Update carousel images
    Object.keys(this.config.carousel).forEach(id => {
      const url = this.config.carousel[id];
      this.updateImageElements(id, url);
    });

    // Update gallery images
    Object.keys(this.config.gallery).forEach(id => {
      const url = this.config.gallery[id];
      this.updateImageElements(id, url);
    });

    console.log('🔄 Force refreshed all images with global config');
  }

  // Update actual img elements on the page
  private updateImageElements(id: string, newUrl: string) {
    // Find images that might be using this ID
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      const src = img.src;
      
      // Check if this image is for the specific ID (look for patterns)
      if (src.includes(`/${id}`) || src.includes(`_${id}_`) || img.dataset.imageId === id) {
        console.log(`🔄 Updating img element: ${src} → ${newUrl}`);
        img.src = newUrl;
      }
    });
  }

  // Get all current mappings
  getAllMappings() {
    return this.config;
  }

  // Check if we have any mappings
  hasMappings(): boolean {
    return Object.keys(this.config.carousel).length > 0 || Object.keys(this.config.gallery).length > 0;
  }
}

// Export singleton
export const globalConfigManager = new GlobalConfigManager();

// Initialize global config management
export const initializeGlobalConfig = () => {
  console.log('🚀 Initializing global config manager...');
  
  // Load existing config
  globalConfigManager.loadConfig();

  // Listen for updates from other tabs
  window.addEventListener('global-config-updated', (event) => {
    const customEvent = event as CustomEvent;
    console.log('📡 Received global config update from another tab');
    globalConfigManager.forceRefreshAllImages();
  });

  // Force refresh images after DOM is ready
  setTimeout(() => {
    const hasMappings = globalConfigManager.hasMappings();
    console.log(`🔍 DOM ready - has mappings: ${hasMappings}`);
    if (hasMappings) {
      console.log('🔄 Force refreshing all images...');
      globalConfigManager.forceRefreshAllImages();
    }
  }, 1000);

  // Add debugging helper to window for testing
  (window as any).testGlobalConfig = () => {
    console.log('🔧 Global config debug info:');
    console.log('Config:', globalConfigManager.getAllMappings());
    console.log('URL hash:', window.location.hash);
    console.log('Has mappings:', globalConfigManager.hasMappings());
  };

  console.log('✅ Global config manager initialized');
  console.log('💡 TIP: Run testGlobalConfig() in console to debug');
};