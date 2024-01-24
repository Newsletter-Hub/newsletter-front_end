import { getServerSideSitemapLegacy, ISitemapField } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { getNewslettersList } from '@/actions/newsletters';
import { getInterests } from '@/actions/user/interests';

export const getServerSideProps: GetServerSideProps = async ctx => {
  // Note if we have over 5000 newsletters, we should create an index server sitemap
  const newsletterListResponse = await getNewslettersList({
    page: 1,
    pageSize: 25,
    order: 'date',
    orderDirection: 'ASC',
  });
  const newsletterListData = newsletterListResponse.newslettersListData;
  const newsletters = newsletterListData?.newsletters || [];
  const interests = await getInterests();

  const fields: ISitemapField[] = [];

  newsletters.forEach(newsletter => {
    const page = {
      loc: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletters/${newsletter.id}`,
      lastmod: new Date().toISOString(),
    };
    fields.push(page);
  });

  if (interests instanceof Array) {
    interests.forEach(interest => {
      let interestName = interest.interestName;
      if (interestName.includes('&')) {
        interestName = escapeAmpersandsForXML(interestName);
      }
      const page = {
        loc: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletters/categories/${interestName}`,
        lastmod: new Date().toISOString(),
      };

      fields.push(page);
    });
  }

  return getServerSideSitemapLegacy(ctx, fields);
};

const escapeAmpersandsForXML = (str: string) => {
  return str.replace(/&/g, '&amp;');
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Sitemap() {}
