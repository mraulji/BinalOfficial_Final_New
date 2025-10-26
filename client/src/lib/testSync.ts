// SIMPLE TEST - Manual sync URL for testing
// This creates a test URL you can use to verify cross-browser sync works

// Test URL with a Cloudinary image parameter
const TEST_SYNC_URL = `${window.location.origin}${window.location.pathname}?1=https://res.cloudinary.com/dwm2bmzxd/image/upload/v1761496157/binal_showcase/gallery/binal_showcase_gallery_1761494117554_lrm07u.jpg`;

console.log('🧪 TEST SYNC URL:', TEST_SYNC_URL);
console.log('🔗 Copy this URL and open it in another browser to test sync');
console.log('🚀 Deployment check: ' + new Date().toISOString());

// Add to window for easy access
(window as any).getTestSyncUrl = () => TEST_SYNC_URL;

export { TEST_SYNC_URL };