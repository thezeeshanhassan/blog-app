import Link from 'next/link';

import { PageBody, PageHeader } from '@kit/ui/page';
import { Button } from '@kit/ui/button';

import { CreatePostForm } from './_components/create-post-form';

export const metadata = {
  title: 'Create Post',
  description: 'Write a new blog post',
};

export default function CreatePostPage() {
  return (
    <>
      <PageHeader
        title="Create Post"
        description="Write a new blog post. Your name will be set as the author."
      />
      <PageBody>
        <div className="max-w-2xl">
          <CreatePostForm />
          <div className="mt-6">
            <Button asChild variant="link" size="sm">
              <Link href="/blog">← Back to Blog</Link>
            </Button>
          </div>
        </div>
      </PageBody>
    </>
  );
}
