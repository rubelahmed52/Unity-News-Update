-- Unity News Update database
create table if not exists public.news (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 slug text unique not null,
 excerpt text,
 content text not null,
 image_url text,
 category text default 'সর্বশেষ',
 author text,
 published_at timestamptz default now(),
 is_published boolean default false,
 is_breaking boolean default false,
 is_featured boolean default false,
 created_at timestamptz default now(),
 updated_at timestamptz default now()
);
alter table public.news enable row level security;
create policy "public can read published news" on public.news for select using (is_published = true);
create policy "authenticated can insert news" on public.news for insert to authenticated with check (true);
create policy "authenticated can update news" on public.news for update to authenticated using (true) with check (true);
create policy "authenticated can delete news" on public.news for delete to authenticated using (true);

-- Create a Storage bucket named news-images in Supabase Dashboard if you want image uploads.
-- IMPORTANT: tighten admin policies before using this in production with multiple admin accounts.
