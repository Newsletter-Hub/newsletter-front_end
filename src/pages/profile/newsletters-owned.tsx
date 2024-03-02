import { getNewslettersList } from '@/actions/newsletters';

import { NewslettersListData } from '@/types/newsletters';
import { User } from '@/types/user';

import NewslettersList from '@/components/Newsletter/NewsletterList';
import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

interface UserNewslettersProps {
  newslettersListData?: NewslettersListData;
  isProfile?: boolean;
  user: User;
}

const NewslettersOwned = ({
  newslettersListData,
  isProfile,
  user,
}: UserNewslettersProps) => {
  return (
    <NewslettersList
      newslettersListData={newslettersListData}
      getNewslettersList={getNewslettersList}
      isSeparated={false}
      isRated={false}
      isFollowEnable={false}
      isNewsletterFollowed={isProfile}
      type="newsletter"
      title={user ? 'Your Newsletters' : 'Newsletters Owned'}
      authorId={user.id}
      layout="owned_newsletters"
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const user =
    context.req.cookies.user && JSON.parse(context.req.cookies.user as string);
  const userId = user?.id;
  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : null;
  const newsletterList = await getNewslettersList({
    page: 1,
    pageSize: 6,
    order: 'date',
    orderDirection: 'DESC',
    categoriesIds: [],
    authorId: userId,
    token,
  });

  if (!newsletterList || !user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      newslettersListData: newsletterList.newslettersListData || null,
      user: user,
      isProfile: true,
    },
  };
};

export default NewslettersOwned;
