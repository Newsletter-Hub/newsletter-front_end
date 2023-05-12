import React, { ReactNode } from 'react';

import { NewslettersListData } from '@/pages/newsletters';

import { Interest } from '@/types/interests';
import { NewsletterData } from '@/types/newsletters';
import { UserMe } from '@/types/user';

import EntryLayout from './EntryLayout';
import Layout from './Layout';

type LayoutType = 'default' | 'entry';
type EntryType = 'signup' | 'login' | 'newsletter';

interface WithLayoutProps {
  children?: ReactNode;
  interests?: Interest[];
  newsletterData?: NewsletterData;
  user?: UserMe | null;
  newslettersListData?: NewslettersListData;
}

interface EntryLayoutConfig {
  type: EntryType;
}

const withLayout = (
  WrappedComponent: React.ComponentType<WithLayoutProps>,
  layout: LayoutType = 'default',
  entryLayoutConfig?: EntryLayoutConfig
) => {
  const WithLayoutComponent = (props: WithLayoutProps) => {
    const LayoutComponent =
      layout === 'default'
        ? (props: WithLayoutProps) => (
            <Layout user={props.user}>{props.children}</Layout>
          )
        : (props: WithLayoutProps) => (
            <EntryLayout {...entryLayoutConfig}>{props.children}</EntryLayout>
          );

    return (
      <LayoutComponent {...props}>
        <WrappedComponent {...props} />
      </LayoutComponent>
    );
  };

  return WithLayoutComponent;
};

export default withLayout;
