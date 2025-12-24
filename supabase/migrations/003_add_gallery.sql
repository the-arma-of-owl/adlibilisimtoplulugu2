-- Add gallery_images column to events table (JSON array of image URLs)
ALTER TABLE events ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;

