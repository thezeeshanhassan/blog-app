import type { JwtPayload } from '@supabase/supabase-js';

import { Header } from '@kit/ui/marketing';

import { BlogAppLogo } from '~/components/blog-app-logo';

import { SiteHeaderAccountSection } from './site-header-account-section';
import { SiteNavigation } from './site-navigation';

export function SiteHeader(props: { user?: JwtPayload | null }) {
  return (
    <Header
      logo={<BlogAppLogo />}
      navigation={<SiteNavigation />}
      actions={<SiteHeaderAccountSection user={props.user ?? null} />}
    />
  );
}
