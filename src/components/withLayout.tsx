import React, { ReactNode } from 'react';

import { UserMe } from '@/types/user';

import EntryLayout from './EntryLayout';
import Layout from './Layout';

export type LayoutType = 'default' | 'entry';
export type EntryType = 'signup' | 'login' | 'newsletter';

interface WithLayoutProps {
  children?: ReactNode;
  user?: UserMe | null;
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
