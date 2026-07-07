-- Migration for v1.7: Website Templates

-- Add template_id to salon_settings if it doesn't exist
ALTER TABLE salon_settings ADD COLUMN IF NOT EXISTS template_id VARCHAR(50) DEFAULT 'classic';

-- Update existing records to have the default 'classic' template
UPDATE salon_settings SET template_id = 'classic' WHERE template_id IS NULL;
