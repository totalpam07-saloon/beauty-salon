-- V1.5 Migration SQL Script
-- Copy and paste this into your Supabase SQL Editor and click "Run"

-- 1. Create the Staff table
CREATE TABLE public.staff (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add Row Level Security (RLS) for Staff
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for staff"
  ON public.staff FOR SELECT
  USING (true);

CREATE POLICY "Tenant admins can insert staff"
  ON public.staff FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));

CREATE POLICY "Tenant admins can update staff"
  ON public.staff FOR UPDATE
  USING (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));

CREATE POLICY "Tenant admins can delete staff"
  ON public.staff FOR DELETE
  USING (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));

-- 2. Create the Clients (CRM) table
CREATE TABLE public.clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  private_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(tenant_id, phone) -- Prevent duplicate clients for the same salon based on phone
);

-- Add Row Level Security (RLS) for Clients (Only admins can view/edit)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant admins can view clients"
  ON public.clients FOR SELECT
  USING (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));

CREATE POLICY "Tenant admins can insert clients"
  ON public.clients FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));

CREATE POLICY "Tenant admins can update clients"
  ON public.clients FOR UPDATE
  USING (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));

-- 3. Modify Appointments Table
-- First, add the column for staff_id (nullable at first to avoid breaking existing rows)
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS staff_id uuid REFERENCES public.staff(id) ON DELETE SET NULL;
-- Add client_id so we can link to the new CRM table
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;

-- 4. Create the Reviews table
CREATE TABLE public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  appointment_id uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  image_url text,
  is_anonymous boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(appointment_id) -- One review per appointment
);

-- Add Row Level Security (RLS) for Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Anyone with the magic link (knowing the appointment_id) can insert a review
CREATE POLICY "Public can insert reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (true);

-- Only admins can delete a review (if it's inappropriate)
CREATE POLICY "Tenant admins can delete reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() IN (SELECT owner_id FROM public.tenants WHERE id = tenant_id));
