import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { 
  Home, 
  Images, 
  DollarSign, 
  SlidersHorizontal, 
  Video as VideoIcon, 
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Save,
  X
} from "lucide-react";
import { SimpleImageUpload } from "@/components/SimpleImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  STORAGE_KEYS, 
  getCarouselImages, 
  getGalleryImages, 
  getServices, 
  getVideos,
  saveCarouselImages,
  saveGalleryImages,
  saveServices,
  saveVideos
} from "@/lib/data";
import type { CarouselImage, GalleryImage, Service, Video } from "@shared/schema";



export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("carousel");
  const { toast } = useToast();

  // State for all data
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  // Check authentication
  useEffect(() => {
    const isAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (!isAuth) {
      setLocation("/admin");
    }
  }, [setLocation]);

  // Load all data
  useEffect(() => {
    setCarouselImages(getCarouselImages());
    setGalleryImages(getGalleryImages());
    setServices(getServices());
    setVideos(getVideos());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    setLocation("/admin");
  };

  const handleSaveCarousel = () => {
    saveCarouselImages(carouselImages);
    toast({
      title: "Carousel updated",
      description: "Carousel images have been saved successfully",
    });
  };

  const handleSaveGallery = () => {
    saveGalleryImages(galleryImages);
    toast({
      title: "Gallery updated",
      description: "Gallery images have been saved successfully",
    });
  };

  const handleSaveServices = () => {
    saveServices(services);
    toast({
      title: "Services updated",
      description: "Service prices have been updated successfully",
    });
  };

  const handleSaveVideos = () => {
    saveVideos(videos);
    toast({
      title: "Videos updated",
      description: "Videos have been saved successfully",
    });
  };

  const addCarouselImage = () => {
    const newImage: CarouselImage = {
      id: Date.now().toString(),
      url: "",
      title: "New Slide",
      subtitle: "",
    };
    setCarouselImages([...carouselImages, newImage]);
  };

  const updateCarouselImageByIndex = (index: number, field: keyof CarouselImage, value: string) => {
    console.log(`🎠 SIMPLE UPDATE: index=${index}, field="${field}", currentLength=${carouselImages.length}`);
    
    const newImages = carouselImages.map((img, i) => {
      if (i === index) {
        console.log(`✅ FOUND MATCH at index ${i}, updating ${field}`);
        return { ...img, [field]: value };
      }
      return img;
    });
    
    setCarouselImages(newImages);
  };

  const deleteCarouselImageByIndex = (index: number) => {
    console.log(`🗑️ SIMPLE DELETE: carousel index ${index}`);
    const newImages = carouselImages.filter((_, i) => i !== index);
    setCarouselImages(newImages);
  };

  const addGalleryImage = () => {
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      url: "",
      category: "all",
      title: "",
    };
    setGalleryImages([...galleryImages, newImage]);
  };

  // COMPLETELY NEW APPROACH: Update by ID instead of index
  const updateGalleryImageById = (imageId: string, field: keyof GalleryImage, value: string) => {
    console.log(`🆔 UPDATE BY ID: imageId="${imageId}", field="${field}", value="${value}"`);
    
    setGalleryImages(currentImages => {
      const updatedImages = currentImages.map(img => {
        if (img.id === imageId) {
          console.log(`✅ FOUND IMAGE BY ID: ${imageId}, updating ${field}`);
          return { ...img, [field]: value };
        }
        return img;
      });
      
      console.log(`🔄 Gallery updated for ID: ${imageId}`);
      return updatedImages;
    });
  };

  const updateService = (id: string, field: keyof Service, value: string | number) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const addVideo = () => {
    const newVideo: Video = {
      id: Date.now().toString(),
      youtubeId: "",
      title: "New Video",
      thumbnail: "",
    };
    setVideos([...videos, newVideo]);
  };

  const updateVideo = (id: string, field: keyof Video, value: string) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, [field]: value } : video
    ));
  };

  const deleteVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-2xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setLocation("/")} data-testid="button-view-site">
              <Home className="h-4 w-4 mr-2" />
              View Site
            </Button>
            <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="carousel" data-testid="tab-carousel">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Carousel
            </TabsTrigger>
            <TabsTrigger value="gallery" data-testid="tab-gallery">
              <Images className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="services" data-testid="tab-services">
              <DollarSign className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="videos" data-testid="tab-videos">
              <VideoIcon className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
          </TabsList>

          {/* Carousel Tab */}
          <TabsContent value="carousel" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold">Manage Carousel Images</h2>
                <p className="text-muted-foreground mt-1">Update homepage hero carousel slides</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={addCarouselImage} data-testid="button-add-carousel">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slide
                </Button>
                <Button onClick={handleSaveCarousel} data-testid="button-save-carousel">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {carouselImages.map((image, index) => (
                <Card key={image.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold bg-purple-500 text-white px-2 py-1 rounded">SLIDE #{index + 1}</span>
                      <span className="text-xs text-muted-foreground">ID: {image.id}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Carousel Image</Label>
                          <SimpleImageUpload
                            imageId={image.id}
                            currentUrl={image.url}
                            onUpdate={(imageId: string, url: string) => {
                              console.log(`🎠 DIRECT CAROUSEL: Updating ${imageId} with ${url}`);
                              updateCarouselImageByIndex(index, "url", url);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={image.title || ""}
                            onChange={(e) => {
                              console.log(`📝 DIRECT CAROUSEL TITLE: ${image.id} -> ${e.target.value}`);
                              updateCarouselImageByIndex(index, "title", e.target.value);
                            }}
                            placeholder="Slide title"
                            data-testid={`input-carousel-title-${index}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Subtitle</Label>
                          <Input
                            value={image.subtitle || ""}
                            onChange={(e) => {
                              console.log(`📄 DIRECT CAROUSEL SUBTITLE: ${image.id} -> ${e.target.value}`);
                              updateCarouselImageByIndex(index, "subtitle", e.target.value);
                            }}
                            placeholder="Slide subtitle"
                            data-testid={`input-carousel-subtitle-${index}`}
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            console.log(`🗑️ Delete carousel slide ${image.id}`);
                            deleteCarouselImageByIndex(index);
                          }}
                          data-testid={`button-delete-carousel-${index}`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        {image.url && (
                          <img
                            src={image.url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
                          <div className="space-y-2">
                            <Label>Subtitle</Label>
                            <Input
                              value={image.subtitle || ""}
                              onChange={(e) => updateSubtitle(e.target.value)}
                              placeholder="Slide subtitle"
                              data-testid={`input-carousel-subtitle-${index}`}
                            />
                        </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              console.log(`🗑️ Delete carousel button clicked for slide #${index + 1} (index: ${index})`);
                              deleteCarouselImageByIndex(index);
                            }}
                            data-testid={`button-delete-carousel-${index}`}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                      </div>
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        {image.url && (
                          <img
                            src={image.url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold">Manage Gallery Images</h2>
                <p className="text-muted-foreground mt-1">Add or update portfolio images</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={addGalleryImage} data-testid="button-add-gallery">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <Button onClick={handleSaveGallery} data-testid="button-save-gallery">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <Card key={image.id}>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold bg-green-500 text-white px-2 py-1 rounded">IMAGE #{index + 1}</span>
                      <span className="text-xs text-muted-foreground">ID: {image.id}</span>
                    </div>
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      {image.url && (
                        <img
                          src={image.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <SimpleImageUpload
                      imageId={image.id}
                      currentUrl={image.url}
                      onUpdate={(imageId: string, url: string) => {
                        console.log(`🎯 DIRECT CALL: Updating ${imageId} with ${url}`);
                        updateGalleryImageById(imageId, "url", url);
                      }}
                    />
                    <Input
                      value={image.title || ""}
                      onChange={(e) => updateGalleryImageById(image.id, "title", e.target.value)}
                      placeholder="Title"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => setGalleryImages(current => current.filter(img => img.id !== image.id))}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold">Manage Service Prices</h2>
                <p className="text-muted-foreground mt-1">Update pricing for your services</p>
              </div>
              <Button onClick={handleSaveServices} data-testid="button-save-services">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <div className="grid gap-6">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle className="font-serif">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Base Price (₹)</Label>
                        <Input
                          type="number"
                          value={service.basePrice}
                          onChange={(e) => updateService(service.id, "basePrice", Number(e.target.value))}
                          data-testid={`input-service-price-${service.id}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                          value={service.unit}
                          onChange={(e) => updateService(service.id, "unit", e.target.value)}
                          data-testid={`input-service-unit-${service.id}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold">Manage Videos</h2>
                <p className="text-muted-foreground mt-1">Update YouTube video links</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={addVideo} data-testid="button-add-video">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
                <Button onClick={handleSaveVideos} data-testid="button-save-videos">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id}>
                  <CardContent className="p-4 space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      {video.thumbnail ? (
                        <img src={video.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                      ) : video.youtubeId ? (
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                          alt="YouTube Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Input
                        value={video.title}
                        onChange={(e) => updateVideo(video.id, "title", e.target.value)}
                        placeholder="Video title"
                        data-testid={`input-video-title-${video.id}`}
                      />
                      <Input
                        value={video.youtubeId}
                        onChange={(e) => updateVideo(video.id, "youtubeId", e.target.value)}
                        placeholder="YouTube Video ID"
                        data-testid={`input-video-id-${video.id}`}
                      />
                      <Input
                        value={video.thumbnail || ""}
                        onChange={(e) => updateVideo(video.id, "thumbnail", e.target.value)}
                        placeholder="Custom thumbnail URL (optional)"
                        data-testid={`input-video-thumbnail-${video.id}`}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => deleteVideo(video.id)}
                        data-testid={`button-delete-video-${video.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
