/*
 * -------------------------------------------------------
 * Blog posts table for the blog application.
 * Exposed via Supabase GraphQL for list, detail, and create.
 * -------------------------------------------------------
 */

-- Blog posts table: id, title, body, author_id (references accounts for GraphQL author name), created_at
create table if not exists public.blog_posts (
  id uuid not null default extensions.uuid_generate_v4(),
  title text not null,
  body text not null,
  author_id uuid not null references public.accounts(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id)
);

comment on table public.blog_posts is 'Blog posts written by authenticated users';
comment on column public.blog_posts.author_id is 'References auth.users - the post author';

-- Enable RLS
alter table public.blog_posts enable row level security;

-- Policy: anyone (anon or authenticated) can read all posts
create policy blog_posts_select on public.blog_posts
  for select
  to anon, authenticated
  using (true);

-- Policy: authenticated users can insert their own post (author_id must be auth.uid())
create policy blog_posts_insert on public.blog_posts
  for insert
  to authenticated
  with check (author_id = auth.uid());

-- Grant permissions so GraphQL API can access the table
-- anon: read-only for list and detail
grant select on public.blog_posts to anon;
-- authenticated: read and insert
grant select, insert on public.blog_posts to authenticated;

-- Optional: trigger to keep updated_at in sync (optional for future updates)
create or replace function public.blog_posts_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.blog_posts_updated_at();
