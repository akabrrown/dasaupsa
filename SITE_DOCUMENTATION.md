# DASA Portal — Technical Documentation & Architecture Analysis

## 1. Executive Summary
The Department of Accounting Student Association (DASA) platform is a high-performance web portal designed for the University of Professional Studies, Accra (UPSA). It serves as a central hub for academic resources, departmental news, and professional growth opportunities. Built with a mobile-first philosophy, the site ensures a seamless experience for students and simplified management for administrators.

## 2. Technology Stack
The platform leverages a modern, stable, and highly scalable stack:

- **Frontend Framework**: [Next.js 15.1.9](https://nextjs.org/) (Stable build with security patches)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/) for type safety and robust development.
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) for a premium, responsive design system.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid UI transitions and the Gallery lightbox.
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + GoTrue Authentication).
- **Media Management**: [Cloudinary](https://cloudinary.com/) for optimized delivery of images and academic PDFs.
- **Icons**: [Lucide React](https://lucide.dev/icons/) for consistent iconography.

## 3. Architecture Analysis

### Routing Strategy (Flattened Pathing)
The site uses the **Next.js App Router**. To ensure maximum reliability on Vercel's edge network, the routing structure is "flattened," meaning all public-facing pages reside directly in the `app/` directory. This eliminates mapping conflicts associated with route groups and ensures instantaneous page transitions.

### Data Flow
1. **Server Components (RSC)**: All main pages (`home`, `gallery`, `tutorials`, etc.) utilize React Server Components to fetch data directly from Supabase via `lib/actions/data.ts`. This reduces client-side JavaScript and improves SEO.
2. **Client Actions**: Interactive components like the `ResourceCard` (for downloads) and `GalleryPageClient` (for filtering/lightboxing) handle client-side logic using `"use client"`.
3. **Database Security**: Supabase Row Level Security (RLS) is enabled across all tables, ensuring that while the public can read data, only authenticated administrators can mutate it.

## 4. Feature Modules

### Academic Bank
A robust repository for "Lecture Slides" and "Past Questions."
- **Logic**: Intelligent URL parsing handles Cloudinary assets to ensure seamless viewing and forced downloads.
- **Organization**: Filtered by Semester, Year, and Course Code.

### Departmental Gallery
A visual history of DASA events.
- **Technology**: Uses a responsive masonry-style grid.
- **Admin**: Dedicated upload pipeline for admins to curate visual content.

### Admin Dashboard
A secure, segregated management suite.
- **Isolation**: Public navigation (Navbar/Footer) is automatically stripped on `/admin/*` routes to provide a focused workspace.
- **Management**: CRUD (Create, Read, Update, Delete) interfaces for Announcements, Tutorials, Resources, and Gallery.

## 5. Deployment & DevOps
- **Hosting**: Deployed on [Vercel](https://vercel.com/) with a production-ready CI/CD pipeline.
- **Build Optimization**: Configurations in `next.config.ts` ensure stable builds by bypassing experimental features and optimizing image delivery.

---
**Maintained by**: DASA Technical Team
**Last Updated**: March 2026
