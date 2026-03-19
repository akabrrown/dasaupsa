DASA Website — Project Documentation & TODO List

## Tech Stack Summary
**Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS** · **Supabase** (auth only) · **Cloudinary** (all media)

---

## 🎨 Color Palette

| Name | Hex | Usage |
|---|---|---|
| Golden Yellow | `#D4A017` | Accents, CTAs, highlights |
| Deep Blue | `#1A3A6B` | Nav, headers, primary |
| White | `#FFFFFF` | Backgrounds, cards |
| Light Blue | `#E8EEF7` | Section backgrounds |
| Border Gray | `#E2E8F0` | Dividers, borders |

---

## 📦 Free Libraries & Tools

**Styling/UI**
- **Tailwind CSS** — responsive utility classes
- **shadcn/ui** — accessible component primitives (buttons, modals, cards)
- **Lucide React** — icon library
- **Framer Motion** — animations and transitions
- **clsx + tailwind-merge** — conditional class merging

**Forms & Validation**
- **react-hook-form** — admin content forms
- **zod** — schema validation

**Backend/Services (Free Tier)**
- **Supabase** — admin auth + PostgreSQL (500MB free, 50K users)
- **Cloudinary** — images/videos/PDFs (25GB storage free)

**SEO & DX**
- **next-seo** — meta tags
- **ESLint + Prettier** — code quality
- **Vercel** — free hosting for Next.js

---

## 🗂️ Complete Folder Structure

```
DASA-website/
├── app/
│   ├── (public)/                   ← Public route group
│   │   ├── layout.tsx              ← Public layout (Navbar + Footer)
│   │   ├── page.tsx                ← Homepage / General
│   │   ├── tutorials/
│   │   │   ├── page.tsx            ← Tutorials listing
│   │   │   └── [id]/page.tsx       ← Single tutorial
│   │   ├── academic-bank/
│   │   │   └── page.tsx            ← Slides & past questions
│   │   ├── activities/
│   │   │   └── page.tsx            ← Events timeline
│   │   └── about/
│   │       └── page.tsx            ← Department & executives
│   ├── admin/                      ← HIDDEN FROM PUBLIC
│   │   ├── login/page.tsx          ← Admin login (Supabase Auth)
│   │   ├── dashboard/page.tsx      ← Admin overview
│   │   ├── general/page.tsx        ← Manage posts
│   │   ├── tutorials/page.tsx      ← Manage videos
│   │   ├── academic-bank/page.tsx  ← Manage resources
│   │   ├── activities/page.tsx     ← Manage events
│   │   ├── about/page.tsx          ← Manage profiles
│   │   └── layout.tsx              ← Admin layout (no public nav)
│   ├── api/
│   │   ├── auth/route.ts           ← Supabase auth callback
│   │   └── cloudinary/route.ts     ← Signed upload endpoint
│   ├── globals.css
│   └── layout.tsx                  ← Root layout
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Spinner.tsx
│   │   └── FileUpload.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AnnouncementCard.tsx
│   │   ├── TutorialCard.tsx
│   │   ├── ResourceCard.tsx
│   │   ├── ActivityCard.tsx
│   │   └── ProfileCard.tsx
│   └── admin/
│       ├── PostForm.tsx
│       ├── TutorialForm.tsx
│       ├── ResourceForm.tsx
│       ├── ActivityForm.tsx
│       └── ProfileForm.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               ← Browser Supabase client
│   │   └── server.ts               ← Server Supabase client (RSC)
│   ├── cloudinary/
│   │   ├── config.ts
│   │   └── upload.ts
│   ├── utils.ts                    ← cn(), formatDate()
│   └── constants.ts
├── types/
│   ├── index.ts
│   ├── supabase.ts                 ← Auto-generated from DB
│   ├── general.ts
│   ├── tutorial.ts
│   ├── academic.ts
│   ├── activity.ts
│   └── about.ts
├── styles/
│   ├── navbar.module.css
│   ├── hero.module.css
│   └── admin.module.css
├── hooks/
│   ├── useAuth.ts
│   ├── useUpload.ts
│   └── useSupabase.ts
├── middleware.ts                   ← Protects /admin/* routes
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.local                      ← Never commit to git
```

---

## ✅ Master TODO List (98 Tasks)

### Phase 1 — Project Setup (10 tasks)
- [ ] 1. `npx create-next-app@latest DASA-website --typescript --tailwind --app` — **High**
- [ ] 2. Install: `shadcn/ui`, `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge` — **High**
- [ ] 3. Install: `react-hook-form`, `zod`, `next-seo` — **High**
- [ ] 4. Create Supabase project at supabase.com — **High**
- [ ] 5. Create Cloudinary account at cloudinary.com — **High**
- [ ] 6. Configure `tailwind.config.ts` with DASA brand colors (DASA-gold, DASA-blue) — **High**
- [ ] 7. Set up `.env.local` with all API keys — **High**
- [ ] 8. Create all folders per folder structure above — **High**
- [ ] 9. Configure `tsconfig.json` path aliases (`@/components`, `@/lib`, etc.) — **Medium**
- [ ] 10. Set up ESLint + Prettier — **Medium**

### Phase 2 — Types & Lib Files (12 tasks)
- [ ] 11. Create `types/general.ts` — `GeneralPost` interface — **High**
- [ ] 12. Create `types/tutorial.ts` — `Tutorial` interface — **High**
- [ ] 13. Create `types/academic.ts` — `AcademicResource` interface — **High**
- [ ] 14. Create `types/activity.ts` — `Activity` interface — **High**
- [ ] 15. Create `types/about.ts` — `Profile`, `Authority`, `Executive` interfaces — **High**
- [ ] 16. Create `types/index.ts` — re-export all types — **High**
- [ ] 17. Create `lib/supabase/client.ts` — browser client — **High**
- [ ] 18. Create `lib/supabase/server.ts` — server client for RSC — **High**
- [ ] 19. Create `lib/cloudinary/config.ts` — SDK setup — **High**
- [ ] 20. Create `lib/cloudinary/upload.ts` — `getSignature()` helper — **High**
- [ ] 21. Create `lib/utils.ts` — `cn()`, `formatDate()`, `truncateText()` — **Medium**
- [ ] 22. Create `lib/constants.ts` — nav links, courses list, site config — **Medium**

### Phase 3 — Database Setup (10 tasks)
- [ ] 23. Create `general_posts` table in Supabase — **High**
- [ ] 24. Create `tutorials` table — **High**
- [ ] 25. Create `academic_resources` table — **High**
- [ ] 26. Create `activities` table — **High**
- [ ] 27. Create `profiles` table — **High**
- [ ] 28. Enable Row Level Security on all tables — **High**
- [ ] 29. Set RLS policies (SELECT: public; INSERT/UPDATE/DELETE: auth only) — **High**
- [ ] 30. Generate TS types: `npx supabase gen types typescript > types/supabase.ts` — **High**
- [ ] 31. Create first admin user in Supabase Auth dashboard — **High**
- [ ] 32. Create Cloudinary unsigned upload preset (folder: `DASA/`) — **High**

### Phase 4 — Layout & Shared Components (15 tasks)
- [ ] 33. Build `app/layout.tsx` — root layout, font loading (Inter + Poppins) — **High**
- [ ] 34. Build `app/globals.css` — Tailwind base, CSS variables, fonts — **High**
- [ ] 35. Build `components/layout/Navbar.tsx` — logo, nav links, mobile hamburger — **High**
- [ ] 36. Build `components/layout/Footer.tsx` — links, contact, social icons — **High**
- [ ] 37. Build `app/(public)/layout.tsx` — wraps all public pages — **High**
- [ ] 38. Build `components/ui/Button.tsx` — gold primary, blue secondary, ghost — **High**
- [ ] 39. Build `components/ui/Card.tsx` — white card with blue accent — **High**
- [ ] 40. Build `components/ui/Badge.tsx` — course/category/status badges — **Medium**
- [ ] 41. Build `components/ui/Modal.tsx` — reusable dialog — **Medium**
- [ ] 42. Build `components/ui/Spinner.tsx` — loading spinner — **Medium**
- [ ] 43. Build `components/ui/FileUpload.tsx` — Cloudinary widget wrapper — **High**
- [ ] 44. Create `styles/navbar.module.css` — mobile nav animation — **Medium**
- [ ] 45. Create `styles/hero.module.css` — hero gradient animations — **Medium**
- [ ] 46. Build `hooks/useAuth.ts` — session, user, loading state — **High**
- [ ] 47. Build `hooks/useUpload.ts` — Cloudinary upload + progress — **High**

### Phase 5 — Public Pages (13 tasks)
- [ ] 48. Build `components/sections/HeroSection.tsx` — animated DASA banner — **High**
- [ ] 49. Build `app/(public)/page.tsx` — homepage (hero, announcements, stats, quick links) — **High**
- [ ] 50. Build `components/sections/AnnouncementCard.tsx` — **High**
- [ ] 51. Build `app/(public)/tutorials/page.tsx` — listing with search + filters — **High**
- [ ] 52. Build `components/sections/TutorialCard.tsx` — **High**
- [ ] 53. Build `app/(public)/tutorials/[id]/page.tsx` — video player detail page — **High**
- [ ] 54. Build `app/(public)/academic-bank/page.tsx` — tabbed slides + past questions — **High**
- [ ] 55. Build `components/sections/ResourceCard.tsx` — file card + download button — **High**
- [ ] 56. Build `app/(public)/activities/page.tsx` — events timeline — **High**
- [ ] 57. Build `components/sections/ActivityCard.tsx` — event card + photo gallery — **High**
- [ ] 58. Build `app/(public)/about/page.tsx` — authorities + executives — **High**
- [ ] 59. Build `components/sections/ProfileCard.tsx` — person card with photo — **High**
- [ ] 60. Add responsive Tailwind classes across ALL pages (mobile/tablet/desktop) — **High**

### Phase 6 — Admin Panel (18 tasks)
- [ ] 61. Create `middleware.ts` — protect `/admin/*`, redirect to `/admin/login` — **High**
- [ ] 62. Build `app/admin/login/page.tsx` — Supabase Auth email/password form — **High**
- [ ] 63. Build `app/admin/layout.tsx` — sidebar layout, NO public nav — **High**
- [ ] 64. Build `components/layout/AdminSidebar.tsx` — nav links + logout — **High**
- [ ] 65. Build `app/admin/dashboard/page.tsx` — stats + recent activity — **High**
- [ ] 66. Build `app/admin/general/page.tsx` — list + CRUD for posts — **High**
- [ ] 67. Build `components/admin/PostForm.tsx` — form with image upload — **High**
- [ ] 68. Build `app/admin/tutorials/page.tsx` — list + CRUD for tutorials — **High**
- [ ] 69. Build `components/admin/TutorialForm.tsx` — video + thumbnail upload — **High**
- [ ] 70. Build `app/admin/academic-bank/page.tsx` — list + CRUD for resources — **High**
- [ ] 71. Build `components/admin/ResourceForm.tsx` — PDF upload — **High**
- [ ] 72. Build `app/admin/activities/page.tsx` — list + CRUD for events — **High**
- [ ] 73. Build `components/admin/ActivityForm.tsx` — multi-image upload — **High**
- [ ] 74. Build `app/admin/about/page.tsx` — list + CRUD for profiles — **High**
- [ ] 75. Build `components/admin/ProfileForm.tsx` — photo upload — **High**
- [ ] 76. Add delete confirmation modal to all CRUD sections — **High**
- [ ] 77. Add success/error toast notifications after all admin actions — **Medium**
- [ ] 78. Create `styles/admin.module.css` — admin panel styles — **Medium**

### Phase 7 — API Routes & SEO (6 tasks)
- [ ] 79. Build `app/api/auth/route.ts` — Supabase auth callback — **High**
- [ ] 80. Build `app/api/cloudinary/route.ts` — sign uploads server-side — **High**
- [ ] 81. Add `metadata` to all public pages (title, description, og:image) — **Medium**
- [ ] 82. Create `public/robots.txt` — `Disallow: /admin/` — **High**
- [ ] 83. Create `app/sitemap.ts` — public pages only, no admin — **Medium**
- [ ] 84. Design Open Graph image (1200×630px, blue/gold branded) — **Low**

### Phase 8 — QA & Deployment (14 tasks)
- [ ] 85. Test all public pages on mobile (375px), tablet (768px), desktop (1280px) — **High**
- [ ] 86. Test admin login + all CRUD flows end-to-end — **High**
- [ ] 87. Test Cloudinary uploads (image, video, PDF) — **High**
- [ ] 88. Verify `/admin/login` redirects unauthed users — **High**
- [ ] 89. Verify no admin links appear in public nav or sitemap — **High**
- [ ] 90. Run Lighthouse audit — target Performance 90+, Accessibility 95+ — **Medium**
- [ ] 91. Fix all TypeScript errors (`npx tsc --noEmit`) — **High**
- [ ] 92. Push code to GitHub — **High**
- [ ] 93. Create Vercel account + connect GitHub repo — **High**
- [ ] 94. Add all env variables in Vercel dashboard — **High**
- [ ] 95. Deploy + verify production build — **High**
- [ ] 96. Configure custom domain (optional) — **Low**
- [ ] 97. Set up separate Supabase production project — **Medium**
- [ ] 98. Seed database with initial content (sample posts, profiles) — **Medium**

---

## 🗃️ Supabase Database Schema

| Table | Key Columns |
|---|---|
| `general_posts` | id, title, body, image_url, is_pinned, created_at |
| `tutorials` | id, title, description, video_url, thumbnail_url, course, semester, year, lecturer |
| `academic_resources` | id, title, course, year, semester, type (slide/past_question), file_url, download_count |
| `activities` | id, title, description, location, event_date, status (upcoming/completed), images[] |
| `profiles` | id, name, title, role, photo_url, email, bio, category (authority/executive), display_order |

**RLS Rules:** SELECT = public (anon). INSERT/UPDATE/DELETE = authenticated admin only.

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

## 🗓️ Development Roadmap

| Phase | Focus | Est. Time |
|---|---|---|
| 1 | Project Setup | 1 day |
| 2 | Types & Lib | 1 day |
| 3 | Database | 1 day |
| 4 | Layout & Components | 2 days |
| 5 | Public Pages | 4 days |
| 6 | Admin Panel | 4 days |
| 7 | API & SEO | 1 day |
| 8 | QA & Deploy | 2 days |
| **Total** | | **~16 days solo** |



