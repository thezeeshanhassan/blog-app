import Link from 'next/link';

import { notFound } from 'next/navigation';

import { Button } from '@kit/ui/button';
import { getPostAuthorName, getPostDate } from '~/lib/blog/blog';
import { fetchBlogPostById } from '~/lib/blog/blog-server';
import { withI18n } from '~/lib/i18n/with-i18n';

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await fetchBlogPostById(id);

  if (!post) {
    notFound();
  }

  const dateStr = getPostDate(post);
  const date = dateStr
    ? new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <article className="container mx-auto mt-4 max-w-3xl py-10">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/blog">← Back to Blog</Link>
      </Button>

      <header className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight dark:text-white md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {getPostAuthorName(post)} · {date}
        </p>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-foreground">
          {post.body}
        </div>
      </div>
    </article>
  );
}

export default withI18n(BlogPostPage);
