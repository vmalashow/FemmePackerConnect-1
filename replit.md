# FemmePacker

## Overview

FemmePacker is a women-focused travel community platform that connects female travelers with trusted hosts worldwide. The platform combines social networking, location-based discovery, AI-powered travel assistance, and community features to create a safe, empowering space for women to explore the world. Built with a modern tech stack, it emphasizes trust, safety, and meaningful connections through verified profiles, interactive mapping, and community engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

## Future Integrations

**Spotify Integration (Deferred)**
- User requested Spotify connection for profile social proof
- Replit has connector:ccfg_spotify_01K49R1M6S088SR66BS9A0V4R7 available
- User dismissed integration setup - can be revisited later if needed
- Current implementation: Schema includes spotifyConnected and spotifyUserId fields for future use

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (replacing React Router)
- TanStack React Query for server state management, caching, and data synchronization

**UI Component System**
- shadcn/ui component library ("new-york" style variant) built on Radix UI primitives
- Tailwind CSS with custom design system following design_guidelines.md specifications
- Custom CSS variables for theme colors (purple primary, coral accents, neutral grays)
- Dark/light mode theming with ThemeProvider context and localStorage persistence
- Responsive mobile-first design with dedicated mobile components (BottomNav, MobileHeader)

**State Management Strategy**
- React Query for server state (profiles, posts, user data)
- React Context for global UI state (theme preferences)
- Local component state with useState for UI interactions
- Form state managed by React Hook Form with Zod validation

**Component Organization**
- Page components in `client/src/pages/` (Home, Explore, Community, AIAssistant, Profile)
- Reusable UI components in `client/src/components/` (UserCard, CommunityPost, FeatureCard)
- Design system components in `client/src/components/ui/` (shadcn/ui primitives)
- Custom hooks in `client/src/hooks/` (use-mobile, use-toast)
- Data files in `client/src/data/` (countries.ts with 100+ countries, languages.ts with 50+ languages and flag emojis)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the REST API server
- Development uses tsx for hot-reloading; production uses esbuild for bundling
- Middleware for JSON parsing with raw body capture (for webhook integrations)
- Request/response logging middleware for API debugging

**API Design**
- RESTful endpoints under `/api` prefix
- Profile management endpoints (GET, POST, PATCH) with mock user authentication
- Mock user ID ("demo-user-123") for development/demo purposes
- Zod schema validation using drizzle-zod for request payloads
- Centralized error handling with appropriate HTTP status codes

**Storage Layer Abstraction**
- IStorage interface defining storage operations (getUser, createProfile, updateProfile, etc.)
- MemStorage implementation for in-memory development storage
- Storage abstraction allows easy swapping to database-backed implementation
- Uses Map data structures for efficient in-memory lookups

### Data Storage

**Database Strategy**
- Drizzle ORM with PostgreSQL dialect configured for production
- Neon Serverless PostgreSQL adapter (@neondatabase/serverless with WebSocket support)
- Schema-first approach with TypeScript types inferred from Drizzle schemas
- Migration system configured to output to `./migrations` directory

**Schema Design**
- `users` table: authentication (id, username, password)
- `profiles` table: comprehensive user profiles with hosting preferences, travel style, interests, languages, availability windows, flags (red/green)
  - Location fields: country (current), bornIn, previousLocations (array)
  - Hosting fields: canHost, maxCapacity, maxDuration, preferredDays (array), customPreferredDays
  - Personal fields: name, bio, aboutMe
  - Travel fields: languages (array), interests (array), usualStayLength, travelStyle
  - Safety fields: greenFlags, redFlags
- UUID primary keys with auto-generation via `gen_random_uuid()`
- Array columns for multi-value fields (languages, interests, preferences, previousLocations, preferredDays)
- Boolean flags for hosting capability and availability flexibility

**Current Implementation Note**
- Currently using in-memory storage (MemStorage) for development
- Database schema defined and ready; connection configured but not actively used in routes
- Easy migration path from MemStorage to database by implementing IStorage with Drizzle queries

### Authentication & Authorization

**Current State**
- Mock authentication with hardcoded user ID for development/demo
- Session infrastructure prepared (connect-pg-simple for PostgreSQL session store)
- No password hashing or JWT implementation yet

**Future Architecture**
- Planned session-based authentication with PostgreSQL session storage
- User registration and login endpoints to be implemented
- Middleware for protecting authenticated routes
- Profile ownership verification before updates

### Design System

**Color Palette**
- Light mode: Purple (270° 65% 55%) primary, coral (15° 85% 65%) for CTAs, soft peach backgrounds
- Dark mode: Adjusted purple/coral with dark backgrounds (220° 20% 10%)
- Custom CSS variable system for semantic color tokens (--primary, --accent, --muted, etc.)

**Typography**
- Inter font family across all weights (400-800)
- Responsive text sizing with Tailwind utilities
- Design references: Airbnb (trust), Instagram (social), Bumble (safety), Linear (polish)

**Spacing & Layout**
- Consistent spacing scale using Tailwind units (2, 4, 6, 8, 12, 16, 20, 24)
- Container max-widths: 7xl for main content, 6xl for focused sections
- Section padding: py-16 to py-24 for breathing room
- Elevation system with hover/active states via custom utilities

### Development Workflow

**Build & Development**
- `npm run dev`: Development mode with tsx hot-reloading
- `npm run build`: Vite build + esbuild server bundle
- `npm run start`: Production server from dist
- `npm run db:push`: Push Drizzle schema changes to database

**Development Tools**
- Replit-specific plugins for runtime error overlay, cartographer, dev banner
- TypeScript strict mode for type safety
- Path aliases (@/, @shared/, @assets/) for cleaner imports

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Accessible component primitives (accordion, dialog, dropdown, popover, select, etc.)
- **shadcn/ui**: Pre-built component library with Tailwind styling
- **Lucide React**: Icon library for consistent iconography
- **cmdk**: Command palette component
- **vaul**: Drawer component for mobile interactions
- **react-day-picker**: Calendar/date picker component

### Data & State Management
- **TanStack React Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation for forms and API payloads
- **date-fns**: Date manipulation and formatting

### Database & ORM
- **Drizzle ORM**: Type-safe SQL query builder and schema management
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver with WebSocket support
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **tailwind-merge**: Utility for merging Tailwind class names
- **clsx**: Conditional class name utility

### Build Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Fast JavaScript bundler for server code
- **TypeScript**: Type safety across frontend and backend
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **tsx**: TypeScript execution for development

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Code navigation tool
- **@replit/vite-plugin-dev-banner**: Development environment banner

### Assets & Images
- Generated placeholder images stored in `attached_assets/generated_images/`
- Used for hero sections, community posts, and feature showcases
- Images follow women-focused travel themes (travelers exploring, hosting connections, solo travel)

## Features

### Profile System

**Autocomplete Components**
- Country, Born In, Languages, and Previous Locations fields use autocomplete with 2-letter minimum trigger
- Built with Radix Popover + Command components for accessible, searchable dropdowns
- Multi-select fields (Languages, Previous Locations) display selected items as removable badges
- Single-select fields (Country, Born In) display selected value in button text

**Language Display with Flags**
- Languages shown with flag emoji indicators (🇬🇧 English, 🇪🇸 Spanish, etc.)
- Flag emojis stored in languages.ts data file mapped to ISO language codes
- Read mode displays language badges with flag prefix for visual recognition
- Edit mode includes flags in autocomplete dropdown for easier selection

**Location Fields**
- Current Location (country): Single-select autocomplete with 100+ countries
- Born In: Single-select autocomplete for birth country
- Previous Locations: Multi-select autocomplete for places user has lived
- All location fields use consistent 2-letter search trigger pattern

**Personal Information**
- Bio: Brief profile summary (existing field)
- About Me: Extended personal description with example placeholder showing travel philosophy
- Helps structure hosting requests and provides context for connections

**Hosting Preferences**
- Can Host toggle enables hosting-specific fields
- Maximum Capacity: Number of guests (1-5+)
- Maximum Duration: Preferred stay length (Weekend, Week, 2 weeks, Month, Longer)
- Preferred Days: Multi-select for hosting availability (Weekdays, Weekends, Doesn't matter)
- Custom Preferred Days: Free-text field for specific availability notes (e.g., "First two weeks of month")
- All hosting fields conditionally shown only when Can Host is enabled

**Travel Preferences**
- Languages: Multi-select with flag emojis
- Interests: Multi-select badges for activities/hobbies
- Usual Stay Length: Dropdown for typical trip duration
- Travel Style: Dropdown for travel approach (Cultural Explorer, Adventure Seeker, etc.)

**Safety Features**
- Green Flags: Positive traits and preferences
- Red Flags: Boundaries and dislikes
- Helps set expectations and find compatible connections

### AI Assistant

**Interactive Quick Actions**
- Three primary quick actions: Find Destinations, Match with Hosts, Plan Itinerary
- Each action triggers an interactive questionnaire flow with 4-5 personalized questions
- Questions tailored to action type (travel preferences, hosting needs, itinerary planning)
- Progress indicator shows current question number during questionnaire

**Personalization System**
- Collects user preferences through conversational questions
- Generates personalized recommendations based on collected answers
- Connects recommendations to mock community members with shared interests
- References existing app users and community content in responses

**Questionnaire Types**
- **Find Destinations**: Asks about travel vibe, budget, must-haves, timeline, duration
- **Match with Hosts**: Asks about activities, hosting experience, communication style, deal-breakers, languages
- **Plan Itinerary**: Asks about trip duration, interests, pace, budget, specific experiences

**Response Generation**
- Creates detailed, personalized recommendations with emojis for visual appeal
- Mentions specific community members (e.g., "Sarah in Tokyo recommends...")
- Includes budget estimates, pro tips, and calls-to-action
- Uses profile data when available to enhance personalization
- Formats responses with markdown-style emphasis and structure