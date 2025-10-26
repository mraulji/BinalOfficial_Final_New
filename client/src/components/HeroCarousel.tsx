import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCarouselImages, STORAGE_KEYS } from "@/lib/data";
import type { CarouselImage } from "@shared/schema";

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    // Load initial images
    setImages(getCarouselImages());

    // Listen for localStorage changes
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === STORAGE_KEYS.CAROUSEL) {
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
    <div id="home" className="relative h-screen w-full overflow-hidden">
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={currentImage.url}
          alt={currentImage.title || "Hero image"}
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {currentImage.title || "Binal Studio Photography"}
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            {currentImage.subtitle || "Capturing Life's Beautiful Moments"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button
              size="lg"
              onClick={() => {
                const element = document.getElementById("gallery");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              data-testid="button-view-gallery"
              className="text-base"
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
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              data-testid="button-contact-us"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
        data-testid="button-carousel-next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-white"
                : "w-3 bg-white/50 hover:bg-white/75"
            }`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
