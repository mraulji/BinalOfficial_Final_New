import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CachedImage } from "@/components/CachedImage";
import { getCarouselImages } from "@/lib/supabaseData";
import type { CarouselImage } from "@shared/schema";

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load images from Supabase
    const loadImages = async () => {
      try {
        setLoading(true);
        const carouselImages = await getCarouselImages();
        setImages(carouselImages);
      } catch (error) {
        console.error('Error loading carousel images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();

    // Listen for real-time updates
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail?.key === 'binal_carousel_images' && e.detail?.value) {
        console.log('🎠 HeroCarousel: Received carousel update event', e.detail.value);
        setImages(e.detail.value);
      }
    };

    window.addEventListener('localStorage-update', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('localStorage-update', handleStorageChange as EventListener);
    };
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying || images.length === 0) return;

    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, images.length]);

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      id="home" 
      className="relative h-screen w-full overflow-hidden"
      style={{ 
        minHeight: '100vh',
        minHeight: '100dvh' // Dynamic viewport height for mobile browsers
      }}
    >
      {/* Image - Mobile optimized */}
      <div className="absolute inset-0">
        <CachedImage
          src={currentImage.url}
          alt={currentImage.title || "Hero image"}
          className="w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay - Enhanced for mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />
      </div>

      {/* Content - Mobile optimized */}
      <div className="relative h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 leading-tight">
            {currentImage.title || "Binal Studio Photography"}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 leading-relaxed">
            {currentImage.subtitle || "Capturing Life's Beautiful Moments"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button
              size="lg"
              onClick={() => {
                const element = document.getElementById("gallery");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              data-testid="button-view-gallery"
              className="text-sm sm:text-base px-6 py-3"
            >
              View Our Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const element = document.getElementById("contact");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-sm sm:text-base px-6 py-3"
              data-testid="button-contact-us"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Mobile optimized */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
        data-testid="button-carousel-next"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dots Navigation - Mobile optimized */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 sm:h-3 rounded-full transition-all ${
              index === currentIndex
                ? "w-6 sm:w-8 bg-white"
                : "w-2 sm:w-3 bg-white/50 hover:bg-white/75"
            }`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
