/*
  # Create storage bucket for project images

  1. Storage
    - Create 'projects' bucket for storing project images
    - Enable public access for project images
    - Set up RLS policies for authenticated users

  2. Security
    - Users can upload images to their own folder
    - Public read access for all images
    - Authenticated users can delete their own images
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true);

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload project images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'projects');

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update their own project images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own project images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to all project images
CREATE POLICY "Public read access for project images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'projects');