import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import { randomUUID } from "crypto";
import fs from "fs";

// Configure multer for file uploads
const storage_multer = multer.memoryStorage();
const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from uploads directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'server/public/uploads')));

  // Image upload endpoint
  app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      // Generate unique filename
      const filename = `${randomUUID()}.webp`;
      const uploadsDir = path.join(process.cwd(), 'server/public/uploads');
      const filepath = path.join(uploadsDir, filename);

      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Process image: resize, optimize, convert to WebP
      await sharp(req.file.buffer)
        .resize(1920, 1080, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      // Return the URL for the uploaded image
      const imageUrl = `/uploads/${filename}`;
      
      res.json({ 
        success: true, 
        url: imageUrl,
        filename: filename
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  // Delete image endpoint
  app.delete('/api/uploads/:filename', (req, res) => {
    try {
      const filename = req.params.filename;
      const filepath = path.join(process.cwd(), 'server/public/uploads', filename);
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        res.json({ success: true, message: 'Image deleted successfully' });
      } else {
        res.status(404).json({ error: 'Image not found' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Failed to delete image' });
    }
  });

  // Get all uploaded images
  app.get('/api/uploads', (req, res) => {
    try {
      const uploadsDir = path.join(process.cwd(), 'server/public/uploads');
      
      if (!fs.existsSync(uploadsDir)) {
        return res.json({ images: [] });
      }

      const files = fs.readdirSync(uploadsDir)
        .filter(file => file.endsWith('.webp'))
        .map(filename => ({
          filename,
          url: `/uploads/${filename}`,
          uploadDate: fs.statSync(path.join(uploadsDir, filename)).mtime
        }))
        .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());

      res.json({ images: files });
    } catch (error) {
      console.error('List images error:', error);
      res.status(500).json({ error: 'Failed to list images' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
