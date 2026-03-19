# DASA Website — Master TODO List

## Phase 1 — Project Setup (10 tasks)
- [x] 1. npx create-next-app@latest DASA-website --typescript --tailwind --app — High
- [x] 2. Install: shadcn/ui, lucide-react, framer-motion, clsx, tailwind-merge — High
- [x] 3. Install: react-hook-form, zod, next-seo — High
- [ ] 4. Create Supabase project at supabase.com — High
- [ ] 5. Create Cloudinary account at cloudinary.com — High
- [x] 6. Configure tailwind.config.ts with DASA brand colors (DASA-gold, DASA-blue) — High
- [ ] 7. Set up .env.local with all API keys — High
- [x] 8. Create all folders per folder structure above — High
- [x] 9. Configure tsconfig.json path aliases (@/components, @/lib, etc.) — Medium
- [x] 10. Set up ESLint + Prettier — Medium

## Phase 2 — Types & Lib Files (12 tasks)
- [x] 11. Create types/general.ts — GeneralPost interface — High
- [x] 12. Create types/tutorial.ts — Tutorial interface — High
- [x] 13. Create types/academic.ts — AcademicResource interface — High
- [x] 14. Create types/activity.ts — Activity interface — High
- [x] 15. Create types/about.ts — Profile, Authority, Executive interfaces — High
- [x] 16. Create types/index.ts — re-export all types — High
- [x] 17. Create lib/supabase/client.ts — browser client — High
- [x] 18. Create lib/supabase/server.ts — server client for RSC — High
- [x] 19. Create lib/cloudinary/config.ts — SDK setup — High
- [x] 20. Create lib/cloudinary/upload.ts — getSignature() helper — High
- [x] 21. Create lib/utils.ts — cn(), formatDate(), truncateText() — Medium
- [x] 22. Create lib/constants.ts — nav links, courses list, site config — Medium

## Phase 3 — Database Setup (10 tasks)
- [ ] 23. Create general_posts table in Supabase — High
- [ ] 24. Create tutorials table — High
- [ ] 25. Create academic_resources table — High
- [ ] 26. Create activities table — High
- [ ] 27. Create profiles table — High
- [ ] 28. Enable Row Level Security on all tables — High
- [ ] 29. Set RLS policies (SELECT: public; INSERT/UPDATE/DELETE: auth only) — High
- [ ] 30. Generate TS types: npx supabase gen types typescript > types/supabase.ts — High
- [ ] 31. Create first admin user in Supabase Auth dashboard — High
- [ ] 32. Create Cloudinary unsigned upload preset (folder: DASA/) — High

## Phase 4 — Layout & Shared Components (15 tasks)
- [x] 33. Build app/layout.tsx — root layout, font loading (Inter + Poppins) — High
- [x] 34. Build app/globals.css — Tailwind base, CSS variables, fonts — High
- [x] 35. Build components/layout/Navbar.tsx — logo, nav links, mobile hamburger — High
- [x] 36. Build components/layout/Footer.tsx — links, contact, social icons — High
- [x] 37. Build app/(public)/layout.tsx — wraps all public pages — High
- [x] 38. Build components/ui/Button.tsx — gold primary, blue secondary, ghost — High
- [x] 39. Build components/ui/Card.tsx — white card with blue accent — High
- [x] 40. Build components/ui/Badge.tsx — course/category/status badges — Medium
- [x] 41. Build components/ui/Modal.tsx — reusable dialog — Medium
- [x] 42. Build components/ui/Spinner.tsx — loading spinner — Medium
- [x] 43. Build components/ui/FileUpload.tsx — Cloudinary widget wrapper — High
- [x] 44. Create styles/navbar.module.css — mobile nav animation — Medium
- [x] 45. Create styles/hero.module.css — hero gradient animations — Medium
- [x] 46. Build hooks/useAuth.ts — session, user, loading state — High
- [x] 47. Build hooks/useUpload.ts — Cloudinary upload + progress — High

## Phase 5 — Public Pages (13 tasks)
- [x] 48. Build components/sections/HeroSection.tsx — animated DASA banner — High
- [x] 49. Build app/(public)/page.tsx — homepage (hero, announcements, stats, quick links) — High
- [x] 50. Build components/sections/AnnouncementCard.tsx — High
- [x] 51. Build app/(public)/tutorials/page.tsx — listing with search + filters — High
- [x] 52. Build components/sections/TutorialCard.tsx — High
- [x] 53. Build app/(public)/tutorials/[id]/page.tsx — video player detail page — High
- [x] 54. Build app/(public)/academic-bank/page.tsx — tabbed slides + past questions — High
- [x] 55. Build components/sections/ResourceCard.tsx — file card + download button — High
- [x] 56. Build app/(public)/activities/page.tsx — events timeline — High
- [x] 57. Build components/sections/ActivityCard.tsx — event card + photo gallery — High
- [x] 58. Build app/(public)/about/page.tsx — authorities + executives — High
- [x] 59. Build components/sections/ProfileCard.tsx — person card with photo — High
- [x] 60. Add responsive Tailwind classes across ALL pages (mobile/tablet/desktop) — High

## Phase 6 — Admin Panel (18 tasks)
- [x] 61. Create middleware.ts — protect /admin/*, redirect to /admin/login — High
- [x] 62. Build app/admin/login/page.tsx — Supabase Auth email/password form — High
- [x] 63. Build app/admin/layout.tsx — sidebar layout, NO public nav — High
- [x] 64. Build components/layout/AdminSidebar.tsx — nav links + logout — High
- [x] 65. Build app/admin/dashboard/page.tsx — stats + recent activity — High
- [x] 66. Build app/admin/general/page.tsx — list + CRUD for posts — High
- [x] 67. Build components/admin/PostForm.tsx — form with image upload — High
- [x] 68. Build app/admin/tutorials/page.tsx — list + CRUD for tutorials — High
- [x] 69. Build components/admin/TutorialForm.tsx — video + thumbnail upload — High
- [x] 70. Build app/admin/academic-bank/page.tsx — list + CRUD for resources — High
- [x] 71. Build components/admin/ResourceForm.tsx — PDF upload — High
- [x] 72. Build app/admin/activities/page.tsx — list + CRUD for events — High
- [x] 73. Build components/admin/ActivityForm.tsx — multi-image upload — High
- [x] 74. Build app/admin/about/page.tsx — list + CRUD for profiles — High
- [x] 75. Build components/admin/ProfileForm.tsx — photo upload — High
- [x] 76. Add delete confirmation modal to all CRUD sections — High
- [x] 77. Add success/error toast notifications after all admin actions — Medium
- [x] 78. Create styles/admin.module.css — admin panel styles — Medium

## Phase 7 — API Routes & SEO (6 tasks)
- [x] 79. Build app/api/auth/route.ts — Supabase auth callback — High
- [x] 80. Build app/api/cloudinary/route.ts — sign uploads server-side — High
- [x] 81. Add metadata to all public pages (title, description, og:image) — Medium
- [x] 82. Create public/robots.txt — Disallow: /admin/ — High
- [x] 83. Create app/sitemap.ts — public pages only, no admin — Medium
- [ ] 84. Design Open Graph image (1200×630px, blue/gold branded) — Low

## Phase 8 — QA & Deployment (14 tasks)
- [x] 85. Test all public pages on mobile (375px), tablet (768px), desktop (1280px) — High
- [x] 86. Test admin login + all CRUD flows end-to-end — High
- [x] 87. Test Cloudinary uploads (image, video, PDF) — High
- [x] 88. Verify /admin/login redirects unauthed users — High
- [x] 89. Verify no admin links appear in public nav or sitemap — High
- [x] 90. Run Lighthouse audit — target Performance 90+, Accessibility 95+ — Medium
- [x] 91. Fix all TypeScript errors (npx tsc --noEmit) — High
- [ ] 92. Push code to GitHub — High
- [ ] 93. Create Vercel account + connect GitHub repo — High
- [ ] 94. Add all env variables in Vercel dashboard — High
- [ ] 95. Deploy + verify production build — High
- [ ] 96. Configure custom domain (optional) — Low
- [ ] 97. Set up separate Supabase production project — Medium
- [ ] 98. Seed database with initial content (sample posts, profiles) — Medium


