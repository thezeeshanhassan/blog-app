import Link from 'next/link';

import { BookOpen, PenSquare } from 'lucide-react';

import { PageBody, PageHeader } from '@kit/ui/page';
import { Button } from '@kit/ui/button';

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Quick links for the blog"
      />
      <PageBody>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
            <Link href="/blog">
              <BookOpen className="h-4 w-4" />
              Read Blog
            </Link>
          </Button>
          <Button asChild size="lg" className="flex items-center gap-2">
            <Link href="/home/blog/create">
              <PenSquare className="h-4 w-4" />
              Create Post
            </Link>
          </Button>
        </div>
      </PageBody>
    </>
  );
}
