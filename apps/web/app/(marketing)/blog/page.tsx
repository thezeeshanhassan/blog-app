import Link from 'next/link';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Button } from '@kit/ui/button';
import { getPostAuthorName, getPostDate } from '~/lib/blog/blog';
import { fetchBlogPosts } from '~/lib/blog/blog-server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { BlogPagination } from './_components/blog-pagination';

export const revalidate = 60;

export const metadata = {
  title: 'Blog',
  description: 'Read our latest blog posts',
};

async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? '1'), 10) || 1);

  let isSignedIn = false;
  try {
    const supabase = getSupabaseServerClient();
    const { data: authData } = await supabase.auth.getClaims();
    isSignedIn = !!authData?.claims;
  } catch {
    isSignedIn = false;
  }

  const data = await fetchBlogPosts({ page });
  const { edges, pageInfo } = data.blogPostsCollection;

  return (
    <div className="container mx-auto mt-4 flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-medium tracking-tighter dark:text-white">
            Blog
          </h1>
          <p className="text-muted-foreground">
            Latest posts from our blog.
          </p>
        </div>
        {isSignedIn && (
          <Button asChild className="shrink-0">
            <Link href="/home/blog/create">Create post</Link>
          </Button>
        )}
      </div>

      <ul className="flex flex-col gap-6">
        {edges.length === 0 ? (
          <li className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              No posts yet.
              {isSignedIn ? (
                <>
                  {' '}
                  <Link href="/home/blog/create" className="font-medium text-foreground underline underline-offset-2 hover:no-underline">
                    Create the first post
                  </Link>
                </>
              ) : (
                ' Sign in to create one.'
              )}
            </p>
          </li>
        ) : (
          edges.map(({ node }) => {
            const excerpt =
              node.body.length > 200
                ? `${node.body.slice(0, 200).trim()}...`
                : node.body;
            const dateStr = getPostDate(node);
            const date = dateStr
              ? new Date(dateStr).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '';
            return (
              <li key={node.id}>
                <Link
                  href={`/blog/${node.id}`}
                  className="block rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50"
                >
                  <h2 className="font-semibold text-foreground">{node.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {excerpt}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {getPostAuthorName(node)} · {date}
                  </p>
                </Link>
              </li>
            );
          })
        )}
      </ul>

      {edges.length > 0 && (
        <BlogPagination
          currentPage={page}
          hasNextPage={pageInfo.hasNextPage}
          hasPreviousPage={pageInfo.hasPreviousPage}
        />
      )}
    </div>
  );
}

export default withI18n(BlogListPage);
