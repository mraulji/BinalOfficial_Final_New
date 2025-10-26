import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CachedImage } from "@/components/CachedImage";
import { getGalleryImages } from "@/lib/supabaseData";
import type { GalleryImage } from "@shared/schema";

const categories = [
  { value: "all", label: "All" },
  { value: "wedding", label: "Weddings" },
  { value: "events", label: "Events" },
  { value: "portraits", label: "Portraits" },
  { value: "commercial", label: "Commercial" },
] as const;

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load images from Supabase
    const loadImages = async () => {
      try {
        setLoading(true);
        const galleryImages = await getGalleryImages();
        setImages(galleryImages);
      } catch (error) {
        console.error('Error loading gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();

    // Listen for real-time updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'binal_gallery_images' && e.newValue) {
        const updatedImages = JSON.parse(e.newValue);
        setImages(updatedImages);
      }
    };

    window.addEventListener('localStorage-update', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('localStorage-update', handleStorageChange as EventListener);
    };
  }, []);

  const filteredImages = selectedCategory === "all"
    ? images.filter((img) => {
        // For "All" button: only show images where primaryCategory is NOT "none" (blank)
        // If primaryCategory is "none", the image should only appear in specific categories
        console.log(`🌟 ALL filter - Image ${img.id}: primary=${img.primaryCategory}, should show: ${img.primaryCategory !== "none"}`);
        return img.primaryCategory !== "none";
      })
    : images.filter((img) => {
        console.log(`🔍 Category filter ${selectedCategory} - Image ${img.id}: primary=${img.primaryCategory}, secondary=${img.secondaryCategory}`);
        
        // For specific category buttons:
        // Show if secondaryCategory matches the selected category
        // OR if primaryCategory matches (and it's not "none")
        const matchesSecondary = img.secondaryCategory === selectedCategory;
        const matchesPrimary = img.primaryCategory === selectedCategory;
        const shouldShow = matchesSecondary || matchesPrimary;
        
        console.log(`📋 Image ${img.id} shouldShow: ${shouldShow} (matchesSecondary: ${matchesSecondary}, matchesPrimary: ${matchesPrimary})`);
        return shouldShow;
      });

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
    const newIndex = direction === "next"
      ? (currentIndex + 1) % filteredImages.length
      : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateImage("prev");
      if (e.key === "ArrowRight") navigateImage("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, filteredImages]);

  return (
    <section id="gallery" className="py-20 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
            <p className="text-sm font-mono text-primary font-medium">Portfolio</p>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Our Latest Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Browse through our portfolio of stunning photography across different categories.
            Each image tells a unique story.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                data-testid={`button-filter-${category.value}`}
                className="font-mono"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <button
              key={image.id}
              onClick={() => openLightbox(image)}
              className="group relative overflow-hidden rounded-lg aspect-square hover-elevate active-elevate-2 bg-muted"
              data-testid={`image-gallery-${image.id}`}
            >
              <CachedImage
                src={image.url}
                alt={image.title || "Gallery image"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {image.title && (
                    <h3 className="font-serif text-xl font-bold text-white mb-1">
                      {image.title}
                    </h3>
                  )}
                  <p className="text-sm font-mono text-white/80 capitalize">
                    {image.category}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No images in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            data-testid="button-close-lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            data-testid="button-lightbox-prev"
          >
            ←
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            data-testid="button-lightbox-next"
          >
            →
          </button>

          <div
            className="max-w-6xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <CachedImage
              src={selectedImage.url}
              alt={selectedImage.title || "Gallery image"}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {selectedImage.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="font-serif text-2xl font-bold text-white mb-2">
                  {selectedImage.title}
                </h3>
                {selectedImage.description && (
                  <p className="text-white/80">{selectedImage.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
