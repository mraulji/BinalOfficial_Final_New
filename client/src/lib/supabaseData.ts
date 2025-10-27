import type { GalleryImage, CarouselImage, Service, TeamMember, Video, BudgetPlannerEntry } from "@shared/schema";
import { carouselAPI, galleryAPI, budgetAPI, subscribeToChanges, type CarouselItem } from "./supabase";

// Import stock images for fallback
import carousel1 from "@assets/stock_images/elegant_wedding_phot_05974a70.jpg";
import carousel2 from "@assets/stock_images/elegant_wedding_phot_8033b843.jpg";
import carousel3 from "@assets/stock_images/elegant_wedding_phot_e91b357a.jpg";
import carousel4 from "@assets/stock_images/elegant_wedding_phot_3de44adb.jpg";
import carousel5 from "@assets/stock_images/elegant_wedding_phot_3f411a48.jpg";

import portrait1 from "@assets/stock_images/professional_portrai_1d85d32c.jpg";
import portrait2 from "@assets/stock_images/professional_portrai_3fa2857e.jpg";
import portrait3 from "@assets/stock_images/professional_portrai_ccaa3530.jpg";
import portrait4 from "@assets/stock_images/professional_portrai_0548cfb5.jpg";

import event1 from "@assets/stock_images/corporate_event_phot_dde28f36.jpg";
import event2 from "@assets/stock_images/corporate_event_phot_6ff478b6.jpg";
import event3 from "@assets/stock_images/corporate_event_phot_833549ab.jpg";

import ownerPhoto from "@assets/stock_images/professional_photogr_11293deb.jpg";

// Fallback data (used when Supabase is not configured)
const fallbackCarouselImages: CarouselImage[] = [
  {
    id: "1",
    url: carousel1,
    title: "Capturing Life's Beautiful Moments",
    subtitle: "Professional Photography & Videography Services",
  },
  {
    id: "2",
    url: carousel2,
    title: "Your Story, Beautifully Told",
    subtitle: "Wedding, Events, Portraits & More",
  },
  {
    id: "3",
    url: carousel3,
    title: "Excellence in Every Frame",
    subtitle: "Premium Photography Services Since 2015",
  },
  {
    id: "4",
    url: carousel4,
    title: "Creating Timeless Memories",
    subtitle: "From Weddings to Corporate Events",
  },
  {
    id: "5",
    url: carousel5,
    title: "Professional Quality, Personal Touch",
    subtitle: "Your Trusted Photography Partner",
  },
];

const fallbackGalleryImages: GalleryImage[] = [
  { 
    id: "g1", 
    url: carousel1, 
    title: "Elegant Wedding Ceremony", 
    category: "wedding",
    primaryCategory: "wedding"
  },
  { 
    id: "g2", 
    url: carousel2, 
    title: "Bridal Portrait Session", 
    category: "wedding",
    primaryCategory: "wedding"
  },
  { 
    id: "g3", 
    url: carousel3, 
    title: "Wedding Reception Moments", 
    category: "wedding",
    primaryCategory: "wedding"
  },
  { 
    id: "g4", 
    url: carousel4, 
    title: "Wedding Day Details", 
    category: "wedding",
    primaryCategory: "wedding"
  },
  { 
    id: "g5", 
    url: carousel5, 
    title: "Romantic Wedding Photography", 
    category: "wedding",
    primaryCategory: "wedding"
  },
  { 
    id: "g6", 
    url: portrait1, 
    title: "Professional Business Portrait", 
    category: "portraits",
    primaryCategory: "portraits"
  },
  { 
    id: "g7", 
    url: portrait2, 
    title: "Executive Headshot", 
    category: "portraits",
    primaryCategory: "portraits"
  },
  { 
    id: "g8", 
    url: portrait3, 
    title: "Studio Portrait Session", 
    category: "portraits",
    primaryCategory: "portraits"
  },
  { 
    id: "g9", 
    url: portrait4, 
    title: "Professional Lifestyle Portrait", 
    category: "portraits",
    primaryCategory: "portraits"
  },
  { 
    id: "g10", 
    url: event1, 
    title: "Corporate Conference", 
    category: "events",
    primaryCategory: "events"
  },
  { 
    id: "g11", 
    url: event2, 
    title: "Business Event Photography", 
    category: "events",
    primaryCategory: "events"
  },
  { 
    id: "g12", 
    url: event3, 
    title: "Corporate Networking Event", 
    category: "events",
    primaryCategory: "events"
  },
];

// Check if Supabase is configured (either via env vars or fallback values)
const isSupabaseConfigured = () => {
  // Since we have fallback values in supabase.ts, always return true
  // The supabase.ts file has the hardcoded credentials as fallback
  return true;
};

// 🎠 CAROUSEL DATA FUNCTIONS
export const getCarouselImages = async (): Promise<CarouselImage[]> => {
  if (!isSupabaseConfigured()) {
    console.log('📝 Using fallback carousel data (Supabase not configured)');
    return fallbackCarouselImages;
  }

  try {
    console.log('🔄 Fetching carousel from Supabase...');
    const supabaseData = await carouselAPI.getAll();
    
    // Convert Supabase data to CarouselImage format with URL parsing
    const carouselImages: CarouselImage[] = supabaseData.map(item => {
      let cleanUrl = item.url;
      
      // Handle cases where URL might be stored as JSON object
      if (typeof item.url === 'string') {
        try {
          const parsed = JSON.parse(item.url);
          if (parsed && typeof parsed === 'object' && parsed.url) {
            cleanUrl = parsed.url;
            console.log(`🔧 Extracted URL from JSON for carousel item ${item.id}`);
          }
        } catch {
          // Not JSON, use as-is
          cleanUrl = item.url;
        }
      }
      
      return {
        id: item.id,
        url: cleanUrl,
        title: item.title || '',
        subtitle: item.subtitle || ''
      };
    });

    console.log(`✅ Loaded ${carouselImages.length} carousel images from database`);
    return carouselImages;
    
  } catch (error) {
    console.error('❌ Error loading carousel from Supabase:', error);
    console.log('📝 Falling back to default images');
    return fallbackCarouselImages;
  }
};

// Update carousel image
export const updateCarouselImage = async (id: string, updates: Partial<CarouselItem>): Promise<void> => {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, cannot update carousel');
    return;
  }

  try {
    console.log(`🔄 Updating carousel item ${id}...`, updates);
    await carouselAPI.updateCarouselItem(id, updates);
    console.log('✅ Carousel item updated successfully');
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'binal_carousel_images',
      newValue: JSON.stringify(await getCarouselImages())
    }));
    
  } catch (error) {
    console.error('❌ Error updating carousel item:', error);
    throw error;
  }
};

// Save complete carousel image (create or update)
export const saveCarouselImage = async (image: CarouselImage): Promise<void> => {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, cannot save carousel image');
    return;
  }

  try {
    console.log(`🔄 Saving complete carousel image ${image.id}...`);
    
    // Convert CarouselImage to CarouselItem for database
    // Ensure URL is a string, not an object
    const cleanUrl = typeof image.url === 'string' ? image.url : String(image.url);
    
    const carouselItem = {
      id: image.id,
      url: cleanUrl,
      title: image.title || '',
      subtitle: image.subtitle || '',
      position: 0 // Default position, you might want to calculate this
    };
    
    try {
      // Try to update first
      await carouselAPI.updateCarouselItem(image.id, carouselItem);
    } catch (updateError) {
      // If update fails, try to create new item
      console.log(`📝 Item ${image.id} doesn't exist, creating new...`);
      await carouselAPI.createItem(carouselItem);
    }
    
    console.log('✅ Complete carousel image saved successfully');
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'binal_carousel_images',
      newValue: JSON.stringify(await getCarouselImages())
    }));
    
  } catch (error) {
    console.error('❌ Error saving carousel image:', error);
    throw error;
  }
};

// 🖼️ GALLERY DATA FUNCTIONS
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  if (!isSupabaseConfigured()) {
    console.log('📝 Using fallback gallery data (Supabase not configured)');
    return fallbackGalleryImages;
  }

  try {
    console.log('🔄 Fetching gallery from Supabase...');
    const supabaseData = await galleryAPI.getAll();
    
    // Convert Supabase data to GalleryImage format
    const galleryImages: GalleryImage[] = supabaseData.map(item => {
      // Fix corrupted URL data - if url is a JSON object, extract the actual URL
      let cleanUrl = item.url;
      if (typeof item.url === 'string' && item.url.startsWith('{')) {
        try {
          const parsed = JSON.parse(item.url);
          cleanUrl = parsed.url || item.url;
        } catch (e) {
          console.warn('Failed to parse URL JSON for item', item.id);
        }
      }
      
      return {
        id: item.id,
        url: cleanUrl,
        title: item.title || 'Gallery Image',
        category: (item.category as any) || 'wedding', // Default category
        primaryCategory: (item.category as any) || 'wedding', // Use category as primaryCategory
        secondaryCategory: undefined,
        description: item.description || undefined
      };
    });

    console.log(`✅ Loaded ${galleryImages.length} gallery images from database`);
    return galleryImages;
    
  } catch (error) {
    console.error('❌ Error loading gallery from Supabase:', error);
    console.log('📝 Falling back to default images');
    return fallbackGalleryImages;
  }
};

// Update gallery image URL only
export const updateGalleryImage = async (id: string, url: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, cannot update gallery');
    return;
  }

  try {
    console.log(`🔄 Updating gallery image ${id}...`);
    await galleryAPI.updateItem(id, url);
    console.log('✅ Gallery image updated successfully');
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'binal_gallery_images',
      newValue: JSON.stringify(await getGalleryImages())
    }));
    
  } catch (error) {
    console.error('❌ Error updating gallery image:', error);
    throw error;
  }
};

// Update complete gallery image
export const saveGalleryImage = async (image: GalleryImage): Promise<void> => {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, cannot save gallery image');
    return;
  }

  try {
    console.log(`🔄 Saving complete gallery image ${image.id}...`);
    
    // Convert GalleryImage to GalleryItem for database
    // Ensure URL is a string, not an object
    const cleanUrl = typeof image.url === 'string' ? image.url : String(image.url);
    
    // Only use fields that exist in the actual database schema
    const galleryItem = {
      id: image.id,
      url: cleanUrl,
      title: image.title,
      category: image.primaryCategory || image.category || 'wedding', // Use primaryCategory as main category
      description: image.description
    };
    
    try {
      // Try to update first
      await galleryAPI.updateFullItem(image.id, galleryItem);
    } catch (updateError) {
      // If update fails, try to create new item
      console.log(`📝 Item ${image.id} doesn't exist, creating new...`);
      await galleryAPI.createItem(galleryItem);
    }
    
    console.log('✅ Complete gallery image saved successfully');
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'binal_gallery_images',
      newValue: JSON.stringify(await getGalleryImages())
    }));
    
  } catch (error) {
    console.error('❌ Error saving complete gallery image:', error);
    throw error;
  }
};

// 💰 BUDGET PLANNER FUNCTIONS
export const getBudgetPlannerEntries = async (): Promise<BudgetPlannerEntry[]> => {
  // Always check localStorage first since the budget calculator saves there
  console.log('📝 Checking localStorage for budget entries...');
  try {
    const stored = localStorage.getItem("binal_budget_entries");
    if (stored) {
      const localEntries = JSON.parse(stored);
      if (localEntries && localEntries.length > 0) {
        console.log(`✅ Found ${localEntries.length} budget entries in localStorage`);
        return localEntries;
      }
    }
  } catch (error) {
    console.error('❌ Error reading from localStorage:', error);
  }

  // Fallback to Supabase if localStorage is empty
  if (!isSupabaseConfigured()) {
    console.log('📝 No localStorage entries and Supabase not configured');
    return [getDefaultBudgetEntry()];
  }

  try {
    console.log('🔄 Fetching budget entries from Supabase...');
    const supabaseData = await budgetAPI.getAll();
    
    // Convert Supabase data to BudgetPlannerEntry format
    const budgetEntries: BudgetPlannerEntry[] = supabaseData.map(item => ({
      id: item.id,
      name: item.customer_name || item.name || 'Unknown',
      email: item.email,
      phone: item.phone || '',
      eventDate: item.event_date || '',
      services: Array.isArray(item.services) ? item.services : [],
      totalAmount: Number(item.total_amount || 0),
      additionalNotes: item.additional_notes || '',
      status: item.status || 'pending',
      submittedAt: item.created_at || new Date().toISOString()
    }));

    console.log(`✅ Loaded ${budgetEntries.length} budget entries from database`);
    return budgetEntries.length > 0 ? budgetEntries : [getDefaultBudgetEntry()];
    
  } catch (error) {
    console.error('❌ Error loading budget entries from Supabase:', error);
    console.log('📝 Falling back to default entry');
    try {
      return [getDefaultBudgetEntry()];
    }
  }
};

// Save budget entry to both localStorage and Supabase
export const saveBudgetEntry = async (entry: BudgetPlannerEntry): Promise<void> => {
  // Always save to localStorage first (for immediate access)
  console.log('📝 Saving budget entry to localStorage...');
  try {
    const entries = await getBudgetPlannerEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    let updatedEntries;
    
    if (existingIndex >= 0) {
      // Update existing entry
      updatedEntries = entries.map(e => e.id === entry.id ? entry : e);
    } else {
      // Add new entry
      updatedEntries = [...entries.filter(e => e.id !== "default"), entry];
    }
    
    localStorage.setItem("binal_budget_entries", JSON.stringify(updatedEntries));
    console.log('✅ Budget entry saved to localStorage');
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('localStorage-update', {
      detail: { key: 'binal_budget_entries', value: updatedEntries }
    }));
    
  } catch (error) {
    console.error('❌ Error saving to localStorage:', error);
  }

  // Also try to save to Supabase (non-blocking)
  if (isSupabaseConfigured()) {
    try {
      console.log('🔄 Saving budget entry to Supabase...');
      await budgetAPI.createEntry({
        id: entry.id,
        customer_name: entry.name,
        email: entry.email,
        phone: entry.phone,
        event_date: entry.eventDate,
        services: entry.services,
        total_amount: entry.totalAmount,
        additional_notes: entry.additionalNotes,
        status: entry.status || 'pending'
      });
      console.log('✅ Budget entry also saved to Supabase');
      
    } catch (error) {
      console.error('❌ Error saving to Supabase (non-blocking):', error);
      // Don't throw error, localStorage save was successful
    }
  }
};

// Default budget entry
const getDefaultBudgetEntry = (): BudgetPlannerEntry => ({
  id: "default",
  name: "Sample Customer",
  email: "customer@example.com",
  phone: "+1 234 567 8900",
  eventDate: "2024-12-25",
  services: [
    {
      serviceId: "s1",
      serviceName: "Wedding Photography",
      quantity: 1,
      unitPrice: 50000,
      totalPrice: 50000
    },
    {
      serviceId: "s2", 
      serviceName: "Event Videography",
      quantity: 1,
      unitPrice: 25000,
      totalPrice: 25000
    }
  ],
  totalAmount: 75000,
  additionalNotes: "This is a sample budget entry. Create new entries through the admin dashboard.",
  status: "pending",
  submittedAt: new Date().toISOString()
});

// 🔔 REAL-TIME SUBSCRIPTIONS
export const setupRealTimeUpdates = () => {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Real-time updates not available (Supabase not configured)');
    return;
  }

  console.log('🔄 Setting up real-time subscriptions...');

  // Subscribe to carousel changes
  subscribeToChanges.carousel((payload) => {
    console.log('🔄 Carousel changed:', payload);
    // Refresh carousel data
    getCarouselImages().then(images => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'binal_carousel_images',
        newValue: JSON.stringify(images)
      }));
    });
  });

  // Subscribe to gallery changes  
  subscribeToChanges.gallery((payload) => {
    console.log('🔄 Gallery changed:', payload);
    // Refresh gallery data
    getGalleryImages().then(images => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'binal_gallery_images',
        newValue: JSON.stringify(images)
      }));
    });
  });

  console.log('✅ Real-time subscriptions active');
};

// Static data (unchanged)
export const services: Service[] = [
  {
    id: "wedding",
    title: "Wedding Photography",
    description: "Capture your special day with our professional wedding photography services. From intimate ceremonies to grand celebrations, we document every precious moment.",
    price: "Starting at $1,500",
    features: ["Pre-wedding consultation", "8-hour coverage", "500+ edited photos", "Online gallery", "Print release"],
  },
  {
    id: "events",
    title: "Event Photography",
    description: "Professional event coverage for corporate functions, parties, and special occasions. We ensure every important moment is beautifully captured.",
    price: "Starting at $800",
    features: ["Event planning consultation", "4-6 hour coverage", "300+ edited photos", "Same-day highlights", "Digital delivery"],
  },
  {
    id: "portraits",
    title: "Portrait Sessions",
    description: "Individual, family, and professional headshot sessions. We create stunning portraits that capture personality and style.",
    price: "Starting at $300",
    features: ["1-hour session", "Multiple outfit changes", "50+ edited photos", "Personal consultation", "Print options"],
  },
  {
    id: "videography",
    title: "Videography Services",
    description: "Cinematic video production for weddings, events, and promotional content. We tell your story through beautiful moving images.",
    price: "Starting at $1,200",
    features: ["Professional filming", "Drone footage", "Same-day editing", "4K quality", "Custom music"],
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "binal-owner",
    name: "Binal Shah",
    role: "Lead Photographer & Founder",
    image: ownerPhoto,
    bio: "With over 8 years of experience in photography, Binal brings creativity and professionalism to every shoot. Specializing in weddings and events, he has captured thousands of precious moments.",
  },
];

export const videos: Video[] = [
  {
    id: "wedding-highlight",
    title: "Wedding Highlight Reel",
    thumbnail: carousel1,
    url: "https://example.com/wedding-video",
    description: "A beautiful wedding highlight showcasing our cinematic style",
  },
  {
    id: "event-coverage",
    title: "Corporate Event Coverage",
    thumbnail: event1,
    url: "https://example.com/event-video",
    description: "Professional event videography for corporate functions",
  },
];

// Initialize real-time updates on app start
if (typeof window !== 'undefined') {
  setupRealTimeUpdates();
}