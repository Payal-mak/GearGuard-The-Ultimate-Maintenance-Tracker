-- Add new fields to equipment table
ALTER TABLE public.equipment
ADD COLUMN IF NOT EXISTS employee text,
ADD COLUMN IF NOT EXISTS technician text,
ADD COLUMN IF NOT EXISTS scrap_date date,
ADD COLUMN IF NOT EXISTS used_in_location text,
ADD COLUMN IF NOT EXISTS work_center_id uuid REFERENCES public.work_centers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS description text;

-- Add new fields to equipment_categories table
ALTER TABLE public.equipment_categories
ADD COLUMN IF NOT EXISTS responsible text,
ADD COLUMN IF NOT EXISTS company text DEFAULT 'My Company (San Francisco)';

-- Add new fields to maintenance_teams table
ALTER TABLE public.maintenance_teams
ADD COLUMN IF NOT EXISTS team_members text[],
ADD COLUMN IF NOT EXISTS company text DEFAULT 'My Company (San Francisco)';

-- Add company field to work_centers table
ALTER TABLE public.work_centers
ADD COLUMN IF NOT EXISTS company text DEFAULT 'My Company (San Francisco)';
