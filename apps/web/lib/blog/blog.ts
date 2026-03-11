/**
 * Blog data layer using Supabase REST (PostgREST).
 * Use this when GraphQL does not expose table collections (e.g. only "node").
 */

import type { SupabaseClient } from '@supabase/supabase-js';

const PAGE_SIZE = 5;

export type BlogPostAuthor = {
  id: string;
  name: string;
};

export type BlogPost = {
  id: string;
  title: string;
  body: string;
  author_id: string;
  created_at: string;
  accounts?: BlogPostAuthor | null;
  account?: BlogPostAuthor | null;
};

export type BlogPostEdge = {
  cursor: string;
  node: BlogPost;
};

export type BlogPostsConnection = {
  blogPostsCollection: {
    edges: BlogPostEdge[];
    pageInfo: {
      endCursor: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
    };
  };
};

/** Fetch paginated blog posts (server-side). Use fetchBlogPosts from blog-server. */
export async function fetchBlogPostsWithClient(supabase: SupabaseClient, params: { page?: number }): Promise<BlogPostsConnection> {
  const page = Math.max(1, params.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  const { data: rows, error } = await db
    .from('blog_posts')
    .select('*, accounts(id, name)')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  const list = (rows ?? []).map((row: Record<string, unknown>) => normalizePost(row));
  const edges: BlogPostEdge[] = list.map((node: BlogPost, i: number) => ({ cursor: String(from + i), node }));
  const hasNextPage = list.length === PAGE_SIZE;

  return {
    blogPostsCollection: {
      edges,
      pageInfo: {
        startCursor: edges[0]?.cursor ?? null,
        endCursor: edges[edges.length - 1]?.cursor ?? null,
        hasPreviousPage: page > 1,
        hasNextPage,
      },
    },
  };
}

/** Fetch a single post by id (server-side). Use fetchBlogPostById from blog-server. */
export async function fetchBlogPostByIdWithClient(supabase: SupabaseClient, id: string): Promise<BlogPost | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  const { data, error } = await db
    .from('blog_posts')
    .select('*, accounts(id, name)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data ? normalizePost(data) : null;
}

/** Create a post (client-side). Pass the Supabase browser client. Ensures account exists first. */
export async function createBlogPost(
  supabase: SupabaseClient,
  params: {
    title: string;
    body: string;
    author_id: string;
    author_name?: string;
    author_email?: string;
  }
): Promise<BlogPost> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const name = params.author_name?.trim() || params.author_email?.split('@')[0] || 'User';
  const accountResult = await db
    .from('accounts')
    .insert({ id: params.author_id, name, email: params.author_email ?? null });
  if (accountResult.error && accountResult.error.code !== '23505') {
    throw new Error(accountResult.error.message);
  }

  const { data, error } = await db
    .from('blog_posts')
    .insert({ title: params.title, body: params.body, author_id: params.author_id })
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create post');
  return normalizePost(data);
}

function normalizePost(row: Record<string, unknown>): BlogPost {
  const accounts = (row.accounts as BlogPostAuthor | null) ?? (row.account as BlogPostAuthor | null);
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body ?? ''),
    author_id: String(row.author_id),
    created_at: String(row.created_at ?? ''),
    accounts: accounts ?? null,
    account: accounts ?? null,
  };
}

export function getPostAuthorName(post: BlogPost): string {
  const author = post.accounts ?? post.account;
  return author?.name ?? 'Anonymous';
}

export function getPostDate(post: BlogPost): string {
  return post.created_at ?? '';
}

export { PAGE_SIZE };
