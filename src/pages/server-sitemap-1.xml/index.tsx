import { getServerSideSitemapLegacy, ISitemapField } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { getNewslettersList } from '@/actions/newsletters';

export const getServerSideProps: GetServerSideProps = async ctx => {
  const newsletterListResponse = await getNewslettersList({
    page: 1,
    pageSize: 50,
    order: 'date',
    orderDirection: 'ASC',
  });
  const newsletterListData = newsletterListResponse.newslettersListData;
  const newsletters = newsletterListData?.newsletters || [];

  const fields: ISitemapField[] = [];

  newsletters.forEach(newsletter => {
    const page = {
      loc: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletters/${newsletter.id}`,
      lastmod: new Date().toISOString(),
    };
    fields.push(page);
  });

  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Sitemap() {}
