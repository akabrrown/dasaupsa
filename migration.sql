-- MIGRATION SCRIPT: Run this in Supabase SQL Editor to update existing tables

-- 1. Update general_posts
ALTER TABLE public.general_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Update tutorials safely
ALTER TABLE public.tutorials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.tutorials ADD COLUMN IF NOT EXISTS course_code TEXT;
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tutorials' AND column_name='course') THEN
        UPDATE public.tutorials SET course_code = course WHERE course_code IS NULL;
        ALTER TABLE public.tutorials DROP COLUMN course;
    END IF;
END $$;
ALTER TABLE public.tutorials ALTER COLUMN course_code SET NOT NULL;

-- 3. Update academic_resources safely
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.academic_resources ADD COLUMN IF NOT EXISTS course_code TEXT;
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='academic_resources' AND column_name='course') THEN
        UPDATE public.academic_resources SET course_code = course WHERE course_code IS NULL;
        ALTER TABLE public.academic_resources DROP COLUMN course;
    END IF;
END $$;
ALTER TABLE public.academic_resources ALTER COLUMN course_code SET NOT NULL;

-- 4. Update activities
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
-- Add 'ongoing' check constraint update
ALTER TABLE public.activities DROP CONSTRAINT IF EXISTS activities_status_check;
ALTER TABLE public.activities ADD CONSTRAINT activities_status_check CHECK (status IN ('upcoming', 'ongoing', 'completed'));

-- 5. Update profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
-- Add check constraint for role
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('Authority', 'Executive'));

-- 6. Any other fixes
ALTER TABLE public.tutorials ALTER COLUMN description DROP NOT NULL;
ALTER TABLE public.tutorials ALTER COLUMN semester TYPE INTEGER USING (semester::integer);
ALTER TABLE public.academic_resources DROP CONSTRAINT IF EXISTS academic_resources_type_check;
ALTER TABLE public.academic_resources ADD CONSTRAINT academic_resources_type_check CHECK (type IN ('slide', 'past_question'));
