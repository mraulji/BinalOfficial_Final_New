import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { getVideos, STORAGE_KEYS } from "@/lib/data";
import type { Video } from "@shared/schema";

// VideoThumbnail component with multiple fallback methods
function VideoThumbnail({ video }: { video: Video }) {
  const [useIframe, setUseIframe] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!video.youtubeId) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Play className="h-12 w-12 text-primary/60 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Video Preview</p>
        </div>
      </div>
    );
  }

  // First try iframe approach (like admin dashboard)
  if (useIframe && !imageError) {
    return (
      <div className="w-full h-full relative overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          className="w-full h-full pointer-events-none transition-transform duration-500 group-hover:scale-110"
          style={{ border: 'none' }}
          loading="lazy"
          onError={() => setUseIframe(false)}
        />
        {/* Overlay to prevent iframe interaction */}
        <div className="absolute inset-0 bg-transparent cursor-pointer" />
      </div>
    );
  }

  // Fallback to thumbnail image
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  
  if (!imageError) {
    return (
      <img
        src={thumbnailUrl}
        alt={video.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }

  // Final fallback
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
      <div className="text-center">
        <Play className="h-12 w-12 text-primary/60 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Video Preview</p>
      </div>
    </div>
  );
}

export function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    // Load initial videos
    setVideos(getVideos());

    // Listen for localStorage changes
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === STORAGE_KEYS.VIDEOS) {
        setVideos(e.detail.value);
      }
    };

    window.addEventListener('localStorage-update', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('localStorage-update', handleStorageChange as EventListener);
    };
  }, []);

  return (
    <section id="videos" className="py-20 sm:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
            <p className="text-sm font-mono text-primary font-medium">Video Portfolio</p>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Watch Our Stories Come to Life
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience our cinematic approach to storytelling through our curated collection
            of video highlights and full event coverage.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-video overflow-hidden rounded-lg hover-elevate active-elevate-2 bg-muted block"
              data-testid={`video-${video.id}`}
            >
              <VideoThumbnail video={video} />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 bg-primary/90 group-hover:bg-primary rounded-full flex items-center justify-center transition-all">
                  <Play className="h-8 w-8 text-white ml-1" fill="white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="font-serif text-lg font-bold text-white">{video.title}</h3>
              </div>
            </a>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No videos available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
