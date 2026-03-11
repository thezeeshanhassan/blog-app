import Link from 'next/link';

import { Button } from '@kit/ui/button';

export function BlogPagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
}: {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}) {
  return (
    <nav
      className="flex items-center justify-center gap-4"
      aria-label="Blog pagination"
    >
      {hasPreviousPage ? (
        <Button asChild variant="outline" size="sm">
          <Link href={currentPage === 2 ? '/blog' : `/blog?page=${currentPage - 1}`}>
            Previous
          </Link>
        </Button>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">Page {currentPage}</span>
      {hasNextPage ? (
        <Button asChild variant="outline" size="sm">
          <Link href={`/blog?page=${currentPage + 1}`}>
            Next
          </Link>
        </Button>
      ) : (
        <span />
      )}
    </nav>
  );
}
