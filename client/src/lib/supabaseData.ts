import type { GalleryImage, CarouselImage, Service, TeamMember, Video, BudgetPlannerEntry } from "@shared/schema";
import { carouselAPI, galleryAPI, budgetAPI, subscribeToChanges } from "./supabase";

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
  { id: "g1", url: carousel1, title: "Wedding Photography", primary: true },
  { id: "g2", url: carousel2, title: "Wedding Photography" },
  { id: "g3", url: carousel3, title: "Wedding Photography" },
  { id: "g4", url: carousel4, title: "Wedding Photography" },
  { id: "g5", url: carousel5, title: "Wedding Photography" },
  { id: "g6", url: portrait1, title: "Professional Portrait", primary: true },
  { id: "g7", url: portrait2, title: "Professional Portrait" },
  { id: "g8", url: portrait3, title: "Professional Portrait" },
  { id: "g9", url: portrait4, title: "Professional Portrait" },
  { id: "g10", url: event1, title: "Corporate Event", primary: true },
  { id: "g11", url: event2, title: "Corporate Event" },
  { id: "g12", url: event3, title: "Corporate Event" },
];

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && url !== 'YOUR_SUPABASE_URL_HERE' && key !== 'YOUR_SUPABASE_ANON_KEY_HERE';
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
    
    // Convert Supabase data to CarouselImage format
    const carouselImages: CarouselImage[] = supabaseData.map(item => ({
      id: item.id,
      url: item.url,
      title: item.title,
      subtitle: item.subtitle
    }));

    console.log(`✅ Loaded ${carouselImages.length} carousel images from database`);
    return carouselImages;
    
  } catch (error) {
    console.error('❌ Error loading carousel from Supabase:', error);
    console.log('📝 Falling back to default images');
    return fallbackCarouselImages;
  }
};

// Update carousel image
export const updateCarouselImage = async (id: string, url: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, cannot update carousel');
    return;
  }

  try {
    console.log(`🔄 Updating carousel image ${id}...`);
    await carouselAPI.updateItem(id, url);
    console.log('✅ Carousel image updated successfully');
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'binal_carousel_images',
      newValue: JSON.stringify(await getCarouselImages())
    }));
    
  } catch (error) {
    console.error('❌ Error updating carousel image:', error);
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
    const galleryImages: GalleryImage[] = supabaseData.map(item => ({
      id: item.id,
      url: item.url,
      title: item.title || 'Gallery Image',
      primary: item.is_primary || false
    }));

    console.log(`✅ Loaded ${galleryImages.length} gallery images from database`);
    return galleryImages;
    
  } catch (error) {
    console.error('❌ Error loading gallery from Supabase:', error);
    console.log('📝 Falling back to default images');
    return fallbackGalleryImages;
  }
};

// Update gallery image
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

// 💰 BUDGET PLANNER FUNCTIONS
export const getBudgetPlannerEntries = async (): Promise<BudgetPlannerEntry[]> => {
  if (!isSupabaseConfigured()) {
    console.log('📝 Using localStorage for budget entries (Supabase not configured)');
    try {
      const stored = localStorage.getItem("binal_budget_entries");
      return stored ? JSON.parse(stored) : [getDefaultBudgetEntry()];
    } catch {
      return [getDefaultBudgetEntry()];
    }
  }

  try {
    console.log('🔄 Fetching budget entries from Supabase...');
    const supabaseData = await budgetAPI.getAll();
    
    // Convert Supabase data to BudgetPlannerEntry format
    const budgetEntries: BudgetPlannerEntry[] = supabaseData.map(item => ({
      id: item.id,
      customerName: item.customer_name,
      email: item.email,
      phone: item.phone || '',
      eventDate: item.event_date || '',
      services: item.services,
      totalAmount: Number(item.total_amount),
      additionalNotes: item.additional_notes || ''
    }));

    console.log(`✅ Loaded ${budgetEntries.length} budget entries from database`);
    return budgetEntries.length > 0 ? budgetEntries : [getDefaultBudgetEntry()];
    
  } catch (error) {
    console.error('❌ Error loading budget entries from Supabase:', error);
    console.log('📝 Falling back to localStorage');
    try {
      const stored = localStorage.getItem("binal_budget_entries");
      return stored ? JSON.parse(stored) : [getDefaultBudgetEntry()];
    } catch {
      return [getDefaultBudgetEntry()];
    }
  }
};

// Save budget entry
export const saveBudgetEntry = async (entry: BudgetPlannerEntry): Promise<void> => {
  if (!isSupabaseConfigured()) {
    console.log('📝 Saving budget entry to localStorage (Supabase not configured)');
    const entries = await getBudgetPlannerEntries();
    const updated = entries.map(e => e.id === entry.id ? entry : e);
    localStorage.setItem("binal_budget_entries", JSON.stringify(updated));
    return;
  }

  try {
    console.log('🔄 Saving budget entry to Supabase...');
    await budgetAPI.createEntry({
      customer_name: entry.customerName,
      email: entry.email,
      phone: entry.phone,
      event_date: entry.eventDate,
      services: entry.services,
      total_amount: entry.totalAmount,
      additional_notes: entry.additionalNotes
    });
    console.log('✅ Budget entry saved successfully');
    
  } catch (error) {
    console.error('❌ Error saving budget entry:', error);
    throw error;
  }
};

// Default budget entry
const getDefaultBudgetEntry = (): BudgetPlannerEntry => ({
  id: "default",
  customerName: "Sample Customer",
  email: "customer@example.com",
  phone: "+1 234 567 8900",
  eventDate: "2024-12-25",
  services: ["Wedding Photography", "Event Videography"],
  totalAmount: 2500,
  additionalNotes: "This is a sample budget entry. Create new entries through the admin dashboard."
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