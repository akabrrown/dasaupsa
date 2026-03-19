-- DASA Project SQL Schema
-- Updated with accurate types and administrative tracking

-- 1. general_posts (Announcements)
CREATE TABLE IF NOT EXISTS public.general_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    image_url TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. programs (Academic Programs)
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. tutorials
CREATE TABLE IF NOT EXISTS public.tutorials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    course_code TEXT NOT NULL,
    semester INTEGER NOT NULL DEFAULT 1,
    year INTEGER NOT NULL DEFAULT 1,
    lecturer TEXT NOT NULL,
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    program TEXT, -- Legacy field for backward compatibility
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. academic_resources (Academic Bank)
CREATE TABLE IF NOT EXISTS public.academic_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    course_code TEXT NOT NULL,
    year INTEGER NOT NULL DEFAULT 1,
    semester INTEGER NOT NULL DEFAULT 1,
    type TEXT NOT NULL CHECK (type IN ('slide', 'past_question')),
    file_url TEXT NOT NULL,
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    program TEXT, -- Fallback/Legacy storage
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. activities
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed')),
    completed_at TIMESTAMPTZ,
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. profiles (Authorities & Executives)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Authority', 'Executive')),
    photo_url TEXT,
    email TEXT,
    bio TEXT,
    display_order INTEGER DEFAULT 0,
    linkedin_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    tiktok_url TEXT,
    whatsapp_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. users (Public profiles for all registered users/admins)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin',
    must_change_password BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. admin_invites (Optional tracking for invited admins)
CREATE TABLE IF NOT EXISTS public.admin_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    invited_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for all tables
ALTER TABLE public.general_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors during re-run
DO $$ 
BEGIN
    -- Public Read Policies
    DROP POLICY IF EXISTS "Allow public read access on general_posts" ON public.general_posts;
    DROP POLICY IF EXISTS "Allow public read access on tutorials" ON public.tutorials;
    DROP POLICY IF EXISTS "Allow public read access on academic_resources" ON public.academic_resources;
    DROP POLICY IF EXISTS "Allow public read access on activities" ON public.activities;
    DROP POLICY IF EXISTS "Allow public read access on profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Allow public read access on users" ON public.users;

    -- Admin/User Management Policies
    DROP POLICY IF EXISTS "Admins have full access" ON public.general_posts;
    DROP POLICY IF EXISTS "Admins have full access" ON public.tutorials;
    DROP POLICY IF EXISTS "Admins have full access" ON public.academic_resources;
    DROP POLICY IF EXISTS "Admins have full access" ON public.activities;
    DROP POLICY IF EXISTS "Admins have full access" ON public.profiles;
    DROP POLICY IF EXISTS "Users can manage their own profile" ON public.users;
    DROP POLICY IF EXISTS "Admins can manage invites" ON public.admin_invites;
END $$;

-- Create basic RLS policies (Anonymous read access)
CREATE POLICY "Allow public read access on general_posts" ON public.general_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tutorials" ON public.tutorials FOR SELECT USING (true);
CREATE POLICY "Allow public read access on academic_resources" ON public.academic_resources FOR SELECT USING (true);
CREATE POLICY "Allow public read access on activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on users" ON public.users FOR SELECT USING (true);

-- Admins (authenticated) can manage everything
CREATE POLICY "Admins have full access" ON public.general_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access" ON public.tutorials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access" ON public.academic_resources FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access" ON public.activities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage their own profile" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admins can manage invites" ON public.admin_invites FOR ALL USING (auth.role() = 'authenticated');

-- 9. gallery (Visual collection of departmental events)
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for all tables (Re-running for completeness)
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors during re-run
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public read access on gallery" ON public.gallery;
    DROP POLICY IF EXISTS "Admins have full access" ON public.gallery;
END $$;

-- Create basic RLS policies
CREATE POLICY "Allow public read access on gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Admins have full access" ON public.gallery FOR ALL USING (auth.role() = 'authenticated');

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role, must_change_password)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'admin'),
        CASE 
            WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'admin') = 'admin' THEN TRUE 
            ELSE FALSE 
        END
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        must_change_password = EXCLUDED.must_change_password;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. bookmarks (User bookmarks for academic resources)
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.academic_resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, resource_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON public.bookmarks;
END $$;

CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks 
    FOR ALL USING (auth.uid() = user_id);

-- Migration Patch for social media expansion
-- Run this in Supabase SQL Editor if columns are missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='linkedin_url') THEN
        ALTER TABLE public.profiles ADD COLUMN linkedin_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='twitter_url') THEN
        ALTER TABLE public.profiles ADD COLUMN twitter_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='instagram_url') THEN
        ALTER TABLE public.profiles ADD COLUMN instagram_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='tiktok_url') THEN
        ALTER TABLE public.profiles ADD COLUMN tiktok_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='whatsapp_url') THEN
        ALTER TABLE public.profiles ADD COLUMN whatsapp_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='must_change_password') THEN
        ALTER TABLE public.users ADD COLUMN must_change_password BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='academic_resources' AND column_name='program_id') THEN
        ALTER TABLE public.academic_resources ADD COLUMN program_id UUID REFERENCES public.programs(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tutorials' AND column_name='program_id') THEN
        ALTER TABLE public.tutorials ADD COLUMN program_id UUID REFERENCES public.programs(id);
    END IF;

    -- Seed initial programs if table is empty
    IF (SELECT count(*) FROM public.programs) = 0 THEN
        INSERT INTO public.programs (name) VALUES 
        ('BSc Accounting'),
        ('BSc Accounting & Finance'),
        ('Diploma in Accounting'),
        ('Professional Accounting');
    END IF;

    -- Performance Indexes
    CREATE INDEX IF NOT EXISTS idx_tutorials_program_id ON public.tutorials(program_id);
    CREATE INDEX IF NOT EXISTS idx_academic_resources_program_id ON public.academic_resources(program_id);
    CREATE INDEX IF NOT EXISTS idx_academic_resources_type ON public.academic_resources(type);
    CREATE INDEX IF NOT EXISTS idx_general_posts_pinned_created ON public.general_posts(is_pinned DESC, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_profiles_role_order ON public.profiles(role, display_order);
    CREATE INDEX IF NOT EXISTS idx_activities_event_date ON public.activities(event_date DESC);

    -- Force schema cache refresh (PostgREST)
    NOTIFY pgrst, 'reload schema';
END $$;
