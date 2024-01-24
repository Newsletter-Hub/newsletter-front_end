import { getServerSideSitemapLegacy, ISitemapField } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { getNewslettersList } from '@/actions/newsletters';

export const getServerSideProps: GetServerSideProps = async ctx => {
  const newsletterListResponse = await getNewslettersList({
    order: 'date',
    orderDirection: 'DESC',
  });
  const newsletterListData = newsletterListResponse.newslettersListData;
  const newsletters = newsletterListData?.newsletters || [];
  const latestNewsletterId = newsletters[0]?.id || 0;
  const defaultLastmod = new Date().toISOString();
  const fields: ISitemapField[] = [];

  for (let i = 1; i <= latestNewsletterId; i++) {
    fields.push({
      loc: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletters/${i}`,
      lastmod: defaultLastmod,
    });
  }

  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Sitemap() {}
