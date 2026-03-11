import Link from 'next/link';

import { ArrowRightIcon, BookOpen } from 'lucide-react';

import { CtaButton, Hero } from '@kit/ui/marketing';
import { Trans } from '@kit/ui/trans';

import { withI18n } from '~/lib/i18n/with-i18n';

function Home() {
  return (
    <div className="mt-4 flex flex-col py-14">
      <div className="container mx-auto">
        <Hero
          title={
            <>
              <span>Welcome to the Blog</span>
            </>
          }
          subtitle={
            <span>
              Read posts and share your own. Sign in to create a post.
            </span>
          }
          cta={<MainCallToActionButtons />}
        />
      </div>
    </div>
  );
}

export default withI18n(Home);

function MainCallToActionButtons() {
  return (
    <div className="flex flex-wrap gap-4">
      <CtaButton>
        <Link href="/blog">
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Read Blog</span>
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </Link>
      </CtaButton>
      <CtaButton variant="outline">
        <Link href="/auth/sign-in">
          <Trans i18nKey="auth:signIn" />
        </Link>
      </CtaButton>
      <CtaButton variant="link">
        <Link href="/auth/sign-up">
          <Trans i18nKey="common:getStarted" />
        </Link>
      </CtaButton>
    </div>
  );
}
