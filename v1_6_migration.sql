-- Migration for v1.6: Multiple Media and Review Social Features

-- 1. Add column for multiple media files
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;

-- 2. Add column to track likes
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0;

-- Optional: If you want to migrate existing image_url and video_url into the new media array immediately, you can run this:
-- UPDATE reviews 
-- SET media = CASE
--    WHEN image_url IS NOT NULL THEN jsonb_build_array(jsonb_build_object('url', image_url, 'type', 'image'))
--    WHEN video_url IS NOT NULL THEN jsonb_build_array(jsonb_build_object('url', video_url, 'type', 'video'))
--    ELSE '[]'::jsonb
-- END
-- WHERE jsonb_array_length(media) = 0;
