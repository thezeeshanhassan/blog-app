# Blog App – Local Setup

A simple blog built with **Next.js 15**, **Supabase**, and **Makerkit**.

- Public visitors can read posts on `/blog` and individual posts on `/blog/[id]`.
- Signed‑in users can create posts on `/home/blog/create`.

## Tech Stack

- **Next.js 15** (App Router) in `apps/web`
- **Supabase** for database, auth, and RLS
- **Makerkit** for UI, auth flows, and app shell
- **Tailwind CSS v4** + Shadcn UI
- **TypeScript**, **ESLint**, **Prettier**, **Turborepo**

## 1. Prerequisites

- Node.js **18+** (LTS recommended)
- **pnpm** (recommended)
- A **Supabase project** (remote) or Supabase CLI if you want to run Supabase locally

## 2. Clone & Install

```bash
git clone <your-repo-url> blog-app
cd blog-app
pnpm install
```

## 3. Environment Variables

The web app lives in `apps/web`.

1. From the repo root, create your local env file if needed:

```bash
cd apps/web
cp .env .env.local   # if .env.local does not exist yet
```

2. Open `apps/web/.env.local` and ensure at least:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SUPABASE_GRAPHQL_URL=https://<your-project-ref>.supabase.co/graphql/v1

NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Auth methods (current config)
NEXT_PUBLIC_AUTH_PASSWORD=true
NEXT_PUBLIC_AUTH_MAGIC_LINK=false
```

If you also want to run with a local Supabase instance using the CLI, see `apps/web/supabase/MIGRATION_SETUP.md` and update these values accordingly.

## 4. Database & Blog Schema

This project expects a Supabase database with a `blog_posts` table and RLS policies defined by the migration:

- `apps/web/supabase/migrations/20250311000000_blog_posts.sql`

If you are using a **remote** Supabase project and have the Supabase CLI installed:

```bash
# from repo root
pnpm --filter web supabase link --project-ref <your-project-ref>
pnpm --filter web supabase db push
```

This will apply all migrations (including `blog_posts`) to your remote project.

If you are using **local** Supabase via Docker, you can instead run the commands described in `apps/web/supabase/MIGRATION_SETUP.md`.

## 5. Run the App

From the **repo root**:

```bash
pnpm run dev
```

Then open:

- `http://localhost:3000` – marketing home
- `/blog` – blog list (public)
- `/blog/[id]` – post detail (public)
- `/home` – app home (requires sign‑in)
- `/home/blog/create` – create post (requires sign‑in)

## 6. Auth Configuration

Auth is handled via Supabase + Makerkit.

- **Email/password**: enabled with `NEXT_PUBLIC_AUTH_PASSWORD=true`
- **Magic link (passwordless)**: controlled by `NEXT_PUBLIC_AUTH_MAGIC_LINK`
- **OAuth providers** (e.g. Google) can be configured in the Supabase Dashboard.  
  - Redirect URL should be:

    ```text
    http://localhost:3000/auth/callback
    ```

Sign‑in and sign‑up pages live in:

- `apps/web/app/auth/sign-in/page.tsx`
- `apps/web/app/auth/sign-up/page.tsx`

Protected app routes are under `apps/web/app/home`.

## 7. Blog Features

- **Blog list**: `/blog`
  - Paginated (5 posts per page)
  - Shows title, excerpt, author, and created date
- **Post detail**: `/blog/[id]`
  - Renders full post body
- **Create post**: `/home/blog/create`
  - Requires authentication
  - Title and body required (validated with Zod + React Hook Form)
  - Author is taken from the authenticated user

## 8. Code Quality Scripts

From the **repo root**:

```bash
pnpm run lint        # ESLint
pnpm run typecheck   # TypeScript
pnpm run format:fix  # Prettier
```

Turborepo caching is enabled, so repeated runs of these commands will be fast.

## 9. Project Structure (High Level)

```text
apps/
  web/
    app/
      (marketing)/   # Public marketing + blog pages
      auth/          # Auth pages
      home/          # Authenticated app pages
    supabase/        # Migrations and config
    config/          # App/auth/navigation config

packages/
  ui/                # Shared UI components
  features/          # Shared feature packages (e.g. auth)
```

## 10. Notes

- The app branding has been updated from Makerkit to **Blog** (logo, favicon, and tab title).
- The footer only shows **Sign In / Sign Up** when the user is signed out; signed‑in users see quick links (Home, Create Post).
- Auth UI currently uses **email/password only** (magic link is disabled by default). Enable it by setting `NEXT_PUBLIC_AUTH_MAGIC_LINK=true` and configuring it in Supabase if you want passwordless login.
