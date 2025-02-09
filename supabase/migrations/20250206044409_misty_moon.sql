/*
  # Set up storage for user images

  1. Storage Setup
    - Create 'images' bucket for storing user uploads and generated images
  
  2. Security
    - Enable storage policies for authenticated users to:
      - Upload their own images
      - Read their own images
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('images', 'images')
ON CONFLICT DO NOTHING;

-- Policy to allow authenticated users to upload files to the images bucket
CREATE POLICY "Users can upload their own images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow users to read their own files
CREATE POLICY "Users can read their own images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);