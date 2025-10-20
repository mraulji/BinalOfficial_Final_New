import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { getVideos } from "@/lib/data";
import type { Video } from "@shared/schema";

export function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    setVideos(getVideos());
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
            <button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="group relative aspect-video overflow-hidden rounded-lg hover-elevate active-elevate-2 bg-muted"
              data-testid={`video-${video.id}`}
            >
              <img
                src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 bg-primary/90 group-hover:bg-primary rounded-full flex items-center justify-center transition-all">
                  <Play className="h-8 w-8 text-white ml-1" fill="white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="font-serif text-lg font-bold text-white">{video.title}</h3>
              </div>
            </button>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No videos available yet.</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
              data-testid="iframe-youtube"
            />
          </div>
        </div>
      )}
    </section>
  );
}
