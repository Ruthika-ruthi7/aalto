-- Update case_studies table schema to match requirements
USE aalto_admin;

-- Add 'unpublished' to status ENUM
ALTER TABLE case_studies 
MODIFY COLUMN status ENUM('draft', 'published', 'unpublished') NOT NULL DEFAULT 'draft';

-- Add short_description column if it doesn't exist
ALTER TABLE case_studies 
ADD COLUMN short_description TEXT AFTER featured_image;

-- Make industry an ENUM with dropdown options
ALTER TABLE case_studies 
MODIFY COLUMN industry ENUM('manufacturing', 'construction', 'pharmaceutical', 'logistics', 'automotive', 'aerospace', 'food_beverage', 'textile', 'chemical', 'energy', 'other');

-- Update service_type ENUM with more options
ALTER TABLE case_studies 
MODIFY COLUMN service_type ENUM('consulting', 'engineering', 'construction', 'maintenance', 'automation', 'lifts_elevators', 'material_handling', 'warehouse_solutions', 'other');

-- Change results from TEXT to LONGTEXT
ALTER TABLE case_studies 
MODIFY COLUMN results LONGTEXT;

SELECT 'Case studies schema updated successfully!' as Status;
