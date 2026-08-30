-- ============================================================
-- SQL Schema for MathLearn SMP 8 User Answers & Profiles
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create the user_answers table
CREATE TABLE IF NOT EXISTS public.user_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    material_id INT NOT NULL,
    section_index INT NOT NULL,
    question_index INT NOT NULL,
    answer_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, material_id, section_index, question_index)
);

-- 2. Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'student', -- 'student' | 'teacher'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Drop Existing Policies (to prevent duplicates)
DROP POLICY IF EXISTS "Users can view their own answers" ON public.user_answers;
DROP POLICY IF EXISTS "Users can insert their own answers" ON public.user_answers;
DROP POLICY IF EXISTS "Users can update their own answers" ON public.user_answers;
DROP POLICY IF EXISTS "Users can delete their own answers" ON public.user_answers;
DROP POLICY IF EXISTS "Allow select for all authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Allow upsert for users on their own profile" ON public.profiles;

-- 5. Create RLS Policies for user_answers
-- Users can view their own answers, and teachers can view all answers
CREATE POLICY "Users and teachers can view answers" 
    ON public.user_answers 
    FOR SELECT 
    USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'teacher'
        )
    );

-- Users can insert their own answers
CREATE POLICY "Users can insert their own answers" 
    ON public.user_answers 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own answers
CREATE POLICY "Users can update their own answers" 
    ON public.user_answers 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Users can delete their own answers
CREATE POLICY "Users can delete their own answers" 
    ON public.user_answers 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- 6. Create RLS Policies for profiles
-- All authenticated users can view profiles
CREATE POLICY "Allow select for all authenticated users"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);

-- Users can update or insert their own profiles
CREATE POLICY "Allow upsert for users on their own profile"
    ON public.profiles
    FOR ALL
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ============================================================
-- 7. Supabase Storage: Bucket & Storage Policies for 'materials'
-- ============================================================

-- Create the storage bucket 'materials' if it does not exist (public for direct viewing)
INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies for 'materials' to prevent duplicates
DROP POLICY IF EXISTS "Public Access Materials" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload to materials" ON storage.objects;
DROP POLICY IF EXISTS "Allow read access to materials" ON storage.objects;
DROP POLICY IF EXISTS "Allow user update own materials" ON storage.objects;
DROP POLICY IF EXISTS "Allow user delete own materials" ON storage.objects;

-- Allow public and authenticated users (teachers, students) to view/download files
CREATE POLICY "Allow read access to materials"
ON storage.objects FOR SELECT
USING (bucket_id = 'materials');

-- Allow authenticated users (students & teachers) to upload files into 'materials'
CREATE POLICY "Allow authenticated upload to materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'materials');

-- Allow users to update their own files in 'materials'
CREATE POLICY "Allow user update own materials"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'materials' AND auth.uid() = owner);

-- Allow users to delete their own files in 'materials'
CREATE POLICY "Allow user delete own materials"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'materials' AND auth.uid() = owner);

