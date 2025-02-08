/*
  # Create generations table

  1. New Tables
    - `generations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `prompt` (text, nullable)
      - `input_image_url` (text, nullable)
      - `output_image_url` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `generations` table
    - Add policies for authenticated users to:
      - Read their own generations
      - Insert their own generations
*/

CREATE TABLE generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  prompt text,
  input_image_url text,
  output_image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own generations"
  ON generations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
  ON generations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);