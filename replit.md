# FemmePacker

## Overview

FemmePacker is a women-focused travel community platform that connects female travelers with trusted hosts worldwide. It provides a safe and empowering space for women to explore the world by combining social networking, location-based discovery, AI-powered travel assistance, and community features. The platform emphasizes trust, safety, and meaningful connections through verified profiles, interactive mapping, and community engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:** React 18 with TypeScript, Vite for bundling, Wouter for routing, and TanStack React Query for server state management.

**UI Component System:** `shadcn/ui` based on Radix UI primitives, styled with Tailwind CSS following custom design guidelines. Features dark/light mode theming and responsive mobile-first design.

**State Management:** React Query for server state, React Context for global UI state (e.g., theme), and React Hook Form with Zod for form state and validation.

**Component Organization:** Pages in `client/src/pages/`, reusable UI components in `client/src/components/`, and design system components in `client/src/components/ui/`.

### Backend Architecture

**Server Framework:** Express.js with TypeScript, using `tsx` for development and `esbuild` for production. Includes middleware for JSON parsing and logging.

**API Design:** RESTful endpoints under `/api` with Zod schema validation for request payloads and centralized error handling.

**Storage Layer Abstraction:** `IStorage` interface with a `MemStorage` in-memory implementation for development, designed for easy swapping to a database.

### Data Storage

**Database Strategy:** Drizzle ORM with PostgreSQL dialect, utilizing Neon Serverless PostgreSQL adapter. Schema-first approach with TypeScript types and a migration system.

**Schema Design:** Key tables include `users` for authentication and `profiles` for comprehensive user data, including hosting preferences, travel style, interests, languages, availability, and safety flags. Uses UUID primary keys and array columns for multi-value fields.

**Current Implementation:** In-memory storage (`MemStorage`) is used for development, with the database schema defined and configured for future integration.

### Authentication & Authorization

**Current State:** Mock authentication with a hardcoded user ID for development. Session infrastructure is prepared.

**Future Architecture:** Planned session-based authentication with PostgreSQL session storage, user registration/login, and middleware for route protection.

### Design System

**Color Palette:** Custom CSS variable system with purple primary and coral accents for light mode, adjusted for dark mode.

**Typography:** Inter font family with responsive sizing.

**Spacing & Layout:** Consistent spacing scale using Tailwind units, defined container max-widths, and section padding.

### Development Workflow

**Build & Development:** `npm run dev` for development, `npm run build` for production, and `npm run start` to run the production server.

**Development Tools:** Replit-specific plugins (runtime error overlay, cartographer, dev banner), TypeScript strict mode, and path aliases.

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Accessible component primitives.
- **shadcn/ui**: Pre-built component library.
- **Lucide React**: Icon library.
- **cmdk**: Command palette.
- **vaul**: Drawer component.
- **react-day-picker**: Calendar/date picker.

### Data & State Management
- **TanStack React Query**: Server state management.
- **React Hook Form**: Form state and validation.
- **Zod**: Schema validation.
- **date-fns**: Date manipulation.

### Database & ORM
- **Drizzle ORM**: Type-safe SQL query builder.
- **@neondatabase/serverless**: Neon PostgreSQL driver.
- **connect-pg-simple**: PostgreSQL session store.

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework.
- **class-variance-authority**: Component variants.
- **tailwind-merge**: Merging Tailwind classes.
- **clsx**: Conditional class names.

### Build Tools
- **Vite**: Frontend build tool.
- **esbuild**: Server code bundler.
- **TypeScript**: Type safety.
- **PostCSS**: CSS processing.
- **tsx**: TypeScript execution.

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Error overlay.
- **@replit/vite-plugin-cartographer**: Code navigation.
- **@replit/vite-plugin-dev-banner**: Development banner.