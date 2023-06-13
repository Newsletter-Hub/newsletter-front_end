import React, { ReactNode } from 'react';

import { User } from '@/types/user';

import EntryLayout from './EntryLayout';
import Layout from './Layout';
import GoogleAnalytics from './GoogleAnalytics';

export type LayoutType = 'default' | 'entry';
export type EntryType = 'signup' | 'login' | 'newsletter';

interface WithLayoutProps {
  children?: ReactNode;
  user?: User | null;
  layoutProps?: {
    isFooter?: boolean;
  };
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
    const isFooter = props.layoutProps?.isFooter !== false;
    const LayoutComponent =
      layout === 'default'
        ? (props: WithLayoutProps) => (
            <Layout isFooter={isFooter}>{props.children}</Layout>
          )
        : (props: WithLayoutProps) => (
            <EntryLayout {...entryLayoutConfig}>{props.children}</EntryLayout>
          );

    return (
      <LayoutComponent {...props}>
        <GoogleAnalytics measurementId="G-RFTX5EN20H" />
        <WrappedComponent {...props} />
      </LayoutComponent>
    );
  };

  return WithLayoutComponent;
};

export default withLayout;
