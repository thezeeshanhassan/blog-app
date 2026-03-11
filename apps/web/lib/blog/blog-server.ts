import 'server-only';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import {
  fetchBlogPostByIdWithClient,
  fetchBlogPostsWithClient,
} from './blog';

export async function fetchBlogPosts(params: { page?: number }) {
  const supabase = getSupabaseServerClient();
  return fetchBlogPostsWithClient(supabase, params);
}

export async function fetchBlogPostById(id: string) {
  const supabase = getSupabaseServerClient();
  return fetchBlogPostByIdWithClient(supabase, id);
}
