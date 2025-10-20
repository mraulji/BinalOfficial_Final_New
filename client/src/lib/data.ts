import type { GalleryImage, CarouselImage, Service, TeamMember, Video } from "@shared/schema";

// Import stock images
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

// Default Carousel Images
export const defaultCarouselImages: CarouselImage[] = [
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

// Default Gallery Images
export const defaultGalleryImages: GalleryImage[] = [
  { id: "g1", url: carousel1, category: "wedding", title: "Elegant Wedding Ceremony" },
  { id: "g2", url: carousel2, category: "wedding", title: "Romantic Moments" },
  { id: "g3", url: carousel3, category: "wedding", title: "Perfect Day" },
  { id: "g4", url: carousel4, category: "wedding", title: "Wedding Bliss" },
  { id: "g5", url: carousel5, category: "wedding", title: "Love Stories" },
  { id: "g6", url: portrait1, category: "portraits", title: "Professional Portrait" },
  { id: "g7", url: portrait2, category: "portraits", title: "Studio Session" },
  { id: "g8", url: portrait3, category: "portraits", title: "Character Study" },
  { id: "g9", url: portrait4, category: "portraits", title: "Headshot Excellence" },
  { id: "g10", url: event1, category: "events", title: "Corporate Event" },
  { id: "g11", url: event2, category: "events", title: "Conference Coverage" },
  { id: "g12", url: event3, category: "events", title: "Business Gathering" },
];

// Default Services
export const defaultServices: Service[] = [
  {
    id: "s1",
    name: "Photography",
    description: "High-quality professional photography for all occasions. Includes 300 edited photos delivered digitally.",
    basePrice: 50000,
    unit: "per event",
    icon: "Camera",
  },
  {
    id: "s2",
    name: "Videography",
    description: "Cinematic video coverage with professional editing and color grading. Full HD or 4K options available.",
    basePrice: 75000,
    unit: "per event",
    icon: "Video",
  },
  {
    id: "s3",
    name: "Drone Services",
    description: "Aerial photography and videography for stunning bird's-eye perspectives of your special moments.",
    basePrice: 25000,
    unit: "per session",
    icon: "Plane",
  },
  {
    id: "s4",
    name: "Photo Framing",
    description: "Premium quality photo printing and custom framing services. Choose from various frame styles and sizes.",
    basePrice: 5000,
    unit: "per frame",
    icon: "Frame",
  },
  {
    id: "s5",
    name: "Photo Albums",
    description: "Luxury wedding and event albums with premium binding and archival-quality printing.",
    basePrice: 15000,
    unit: "per album",
    icon: "Book",
  },
  {
    id: "s6",
    name: "Pre-Wedding Shoot",
    description: "Romantic outdoor or studio pre-wedding photography session. Includes outfit changes and multiple locations.",
    basePrice: 35000,
    unit: "per session",
    icon: "Heart",
  },
];

// Default Team Members
export const defaultTeamMembers: TeamMember[] = [
  {
    id: "t1",
    name: "Rajesh Binal",
    role: "Founder & Lead Photographer",
    photo: ownerPhoto,
    bio: "With over 15 years of experience, Rajesh brings artistic vision and technical excellence to every shoot.",
  },
  {
    id: "t2",
    name: "Priya Sharma",
    role: "Senior Photographer",
    photo: portrait1,
    bio: "Specializing in wedding and portrait photography with a keen eye for candid moments.",
  },
  {
    id: "t3",
    name: "Amit Kumar",
    role: "Videographer & Editor",
    photo: portrait2,
    bio: "Expert in cinematic storytelling and post-production magic.",
  },
  {
    id: "t4",
    name: "Neha Patel",
    role: "Drone Specialist",
    photo: portrait3,
    bio: "Certified drone pilot creating breathtaking aerial perspectives.",
  },
];

// Default Videos
export const defaultVideos: Video[] = [
  {
    id: "v1",
    youtubeId: "dQw4w9WgXcQ",
    title: "Wedding Highlights - Riya & Arjun",
    thumbnail: carousel1,
  },
  {
    id: "v2",
    youtubeId: "dQw4w9WgXcQ",
    title: "Corporate Event Coverage",
    thumbnail: event1,
  },
  {
    id: "v3",
    youtubeId: "dQw4w9WgXcQ",
    title: "Pre-Wedding Story",
    thumbnail: carousel3,
  },
];

// Local Storage Keys
export const STORAGE_KEYS = {
  CAROUSEL: "binal_carousel_images",
  GALLERY: "binal_gallery_images",
  SERVICES: "binal_services",
  TEAM: "binal_team_members",
  VIDEOS: "binal_videos",
  AUTH: "binal_admin_auth",
};

// Admin Credentials
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "binal2024",
};

// Helper functions to get data from localStorage with fallback
export const getCarouselImages = (): CarouselImage[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.CAROUSEL);
  return stored ? JSON.parse(stored) : defaultCarouselImages;
};

export const getGalleryImages = (): GalleryImage[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.GALLERY);
  return stored ? JSON.parse(stored) : defaultGalleryImages;
};

export const getServices = (): Service[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return stored ? JSON.parse(stored) : defaultServices;
};

export const getTeamMembers = (): TeamMember[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.TEAM);
  return stored ? JSON.parse(stored) : defaultTeamMembers;
};

export const getVideos = (): Video[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.VIDEOS);
  return stored ? JSON.parse(stored) : defaultVideos;
};

// Helper functions to save data to localStorage
export const saveCarouselImages = (images: CarouselImage[]) => {
  localStorage.setItem(STORAGE_KEYS.CAROUSEL, JSON.stringify(images));
};

export const saveGalleryImages = (images: GalleryImage[]) => {
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(images));
};

export const saveServices = (services: Service[]) => {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

export const saveTeamMembers = (members: TeamMember[]) => {
  localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(members));
};

export const saveVideos = (videos: Video[]) => {
  localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
};
