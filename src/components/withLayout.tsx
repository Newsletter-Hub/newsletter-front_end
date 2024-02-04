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
  title = 'Top Newsletters Discovery & Reviews | Join Newsletter Hub Today',
  description = 'Top Newsletters Discovery & Reviews | Join Newsletter Hub Today',
  entryLayoutConfig?: EntryLayoutConfig
) => {
  const WithLayoutComponent = (props: WithLayoutProps) => {
    const isFooter = props.layoutProps?.isFooter !== false;
    const measurementId = process.env.NEXT_PUBLIC_G_MEASUREMENT_ID;
    const LayoutComponent =
      layout === 'default'
        ? (layoutProps: WithLayoutProps) => (
            <Layout isFooter={isFooter} title={title} description={description}>
              {layoutProps.children}
            </Layout>
          )
        : (layoutProps: WithLayoutProps) => (
            <EntryLayout
              {...entryLayoutConfig}
              title={title}
              description={description}
            >
              {layoutProps.children}
            </EntryLayout>
          );

    return (
      <LayoutComponent {...props}>
        <GoogleAnalytics measurementId={measurementId as string} />
        <WrappedComponent {...props} />
      </LayoutComponent>
    );
  };

  return WithLayoutComponent;
};

export default withLayout;
