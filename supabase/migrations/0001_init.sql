-- Nutrixon prototype schema (Supabase/PostgreSQL)
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  full_name text,
  role text not null check (role in ('consumer', 'company', 'reviewer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid references profiles(id) on delete cascade,
  name text not null,
  license_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  name text not null,
  brand text not null,
  category text not null,
  is_beverage boolean not null default false,
  publish_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_submissions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  status text not null,
  intended_launch_date date,
  reviewer_feedback text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  ingredient_name text not null,
  quantity text,
  created_at timestamptz not null default now()
);

create table if not exists nutrition_facts (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  basis text not null check (basis in ('per_100g', 'per_100ml')),
  energy_kcal numeric,
  sugar_g numeric,
  saturated_fat_g numeric,
  sodium_mg numeric,
  fibre_g numeric,
  protein_g numeric,
  created_at timestamptz not null default now()
);

create table if not exists laboratory_reports (
  id uuid primary key default gen_random_uuid(),
  product_submission_id uuid references product_submissions(id) on delete cascade,
  laboratory_name text not null,
  accreditation_details text,
  report_reference text not null,
  sample_identifier text,
  sample_collection_date date,
  testing_date date,
  reviewer_verification_status text,
  report_file_path text,
  comments text,
  created_at timestamptz not null default now()
);

create table if not exists laboratory_test_results (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references laboratory_reports(id) on delete cascade,
  test_name text not null,
  result numeric,
  unit text,
  threshold text,
  status text not null check (status in ('Pass', 'Fail', 'Inconclusive', 'Pending')),
  created_at timestamptz not null default now()
);

create table if not exists screening_rules (
  id uuid primary key default gen_random_uuid(),
  jurisdiction text not null,
  category text,
  ingredient text not null,
  rule_type text not null,
  effective_date date,
  source_reference text,
  created_at timestamptz not null default now()
);

create table if not exists reviewer_findings (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references product_submissions(id) on delete cascade,
  reviewer_profile_id uuid references profiles(id),
  finding text not null,
  created_at timestamptz not null default now()
);

create table if not exists submission_status_history (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references product_submissions(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid references profiles(id),
  changed_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references profiles(id),
  action text not null,
  entity_name text not null,
  entity_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_company_id on products(company_id);
create index if not exists idx_submissions_product_id on product_submissions(product_id);
create index if not exists idx_lab_reports_submission_id on laboratory_reports(product_submission_id);
create index if not exists idx_test_results_report_id on laboratory_test_results(report_id);

alter table profiles enable row level security;
alter table companies enable row level security;
alter table products enable row level security;
alter table product_submissions enable row level security;

create policy if not exists "public can view published products" on products for select using (publish_public = true);
create policy if not exists "company members can view own companies" on companies
for select using (
  exists (select 1 from profiles p where p.id = owner_profile_id and p.user_id = auth.uid())
);
create policy if not exists "company members manage own submissions" on product_submissions
for all using (
  exists (
    select 1
    from products pr
    join companies c on c.id = pr.company_id
    join profiles p on p.id = c.owner_profile_id
    where pr.id = product_submissions.product_id and p.user_id = auth.uid()
  )
);
