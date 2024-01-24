import { getServerSideSitemapIndexLegacy } from 'next-sitemap';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ctx => {
  return getServerSideSitemapIndexLegacy(ctx, [
    `${process.env.NEXT_PUBLIC_BASE_URL}/server-sitemap-0.xml`,
    `${process.env.NEXT_PUBLIC_BASE_URL}/server-sitemap-1.xml`,
  ]);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SitemapIndex() {}
