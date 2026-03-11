import { cn } from '@kit/ui/utils';

export function BlogAppLogo({ className }: { className?: string }) {
  return (
    <span
      aria-label="Blog – Home"
      className={cn('font-heading text-xl font-semibold tracking-tight', className)}
    >
      Blog
    </span>
  );
}
