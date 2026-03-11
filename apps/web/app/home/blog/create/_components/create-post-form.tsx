'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useUser } from '@kit/supabase/hooks/use-user';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Textarea } from '@kit/ui/textarea';
import { Input } from '@kit/ui/input';
import { createBlogPost } from '~/lib/blog/blog';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title is too long'),
  body: z.string().min(1, 'Body is required'),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
  const router = useRouter();
  const supabase = useSupabase();
  const { data: user } = useUser();

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: '', body: '' },
  });

  const onSubmit = async (values: CreatePostFormValues) => {
    const userId = user?.sub;
    if (!userId) {
      toast.error('You must be signed in to create a post.');
      return;
    }

    const { data: { user: fullUser } } = await supabase.auth.getUser();
    const author_name = fullUser?.user_metadata?.name ?? fullUser?.user_metadata?.full_name ?? undefined;
    const author_email = fullUser?.email ?? undefined;

    try {
      const post = await createBlogPost(supabase, {
        title: values.title,
        body: values.body,
        author_id: userId,
        author_name: author_name ?? undefined,
        author_email: author_email ?? undefined,
      });
      toast.success('Post created!');
      router.push(`/blog/${post.id}`);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create post';
      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your post..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Publishing...' : 'Publish'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/blog')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
