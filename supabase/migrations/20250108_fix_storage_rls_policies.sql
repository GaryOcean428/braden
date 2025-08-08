-- Fix storage RLS policies and admin_users as per GitHub issue feedback
-- This migration fixes the RLS (Row Level Security) policies for storage and admin functionality

-- 1) Ensure the hero-images bucket exists and storage objects table has RLS enabled
select storage.create_bucket('hero-images', public => false);

alter table storage.objects enable row level security;

-- 2) Storage RLS policies (objects table)
-- Allow authenticated users to list and read objects in hero-images bucket
drop policy if exists "auth can read hero-images" on storage.objects;
create policy "auth can read hero-images"
on storage.objects
for select
using (
  bucket_id = 'hero-images' AND auth.role() = 'authenticated'
);

-- Allow authenticated users to upload into hero-images bucket
drop policy if exists "auth can upload hero-images" on storage.objects;
create policy "auth can upload hero-images"
on storage.objects
for insert
with check (
  bucket_id = 'hero-images' AND auth.role() = 'authenticated'
);

-- Allow the uploader to replace/delete their own objects
drop policy if exists "owner can update hero-images" on storage.objects;
create policy "owner can update hero-images"
on storage.objects
for update
using (bucket_id = 'hero-images' AND owner = auth.uid());

drop policy if exists "owner can delete hero-images" on storage.objects;
create policy "owner can delete hero-images"
on storage.objects
for delete
using (bucket_id = 'hero-images' AND owner = auth.uid());

-- 3) Admin users table for developer admin access
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.admin_users enable row level security;

-- Allow signed-in users to read admin list (so FE can detect admin status)
drop policy if exists "auth can read admin list" on public.admin_users;
create policy "auth can read admin list"
on public.admin_users
for select
using (auth.role() = 'authenticated');

-- Writes only allowed via service role
drop policy if exists "service can write admin list" on public.admin_users;
create policy "service can write admin list"
on public.admin_users
for insert
with check (auth.role() = 'service_role');

-- Seed the admin email (run once)
insert into public.admin_users (email)
values ('braden.lang77@gmail.com')
on conflict (email) do nothing;

-- 4) Create pages table for CMS functionality
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  body jsonb,
  hero_image text,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pages enable row level security;

-- Allow authenticated users to read pages
drop policy if exists "auth read pages" on public.pages;
create policy "auth read pages" 
on public.pages 
for select 
using (auth.role() = 'authenticated');

-- Allow admin users to write pages (using email check)
drop policy if exists "admins write pages" on public.pages;
create policy "admins write pages" 
on public.pages 
for all
using (
  exists (
    select 1 from public.admin_users a 
    where a.email = auth.email()
  )
)
with check (
  exists (
    select 1 from public.admin_users a 
    where a.email = auth.email()
  )
);

-- 5) Create media table for media management
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text unique not null,
  alt text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.media enable row level security;

-- Allow authenticated users to read media
drop policy if exists "auth read media" on public.media;
create policy "auth read media"
on public.media
for select
using (auth.role() = 'authenticated');

-- Allow admin users to write media
drop policy if exists "admins write media" on public.media;
create policy "admins write media"
on public.media
for all
using (
  exists (
    select 1 from public.admin_users a 
    where a.email = auth.email()
  )
)
with check (
  exists (
    select 1 from public.admin_users a 
    where a.email = auth.email()
  )
);