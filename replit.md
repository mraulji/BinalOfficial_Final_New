# Binal Studio Photography - Portfolio Website

## Project Overview
A modern, frontend-only photography portfolio website for Binal Studio Photography. The site showcases professional photography services, team, portfolio gallery, and includes an admin panel for content management.

## Features Implemented

### Public Website
1. **Hero Carousel** - Auto-rotating image carousel with 5 slides, smooth transitions, navigation controls
2. **Introduction Section** - About the studio with owner bio and key statistics
3. **Team Section** - Display of 4 team members with photos, roles, and bios
4. **Services Section** - 6 professional photography services with pricing
5. **Budget Calculator** - Interactive service selection with real-time price calculation and email quote request
6. **Gallery** - Filterable portfolio (All, Wedding, Events, Portraits, Commercial) with lightbox view
7. **Video Section** - YouTube video showcase with custom thumbnails
8. **Contact Section** - Contact form, business info, and embedded Google Maps
9. **Footer** - Quick links, services, contact info, social media links

### Admin Panel (/admin)
1. **Authentication** - Simple login with credentials
2. **Carousel Management** - Add, edit, delete carousel slides with image URLs and text
3. **Gallery Management** - Upload images, set categories, add titles
4. **Service Pricing** - Update prices and descriptions for all services
5. **Video Management** - Add/edit YouTube video IDs and custom thumbnails

## Tech Stack
- **Frontend**: React 18, TypeScript, Wouter (routing)
- **Styling**: Tailwind CSS, Shadcn UI components
- **Forms**: React Hook Form with Zod validation
- **Email**: EmailJS (for contact forms and budget calculator)
- **Storage**: localStorage for admin changes
- **Data**: JSON configuration files

## Color Scheme
- **Primary Blue**: #2596be (195 70% 56%) - Main brand color, CTAs, links
- **Deep Purple**: #40256e (266 48% 28%) - Secondary accents, backgrounds
- **Vibrant Magenta**: #8d2a86 (304 54% 36%) - Highlights, category tags

## Admin Credentials
- **Username**: `admin`
- **Password**: `binal2024`

## Data Management
All content is stored in localStorage and JSON config files:
- Carousel images: `client/src/lib/data.ts` (defaultCarouselImages)
- Gallery images: localStorage + defaults
- Services: localStorage + defaults
- Team members: Static in data.ts
- Videos: localStorage + defaults

Changes made in admin panel persist via localStorage and take effect immediately on the public site.

## File Structure
```
client/src/
├── components/
│   ├── Navbar.tsx              # Fixed navigation with smooth scroll
│   ├── HeroCarousel.tsx        # Auto-rotating hero carousel
│   ├── Introduction.tsx        # About section with owner info
│   ├── TeamSection.tsx         # Team member grid
│   ├── ServicesSection.tsx     # Service cards with pricing
│   ├── BudgetCalculator.tsx    # Interactive quote calculator
│   ├── Gallery.tsx             # Filterable image gallery with lightbox
│   ├── VideoSection.tsx        # YouTube video showcase
│   ├── ContactSection.tsx      # Contact form and map
│   └── Footer.tsx              # Site footer
├── pages/
│   ├── Home.tsx                # Main public website
│   ├── AdminLogin.tsx          # Admin authentication
│   └── AdminDashboard.tsx      # Content management panel
├── lib/
│   └── data.ts                 # Data configuration and helpers
└── App.tsx                     # Main app with routing

shared/
└── schema.ts                   # TypeScript schemas and types
```

## Development
1. All data is managed through localStorage
2. Default data in `client/src/lib/data.ts` provides fallback content
3. Admin panel updates take effect immediately
4. No backend API - fully frontend implementation

## EmailJS Setup (for production)
The budget calculator and contact forms use EmailJS. To enable:
1. Create account at emailjs.com
2. Create email service and templates
3. Update EmailJS integration with service ID, template ID, and public key
4. Forms currently log to console - integration pending

## Recent Changes
- Initial project setup with all core features
- Implemented responsive design across all breakpoints
- Added admin panel with full CRUD functionality
- Integrated localStorage for data persistence
- Created comprehensive component library

## Next Steps (Future Enhancements)
- Complete EmailJS integration for contact forms
- Add image upload functionality (currently uses URLs)
- Implement testimonials section
- Add loading animations and transitions
- Set up analytics tracking
