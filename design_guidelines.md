# Binal Studio Photography - Design Guidelines

## Design Approach
**Reference-Based Approach** inspired by premium photography portfolio sites (Behance, Unsplash, Adobe Portfolio) with creative adaptations for Binal Studio's unique brand personality. This design emphasizes visual storytelling, immersive imagery, and professional elegance.

## Color Palette

### Brand Colors
- **Primary Blue**: 195 70% 56% (#2596be) - Main brand identity, CTAs, links, navigation highlights
- **Deep Purple**: 266 48% 28% (#40256e) - Secondary accents, hover states, section backgrounds
- **Vibrant Magenta**: 304 54% 36% (#8d2a86) - Strategic highlights, interactive elements, category tags

### Supporting Palette
- **Dark Mode Base**: 220 15% 8% - Primary background
- **Surface Dark**: 220 12% 12% - Cards, elevated surfaces
- **Text Primary**: 0 0% 98% - Main content
- **Text Secondary**: 220 10% 70% - Supporting text
- **Borders**: 220 10% 20% - Subtle dividers

### Light Mode (Admin Panel)
- **Background**: 220 15% 98%
- **Surface**: 0 0% 100%
- **Text Primary**: 220 15% 12%
- **Text Secondary**: 220 10% 40%

## Typography

### Font Families
- **Display/Headings**: 'Playfair Display' - Elegant serif for brand name, hero headlines, section titles
- **Body/UI**: 'Inter' - Clean sans-serif for body text, navigation, forms
- **Accent**: 'Montserrat' - Service names, team roles, category labels

### Scale
- **Hero Headline**: text-6xl/text-7xl (60px/72px) - bold, Playfair Display
- **Section Titles**: text-4xl/text-5xl (36px/48px) - semibold
- **Subsection**: text-2xl/text-3xl (24px/30px) - medium
- **Body**: text-base/text-lg (16px/18px) - normal
- **Small**: text-sm (14px) - secondary info, captions

## Layout System

### Spacing Primitives
Use Tailwind spacing units: **2, 4, 6, 8, 12, 16, 20, 24, 32** (p-4, m-8, gap-6, etc.)

### Section Rhythm
- **Desktop**: py-20 to py-32 for major sections
- **Mobile**: py-12 to py-16
- **Component Spacing**: mb-6 to mb-12 between elements

### Container Strategy
- **Full-width sections**: w-full with max-w-7xl centered
- **Content sections**: max-w-6xl
- **Text-heavy**: max-w-4xl for optimal reading

## Component Library

### Navigation
- **Fixed navbar** with blur backdrop (backdrop-blur-md bg-opacity-90)
- Logo left, navigation center/right, CTA button (primary blue)
- Smooth scroll behavior with active state indicators
- Mobile: Hamburger menu with slide-in drawer

### Hero Carousel
- **Full viewport height** (min-h-screen) with multiple slides
- Auto-rotation every 5 seconds with manual controls
- Overlay gradient (from transparent to dark) for text readability
- Large headline + tagline + dual CTAs (primary + outline)
- Navigation dots at bottom center

### Image Cards & Gallery
- **Masonry grid layout** for gallery (2 cols mobile, 3-4 cols desktop)
- Hover effect: scale(1.05) with overlay showing category/title
- Category filter pills (rounded-full badges) with active state in primary blue
- Lightbox modal for full-size viewing with navigation arrows

### Service Cards
- **Grid layout**: 2-3 columns on desktop, stacked mobile
- Cards with subtle border, hover lift effect (shadow-lg)
- Icon top, service name, description, pricing display
- Pricing badge in top-right corner using accent magenta

### Team Section
- **3-4 column grid** with circular/rounded profile photos
- Photo with gradient border (using brand colors)
- Name in bold, role in accent color below
- Subtle card hover animation

### Budget Calculator
- **Two-column layout** (desktop): Service selection left, cost summary right (sticky)
- Checkboxes with custom styling (brand colors)
- Real-time total calculation with smooth number transitions
- Submit button prominent in primary blue

### Forms
- **Floating labels** with subtle animations
- Input fields: dark surface background with border-b-2 accent on focus
- Textarea for messages with min-height
- Button with loading state during email send

### Footer
- **Three-column layout**: About/Quick Links/Contact
- Social media icons with hover color transitions
- Newsletter signup inline form
- Copyright and credentials at bottom

## Images

### Required Images
1. **Hero Carousel** (4-5 images): Stunning photography showcasing best work - weddings, events, portraits in dramatic lighting
2. **Introduction Section**: Professional headshot of owner/lead photographer in studio or on-location
3. **Team Section** (3-5 members): Individual portraits with consistent style/background
4. **Service Icons/Thumbnails**: Representative images for each service category
5. **Gallery** (20-30 images minimum): Diverse portfolio categorized by wedding, events, portraits, commercial
6. **Video Thumbnails**: Custom thumbnails from YouTube videos

### Image Treatment
- **Aspect ratios**: 16:9 for hero/video, 4:3 for gallery, 1:1 for team
- Subtle vignette/gradient overlays on hero images
- Lazy loading for gallery performance
- Responsive images with srcset

## Interactions & Animations

### Subtle Motion (Use Sparingly)
- **Scroll reveals**: Fade-up on section entry (intersection observer)
- **Hover states**: Scale transforms (scale-105), color transitions
- **Carousel**: Smooth slide transitions (transform)
- **Gallery filter**: Fade transition when switching categories
- **NO** excessive parallax, spinning elements, or distracting effects

### Microinteractions
- Button hover: slight lift + brightness increase
- Input focus: border color transition to primary blue
- Image gallery: smooth zoom on hover
- Navigation: smooth scroll with easing

## Admin Panel Design

### Authentication
- **Centered login card** on gradient background
- Username/password fields with eye toggle
- Remember me checkbox
- Clean, minimal design in light mode

### Dashboard Layout
- **Sidebar navigation** (left): Gallery, Services, Carousel, Videos, Settings
- Active state with primary blue background
- Main content area with cards for each management section
- Upload areas with drag-drop zones (dashed borders)
- Inline editing with save/cancel actions
- Toast notifications for success/error states

### Admin-Specific Components
- **Image upload**: Drag-drop zone with preview thumbnails
- **Price editor**: Inline number inputs with increment/decrement
- **JSON preview**: Code block with syntax highlighting
- **Delete confirmations**: Modal dialogs with warning colors

## Responsive Breakpoints
- **Mobile**: < 768px (single column, stacked layouts)
- **Tablet**: 768px - 1024px (2-column grids)
- **Desktop**: > 1024px (3-4 column grids, full layouts)

## Test Credentials
Display prominently on admin login: **Username: admin | Password: binal2024**

---

**Design Philosophy**: Create an immersive, visually-driven experience that lets photography speak first while maintaining professional functionality. Balance artistic presentation with intuitive navigation and seamless user interactions.