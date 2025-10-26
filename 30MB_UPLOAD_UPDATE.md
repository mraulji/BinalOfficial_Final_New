# File Upload Limit Updated to 30MB

## ✅ Changes Made

### 1. **Server-side Configuration** (routes.ts)
```typescript
// BEFORE:
fileSize: 10 * 1024 * 1024, // 10MB limit

// AFTER:
fileSize: 30 * 1024 * 1024, // 30MB limit
```

### 2. **Client-side Validation** (ImageUpload.tsx)
```typescript
// BEFORE:
if (file.size > 10 * 1024 * 1024) {
  // Error: "Please select an image smaller than 10MB"
}

// AFTER:  
if (file.size > 30 * 1024 * 1024) {
  // Error: "Please select an image smaller than 30MB"
}
```

### 3. **User Interface Text**
```typescript
// BEFORE:
"Supports JPG, PNG, WebP (max 10MB)"

// AFTER:
"Supports JPG, PNG, WebP (max 30MB)"
```

## 🎯 What This Means

### ✅ **Now You Can Upload:**
- Images up to **30MB** in size
- High-resolution photography files
- Large format images without compression

### ⚡ **Automatic Optimization Still Works:**
- Files are resized to max 1920x1080
- Converted to WebP format (85% quality)
- Optimized for web performance
- Even large uploads become fast-loading images

### 📱 **File Size Examples:**
- **Before (10MB)**: ~4000x3000px high-quality JPEG
- **After (30MB)**: ~6000x4000px+ professional RAW/TIFF exports

## 🚀 Ready to Test

The server automatically applies changes with hot reload. You can now:

1. **Go to admin panel**: http://localhost:5000/admin
2. **Upload larger images**: Up to 30MB
3. **No size limit errors**: For files under 30MB
4. **Same optimization**: Still converts to optimized WebP

Perfect for professional photography portfolios! 📸✨