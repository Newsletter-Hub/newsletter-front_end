import { getServerSideSitemapLegacy, ISitemapField } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { getNewslettersList } from '@/actions/newsletters';
import { getCategories } from '@/actions/user/interests';

export const getServerSideProps: GetServerSideProps = async ctx => {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')
  const newsletterListResponse = await getNewslettersList({
    order: 'date',
    orderDirection: 'ASC',
  });
  const newsletterListData = newsletterListResponse.newslettersListData;
  const newsletters = newsletterListData?.newsletters || [];
  const categories = await getCategories();

  const fields: ISitemapField[] = [];

  newsletters.map(newsletter => {
    const page = {
      loc: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletters/${newsletter.id}`,
      lastmod: new Date().toISOString(),
    };

    fields.push(page);
  });

  if (categories instanceof Array) {
    categories.map(category => {
      const page = {
        loc: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletters/categories/${category.id}`,
        lastmod: new Date().toISOString(),
      };

      fields.push(page);
    });
  }

  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Sitemap() {}
