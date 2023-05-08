import React, { ReactNode } from 'react';

import { Interest } from '@/types/interests';
import { NewsletterData } from '@/types/newsletters';

import EntryLayout from './EntryLayout';
import Layout from './Layout';

type LayoutType = 'default' | 'entry';
type EntryType = 'signup' | 'login' | 'newsletter';

interface WithLayoutProps {
  children?: ReactNode;
  interests?: Interest[];
  newsletterData?: NewsletterData;
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
        ? Layout
        : (props: WithLayoutProps) => (
            <EntryLayout {...entryLayoutConfig}>{props.children}</EntryLayout>
          );

    return (
      <LayoutComponent>
        <WrappedComponent {...props} />
      </LayoutComponent>
    );
  };

  return WithLayoutComponent;
};

export default withLayout;
