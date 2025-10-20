import { z } from "zod";

// Gallery Image Schema
export const galleryImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  category: z.enum(["wedding", "events", "portraits", "commercial", "all"]),
  title: z.string().optional(),
  description: z.string().optional(),
});

export type GalleryImage = z.infer<typeof galleryImageSchema>;

// Carousel Image Schema
export const carouselImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
});

export type CarouselImage = z.infer<typeof carouselImageSchema>;

// Service Schema
export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  basePrice: z.number(),
  unit: z.string(),
  icon: z.string(),
});

export type Service = z.infer<typeof serviceSchema>;

// Team Member Schema
export const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  photo: z.string(),
  bio: z.string().optional(),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;

// Video Schema
export const videoSchema = z.object({
  id: z.string(),
  youtubeId: z.string(),
  title: z.string(),
  thumbnail: z.string().optional(),
});

export type Video = z.infer<typeof videoSchema>;

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactForm = z.infer<typeof contactFormSchema>;

// Budget Calculator Schema
export const budgetCalculatorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  services: z.array(z.object({
    serviceId: z.string(),
    quantity: z.number().min(1),
  })).min(1, "Please select at least one service"),
  eventDate: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type BudgetCalculator = z.infer<typeof budgetCalculatorSchema>;

// Admin Auth Schema
export const adminAuthSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type AdminAuth = z.infer<typeof adminAuthSchema>;
