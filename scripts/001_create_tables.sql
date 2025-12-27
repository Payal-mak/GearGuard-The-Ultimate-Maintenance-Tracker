-- Create Equipment Categories table
create table if not exists public.equipment_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamp with time zone default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);

alter table public.equipment_categories enable row level security;

create policy "categories_select" on public.equipment_categories
  for select using (true);

create policy "categories_insert" on public.equipment_categories
  for insert with check (auth.uid() = user_id);

create policy "categories_update" on public.equipment_categories
  for update using (auth.uid() = user_id);

create policy "categories_delete" on public.equipment_categories
  for delete using (auth.uid() = user_id);

-- Create Maintenance Teams table
create table if not exists public.maintenance_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamp with time zone default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);

alter table public.maintenance_teams enable row level security;

create policy "teams_select" on public.maintenance_teams
  for select using (true);

create policy "teams_insert" on public.maintenance_teams
  for insert with check (auth.uid() = user_id);

create policy "teams_update" on public.maintenance_teams
  for update using (auth.uid() = user_id);

create policy "teams_delete" on public.maintenance_teams
  for delete using (auth.uid() = user_id);

-- Create Work Centers table
create table if not exists public.work_centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  description text,
  created_at timestamp with time zone default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);

alter table public.work_centers enable row level security;

create policy "work_centers_select" on public.work_centers
  for select using (true);

create policy "work_centers_insert" on public.work_centers
  for insert with check (auth.uid() = user_id);

create policy "work_centers_update" on public.work_centers
  for update using (auth.uid() = user_id);

create policy "work_centers_delete" on public.work_centers
  for delete using (auth.uid() = user_id);

-- Create Equipment table
create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  serial_number text,
  category_id uuid references public.equipment_categories(id) on delete set null,
  maintenance_team_id uuid references public.maintenance_teams(id) on delete set null,
  purchase_date date,
  warranty_expiry date,
  location text,
  department text,
  assigned_to text,
  created_at timestamp with time zone default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);

alter table public.equipment enable row level security;

create policy "equipment_select" on public.equipment
  for select using (true);

create policy "equipment_insert" on public.equipment
  for insert with check (auth.uid() = user_id);

create policy "equipment_update" on public.equipment
  for update using (auth.uid() = user_id);

create policy "equipment_delete" on public.equipment
  for delete using (auth.uid() = user_id);

-- Create Maintenance Requests table
create table if not exists public.maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  type text not null check (type in ('Corrective', 'Preventive')),
  stage text not null default 'New' check (stage in ('New', 'In Progress', 'Repaired', 'Scrap')),
  equipment_id uuid references public.equipment(id) on delete set null,
  work_center_id uuid references public.work_centers(id) on delete set null,
  maintenance_for text not null check (maintenance_for in ('Equipment', 'Work Center')),
  team_id uuid references public.maintenance_teams(id) on delete set null,
  category_id uuid references public.equipment_categories(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  duration_hours numeric(10,2),
  scheduled_date date,
  is_overdue boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);

alter table public.maintenance_requests enable row level security;

create policy "requests_select" on public.maintenance_requests
  for select using (true);

create policy "requests_insert" on public.maintenance_requests
  for insert with check (auth.uid() = user_id);

create policy "requests_update" on public.maintenance_requests
  for update using (auth.uid() = user_id);

create policy "requests_delete" on public.maintenance_requests
  for delete using (auth.uid() = user_id);

-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
