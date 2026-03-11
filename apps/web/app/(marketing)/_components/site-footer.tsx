import Link from 'next/link';

import type { JwtPayload } from '@supabase/supabase-js';

import { Trans } from '@kit/ui/trans';

import { BlogAppLogo } from '~/components/blog-app-logo';

export function SiteFooter(props: { user?: JwtPayload | null }) {
  const year = new Date().getFullYear();
  const isSignedIn = !!props.user;

  return (
    <footer className="site-footer mt-auto w-full border-t py-8">
      <div className="container">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <Link href="/" className="inline-block">
              <BlogAppLogo className="h-8 w-auto md:h-9" />
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm">
              <Trans i18nKey="marketing:footerDescription" />
            </p>
            <p className="text-muted-foreground text-xs">
              © {year} <Trans i18nKey="marketing:footerCopyright" />
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-x-6 gap-y-4 md:gap-x-8"
            aria-label="Footer navigation"
          >
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-sm">
                <Trans i18nKey="marketing:blog" />
              </span>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                <Trans i18nKey="marketing:allPosts" />
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-sm">Account</span>
              <div className="flex flex-col gap-1">
                {isSignedIn ? (
                  <>
                    <Link
                      href="/home"
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      <Trans i18nKey="common:routes.home" />
                    </Link>
                    <Link
                      href="/home/blog/create"
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      Create Post
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/sign-in"
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      <Trans i18nKey="auth:signIn" />
                    </Link>
                    <Link
                      href="/auth/sign-up"
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      <Trans i18nKey="auth:signUp" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
