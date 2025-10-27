import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { 
  Home, 
  Images, 
  DollarSign, 
  SlidersHorizontal, 
  Video as VideoIcon, 
  Calculator,
  FileText,
  Mail,
  LogOut,
  Plus,
  Trash2,
  Save,
  RefreshCw
} from "lucide-react";
import { SimpleImageUpload } from "@/components/SimpleImageUpload";
import { EmailSetup } from "@/components/EmailSetup";
import { updateGlobalCacheBuster } from "@/lib/cacheManager";
import { directSyncManager } from "@/lib/directSync";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  getCarouselImages, 
  getGalleryImages, 
  getBudgetPlannerEntries,
  updateCarouselImage,
  updateGalleryImage,
  saveGalleryImage,
  saveCarouselImage,
  saveBudgetEntry
} from "@/lib/supabaseData";
import { getServices, getVideos, STORAGE_KEYS, saveServices, saveVideos, saveBudgetPlannerEntries } from "@/lib/data";
import type { CarouselImage, GalleryImage, Service, Video, BudgetPlannerEntry } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("carousel");
  const { toast } = useToast();

  // State for all data
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [budgetEntries, setBudgetEntries] = useState<BudgetPlannerEntry[]>([]);

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('binal_admin_auth') === 'authenticated';
    if (!isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [carousel, gallery, budgetData] = await Promise.all([
          getCarouselImages(),
          getGalleryImages(),
          getBudgetPlannerEntries()
        ]);
        
        setCarouselImages(carousel);
        setGalleryImages(gallery);
        setBudgetEntries(budgetData);
        
        // Load services and videos (these are still sync)
        setServices(getServices());
        const loadedVideos = getVideos();
        setVideos(loadedVideos);
        
        console.log('AdminDashboard: Loaded all data successfully');
        console.log('🎬 Loaded videos:', loadedVideos);
        console.log('🎬 Videos count:', loadedVideos.length);
        console.log('🖼️ Gallery Images Details:', gallery.map(img => ({
          id: img.id,
          hasUrl: !!img.url,
          urlType: img.url ? (img.url.startsWith('data:') ? 'base64' : 'external') : 'none',
          urlLength: img.url ? img.url.length : 0,
          title: img.title
        })));
      } catch (error) {
        console.error('AdminDashboard: Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      console.log('AdminDashboard: Storage change detected:', e.detail);
      if (e.detail.key === STORAGE_KEYS.BUDGET_ENTRIES) {
        console.log('AdminDashboard: Updating budget entries with:', e.detail.value);
        setBudgetEntries(e.detail.value);
      }
    };

    window.addEventListener('localStorage-update', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('localStorage-update', handleStorageChange as EventListener);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('binal_admin_auth');
    setLocation('/admin/login');
  };

  // Carousel functions
  const updateCarouselImageByIndex = (index: number, field: keyof CarouselImage, value: string) => {
    setCarouselImages(current => current.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    ));
  };

  const deleteCarouselImageByIndex = (index: number) => {
    setCarouselImages(current => current.filter((_, i) => i !== index));
  };

  const addCarouselImage = () => {
    const newImage: CarouselImage = {
      id: Date.now().toString(),
      url: "",
      title: "",
      subtitle: "",
    };
    setCarouselImages([...carouselImages, newImage]);
  };

  // Gallery functions
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

  const addGalleryImage = () => {
    const newImage: GalleryImage = {
      id: `g${Date.now()}`,
      url: "",
      category: "all",
      primaryCategory: "none",
      secondaryCategory: "all",
      title: "",
    };
    setGalleryImages([...galleryImages, newImage]);
  };

  // Service functions
  const addService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      name: "",
      description: "",
      basePrice: 0,
      unit: "session",
      icon: "camera",
    };
    setServices([...services, newService]);
  };

  const updateService = (id: string, field: keyof Service, value: string | number) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const deleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  // Video functions
  const addVideo = () => {
    const newVideo: Video = {
      id: `video-${Date.now()}`,
      youtubeId: "",
      title: "",
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

  // Budget Planner functions
  const updateBudgetEntryStatus = (id: string, status: BudgetPlannerEntry['status']) => {
    setBudgetEntries(entries =>
      entries.map(entry =>
        entry.id === id
          ? { ...entry, status, updatedAt: new Date().toISOString() }
          : entry
      )
    );
  };

  const deleteBudgetEntry = (id: string) => {
    setBudgetEntries(entries => entries.filter(entry => entry.id !== id));
  };

  // Save functions
  const handleSaveCarousel = async () => {
    try {
      // Save all carousel images to Supabase database (create or update)
      for (const image of carouselImages) {
        await saveCarouselImage(image);
      }
      console.log('✅ All carousel images saved to database');
      toast({ title: "Carousel images saved to database!" });
    } catch (error) {
      console.error('Error saving carousel:', error);
      toast({ title: "Error saving carousel", description: "Please try again", variant: "destructive" });
    }
  };

  const handleSaveGallery = async () => {
    try {
      // Save all gallery images to Supabase database
      for (const image of galleryImages) {
        await saveGalleryImage(image);
      }
      console.log('✅ All gallery images saved to database');
      toast({ title: "Gallery images saved to database!" });
    } catch (error) {
      console.error('Error saving gallery:', error);
      toast({ title: "Error saving gallery", description: "Please try again", variant: "destructive" });
    }
  };

  const handleFixImageUrls = async () => {
    try {
      console.log('🔧 Fixing broken image URLs...');
      
      // Sample working image URLs from Unsplash
      const carouselUpdates = [
        { id: 'c1', url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop&crop=center' },
        { id: 'c2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop&crop=center' },
        { id: 'c3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=center' },
        { id: 'c4', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop&crop=center' },
        { id: 'c5', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop&crop=center' }
      ];
      
      const galleryUpdates = [
        { id: 'g1', url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=400&fit=crop&crop=center' },
        { id: 'g2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&crop=center' },
        { id: 'g3', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=600&h=400&fit=crop&crop=center' },
        { id: 'g4', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop&crop=center' },
        { id: 'g5', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop&crop=center' },
        { id: 'g6', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center' },
        { id: 'g7', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=400&fit=crop&crop=center' },
        { id: 'g8', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop&crop=center' },
        { id: 'g9', url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&h=400&fit=crop&crop=center' },
        { id: 'g10', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop&crop=center' },
        { id: 'g11', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop&crop=center' },
        { id: 'g12', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop&crop=center' }
      ];
      
      // Update carousel images
      for (const update of carouselUpdates) {
        await updateCarouselImage(update.id, { url: update.url });
        console.log(`✅ Updated carousel ${update.id}`);
      }
      
      // Update gallery images
      for (const update of galleryUpdates) {
        await updateGalleryImage(update.id, { url: update.url });
        console.log(`✅ Updated gallery ${update.id}`);
      }
      
      // Reload data to reflect changes
      await loadData();
      
      toast({ 
        title: "Image URLs Fixed!", 
        description: "All images now use working placeholder URLs. Refresh to see changes." 
      });
      
    } catch (error) {
      console.error('Error fixing image URLs:', error);
      toast({ 
        title: "Error fixing images", 
        description: "Please try again", 
        variant: "destructive" 
      });
    }
  };

  const handleSaveServices = () => {
    saveServices(services);
    toast({ title: "Services saved successfully!" });
  };

  const handleSaveVideos = () => {
    console.log('🎬 Saving videos:', videos);
    console.log('🎬 Videos count:', videos.length);
    videos.forEach((video, index) => {
      console.log(`🎬 Video ${index + 1}:`, {
        id: video.id,
        title: video.title,
        youtubeId: video.youtubeId,
        hasYoutubeId: !!video.youtubeId
      });
    });
    saveVideos(videos);
    toast({ title: "Videos saved successfully!" });
  };

  const handleSaveBudgetEntries = () => {
    saveBudgetPlannerEntries(budgetEntries);
    toast({ title: "Budget entries saved successfully!" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your portfolio content</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  updateGlobalCacheBuster();
                  
                  // Generate direct sync URL with image parameters
                  const syncUrl = directSyncManager.getSyncUrl();
                  
                  navigator.clipboard?.writeText(syncUrl).then(() => {
                    toast({
                      title: "Sync URL Copied!",
                      description: "Share this URL to instantly sync all images on other browsers/devices!",
                    });
                  }).catch(() => {
                    toast({
                      title: "Images Refreshed!",
                      description: "Direct sync updated for cross-browser access.",
                    });
                  });
                }}
                data-testid="button-refresh-images"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Copy Sync URL
              </Button>
              <Button variant="outline" onClick={handleFixImageUrls} data-testid="button-fix-images">
                <RefreshCw className="h-4 w-4 mr-2" />
                Fix Image URLs
              </Button>
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
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7 mb-8">
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
            <TabsTrigger value="budget" data-testid="tab-budget">
              <Calculator className="h-4 w-4 mr-2" />
              Budget Planner
            </TabsTrigger>
            <TabsTrigger value="requests" data-testid="tab-requests">
              <FileText className="h-4 w-4 mr-2" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="email" data-testid="tab-email">
              <Mail className="h-4 w-4 mr-2" />
              Email Setup
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
                            disableCompression={true}
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
                            onChange={(e) => updateCarouselImageByIndex(index, "title", e.target.value)}
                            placeholder="Slide title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Subtitle</Label>
                          <Input
                            value={image.subtitle || ""}
                            onChange={(e) => updateCarouselImageByIndex(index, "subtitle", e.target.value)}
                            placeholder="Slide subtitle"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCarouselImageByIndex(index)}
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
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                      {image.url && image.url.trim() !== '' ? (
                        <>
                          <img
                            src={image.url}
                            alt="Gallery Preview"
                            className="w-full h-full object-cover"
                            onLoad={() => console.log(`✅ Image loaded successfully: ${image.id}`)}
                            onError={(e) => {
                              console.error(`❌ Image failed to load: ${image.id}`);
                              console.error(`❌ Failed URL: ${image.url?.substring(0, 100)}...`);
                            }}
                          />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-100">
                          <div className="text-center">
                            <p className="text-sm font-medium">No Image</p>
                            <p className="text-xs">Upload an image below</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Debug Info - temporary */}
                    <div className="text-xs bg-yellow-100 p-2 rounded border">
                      <p><strong>ID:</strong> {image.id}</p>
                      <p><strong>Title:</strong> {image.title || 'No title'}</p>
                      <p><strong>URL Status:</strong> {image.url ? 'Present' : 'Missing'}</p>
                      {image.url && (
                        <>
                          <p><strong>URL Type:</strong> {image.url.startsWith('data:') ? 'Base64 Data URL' : 'External URL'}</p>
                          <p><strong>URL Length:</strong> {image.url.length} chars</p>
                          <p><strong>URL Start:</strong> {image.url.substring(0, 60)}...</p>
                        </>
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
                    
                    {/* Primary Category Selection */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Primary Category (can be blank)</Label>
                      <Select
                        value={image.primaryCategory || "none"}
                        onValueChange={(value) => updateGalleryImageById(image.id, "primaryCategory", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-- None (Blank) --</SelectItem>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="wedding">Weddings</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="portraits">Portraits</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Secondary Category Selection */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Secondary Category</Label>
                      <Select
                        value={image.secondaryCategory || ""}
                        onValueChange={(value) => updateGalleryImageById(image.id, "secondaryCategory", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select secondary category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="wedding">Weddings</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="portraits">Portraits</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
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

          {/* Services Tab - Frontend Display Services */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold">Services Display</h2>
                <p className="text-muted-foreground mt-1">Manage services shown on the Services section (for display only)</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={addService} data-testid="button-add-service">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
                <Button onClick={handleSaveServices} data-testid="button-save-services">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> These services appear on the Services section of your website for information. 
                  To manage services for the Budget Calculator, use the <strong>Budget Planner</strong> tab.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold bg-blue-500 text-white px-2 py-1 rounded">DISPLAY SERVICE</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteService(service.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Service Name</Label>
                        <Input
                          value={service.name}
                          onChange={(e) => updateService(service.id, "name", e.target.value)}
                          placeholder="e.g., Wedding Photography"
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={service.description}
                          onChange={(e) => updateService(service.id, "description", e.target.value)}
                          placeholder="Service description"
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Price (₹)</Label>
                          <Input
                            type="number"
                            value={service.basePrice}
                            onChange={(e) => updateService(service.id, "basePrice", Number(e.target.value))}
                            placeholder="0"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Unit</Label>
                          <Select
                            value={service.unit}
                            onValueChange={(value) => updateService(service.id, "unit", value)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="session">Per Session</SelectItem>
                              <SelectItem value="hour">Per Hour</SelectItem>
                              <SelectItem value="day">Per Day</SelectItem>
                              <SelectItem value="event">Per Event</SelectItem>
                              <SelectItem value="package">Package</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs">Icon</Label>
                        <Select
                          value={service.icon}
                          onValueChange={(value) => updateService(service.id, "icon", value)}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="camera">Camera</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="heart">Heart</SelectItem>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="star">Star</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Preview */}
                      <div className="p-3 bg-muted rounded border-t">
                        <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                        <p className="font-semibold text-sm">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                        <p className="text-sm font-bold text-primary">
                          ₹{(service.basePrice || 0).toLocaleString()} <span className="text-xs">/{service.unit || 'unit'}</span>
                        </p>
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
                <p className="text-muted-foreground mt-1">Add YouTube videos to showcase</p>
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
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded">VIDEO</span>
                      <span className="text-xs text-muted-foreground">ID: {video.id}</span>
                    </div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      {video.youtubeId && (
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtubeId}`}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>YouTube Video ID</Label>
                      <Input
                        value={video.youtubeId}
                        onChange={(e) => updateVideo(video.id, "youtubeId", e.target.value)}
                        placeholder="e.g., 9No-FiEInLA (from youtube.com/watch?v=ID)"
                      />
                      <p className="text-xs text-muted-foreground">
                        Copy the ID from a YouTube URL: youtube.com/watch?v=<strong>VIDEO_ID</strong>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={video.title}
                        onChange={(e) => updateVideo(video.id, "title", e.target.value)}
                        placeholder="Video title"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => deleteVideo(video.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Budget Planner Tab - Service Management */}
          <TabsContent value="budget" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold">Budget Planner Services</h2>
                <p className="text-muted-foreground mt-1">Manage services available in the budget calculator</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={addService} data-testid="button-add-service">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
                <Button onClick={handleSaveServices} data-testid="button-save-services">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold bg-green-500 text-white px-2 py-1 rounded">BUDGET SERVICE</span>
                      <span className="text-xs text-muted-foreground">ID: {service.id}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Service Name</Label>
                          <Input
                            value={service.name}
                            onChange={(e) => updateService(service.id, "name", e.target.value)}
                            placeholder="e.g., Wedding Photography"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={service.description}
                            onChange={(e) => updateService(service.id, "description", e.target.value)}
                            placeholder="Service description"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Base Price (₹)</Label>
                          <Input
                            type="number"
                            value={service.basePrice}
                            onChange={(e) => updateService(service.id, "basePrice", Number(e.target.value))}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unit</Label>
                          <Select
                            value={service.unit}
                            onValueChange={(value) => updateService(service.id, "unit", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="session">Per Session</SelectItem>
                              <SelectItem value="hour">Per Hour</SelectItem>
                              <SelectItem value="day">Per Day</SelectItem>
                              <SelectItem value="event">Per Event</SelectItem>
                              <SelectItem value="package">Package</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select
                            value={service.icon}
                            onValueChange={(value) => updateService(service.id, "icon", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="camera">Camera</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="heart">Heart</SelectItem>
                              <SelectItem value="users">Users</SelectItem>
                              <SelectItem value="star">Star</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">Preview</h4>
                          <div className="text-sm">
                            <p className="font-semibold">{service.name}</p>
                            <p className="text-muted-foreground">{service.description}</p>
                            <p className="text-lg font-bold text-primary mt-2">
                              ₹{(service.basePrice || 0).toLocaleString()} <span className="text-sm font-normal">/{service.unit || 'unit'}</span>
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => deleteService(service.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Service
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Requests Tab - Budget Requests */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold">Customer Requests</h2>
                <p className="text-muted-foreground mt-1">Manage budget requests from customers</p>
              </div>
              <Button onClick={handleSaveBudgetEntries} data-testid="button-save-budget">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <div className="grid gap-6">
              {budgetEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold bg-orange-500 text-white px-2 py-1 rounded">BUDGET REQUEST</span>
                        <Select
                          value={entry.status}
                          onValueChange={(value) => updateBudgetEntryStatus(entry.id, value as BudgetPlannerEntry['status'])}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="quoted">Quoted</SelectItem>
                            <SelectItem value="booked">Booked</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteBudgetEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Customer Information</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Name:</strong> {entry.name}</p>
                          <p><strong>Email:</strong> {entry.email}</p>
                          {entry.phone && <p><strong>Phone:</strong> {entry.phone}</p>}
                          {entry.eventDate && <p><strong>Event Date:</strong> {entry.eventDate}</p>}
                          <p><strong>Submitted:</strong> {new Date(entry.submittedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Services & Total</h4>
                        <div className="space-y-1 text-sm">
                          {Array.isArray(entry.services) ? entry.services.map((service, idx) => (
                            <p key={idx}>
                              {typeof service === 'string' ? service : 
                               `${service.serviceName || 'Service'} x${service.quantity || 1} - ₹${(service.totalPrice || 0).toLocaleString()}`}
                            </p>
                          )) : (
                            <p>No services selected</p>
                          )}
                          <p className="font-bold text-lg mt-2">Total: ₹{(entry.totalAmount || 0).toLocaleString()}</p>
                        </div>
                        
                        {entry.additionalNotes && (
                          <div className="mt-3">
                            <h5 className="font-medium">Notes:</h5>
                            <p className="text-sm text-muted-foreground">{entry.additionalNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {budgetEntries.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No budget requests yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Email Setup Tab */}
          <TabsContent value="email" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold">Email Notifications Setup</h2>
                <p className="text-muted-foreground mt-1">Configure email notifications for contact forms and budget requests</p>
              </div>
            </div>

            <EmailSetup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}