import { getServerSideSitemapLegacy, ISitemapField } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { getInterests } from '@/actions/user/interests';

export const getServerSideProps: GetServerSideProps = async ctx => {
  const interests = await getInterests();
  const defaultLastmod = new Date().toISOString();

  const fields: ISitemapField[] = [];

  fields.push({
    loc: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletters/categories/all`,
    lastmod: defaultLastmod,
  });

  if (interests instanceof Array) {
    interests.forEach(interest => {
      let interestName = interest.interestName;
      if (interestName.includes('&')) {
        interestName = escapeAmpersandsForXML(interestName);
      }
      const page = {
        loc: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletters/categories/${interestName}`,
        lastmod: defaultLastmod,
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
