# FemmePacker Design Guidelines

## Design Approach: Reference-Based
**Primary References**: Airbnb (trust & travel), Instagram (social engagement), Bumble (women-focused safety), Linear (modern polish)

**Core Principle**: Create a warm, empowering space that balances community vibrancy with safety and professionalism.

## Color Palette

### Light Mode
- **Primary Purple**: 270 65% 55% (empowerment, community)
- **Deep Purple**: 270 60% 35% (trust, headers)
- **Warm Coral**: 15 85% 65% (warmth, CTAs)
- **Soft Peach**: 25 75% 92% (backgrounds, cards)
- **Neutral Gray**: 220 10% 96% (sections)
- **Text**: 220 20% 20% (primary), 220 15% 45% (secondary)

### Dark Mode
- **Primary Purple**: 270 60% 65%
- **Deep Purple**: 270 55% 45%
- **Warm Coral**: 15 80% 70%
- **Dark Background**: 220 20% 10%
- **Card Background**: 220 18% 14%
- **Text**: 220 10% 92% (primary), 220 8% 70% (secondary)

## Typography
- **Headings**: Inter (700-800 weight) - modern, trustworthy
- **Body**: Inter (400-500 weight)
- **Sizes**: Hero (text-5xl to text-7xl), Section Headers (text-3xl to text-4xl), Body (text-base to text-lg)

## Layout System
**Spacing Units**: Use Tailwind units 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- **Container**: max-w-7xl for main content, max-w-6xl for focused sections
- **Section Padding**: py-16 md:py-24 for breathing room
- **Card Spacing**: p-6 to p-8 with gap-6 between elements

## Core Components

### Navigation
**Sticky header** with logo left, main nav center (Home, Explore, Community, AI Assistant), profile/notifications right. Use backdrop blur (backdrop-blur-lg bg-white/80 dark:bg-gray-900/80) for modern glassmorphism effect.

### Hero Section
**Full-width split layout**: Left side with headline, subheading, dual CTAs ("Start Your Journey" primary, "How It Works" outline). Right side features large image of diverse women travelers (genuine, candid photography). Height: min-h-[600px] lg:min-h-[700px].

### Interactive Map
**Prominent placement** on Explore page. Use Mapbox GL JS or Leaflet with custom markers:
- **Host markers**: Purple pin icons with verified badges
- **Traveler markers**: Coral circle indicators
- **Clustering**: Group nearby locations
- **Filter sidebar**: Left side with checkboxes (hosting available, interests, dates)
- **User cards**: Pop up on marker click with photo, name, bio preview, "Connect" button

### Community Feed
**Card-based layout** (grid-cols-1 md:grid-cols-2 lg:grid-cols-3):
- Each post card includes user avatar, name, timestamp, travel tip/question, optional image, reaction counts, comment preview
- **Interactions**: Heart/helpful icons, comment count with icon
- **"New Post" button**: Fixed bottom-right on mobile, top-right on desktop (warm coral)

### AI Travel Assistant
**Chat interface** with split view:
- **Left**: Conversation history in chat bubbles (user messages align right in purple, AI responses left in gray)
- **Right**: Dynamic content panel showing itineraries, destination cards, or matched users
- **Input**: Bottom sticky with mic icon, text input, send button
- **Suggestions**: Quick chips above input ("Plan my week in Paris", "Find eco-friendly hosts")

### User Profiles
**Three-column layout** on desktop:
- **Left sidebar**: Profile photo (large, rounded), verification badges, host/traveler status, languages, "Connect" button
- **Center**: About, travel style, interests (tag pills), recent trips (photo grid)
- **Right**: Reviews, safety score, response time, calendar availability

### Trust & Safety Elements
- **Verification badges**: Small icons with tooltip (ID verified, phone verified, reviewed)
- **Safety score**: Visual indicator (1-5 shields icon system)
- **User reviews**: Star rating + written testimonials with reviewer photos
- **Report/block**: Subtle but accessible (three-dot menu)

## Multi-Column Strategy
- **Feature showcases**: 3-column grid on desktop (safety features, how it works)
- **User directory**: 2-4 columns of profile cards with filters
- **Testimonials**: 3-column layout with photos
- **Mobile**: Always stack to single column

## Images
- **Hero**: Authentic photo of women travelers laughing/exploring (avoid stock-looking images)
- **Feature sections**: Use illustrations or photos showing app interface
- **Profile cards**: User-uploaded photos (circular avatars, square for galleries)
- **Community posts**: Mixed user content (landscapes, food, cultural moments)
- **Trust section**: Include founder photo or team to humanize platform

## Interactive Elements
- **Hover states**: Subtle scale (scale-105) on cards, brightness increase on images
- **Transitions**: transition-all duration-200 for smooth interactions
- **Loading states**: Skeleton screens for feed/profiles, spinner for AI responses
- **Empty states**: Friendly illustrations with encouraging copy

## Animations
**Minimal and purposeful**:
- Fade-in on scroll for section reveals
- Smooth map marker animations
- Chat bubble slide-in for AI responses
- NO distracting parallax or excessive motion

## Accessibility
- **Focus states**: Visible purple ring on all interactive elements
- **Color contrast**: Minimum 4.5:1 for all text
- **Alt text**: Descriptive for all images
- **Dark mode**: Fully supported across all components with consistent contrast ratios

## Mobile Optimization
- **Bottom navigation**: Sticky nav with icons for Home, Explore, Community, AI, Profile
- **Swipeable cards**: For user browsing
- **Collapsible filters**: Drawer from bottom for map/directory filters
- **Touch targets**: Minimum 44x44px for all interactive elements

This design creates a trustworthy, modern platform that empowers women travelers while maintaining safety and community at its core.