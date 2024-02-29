import { getNewslettersList } from '@/actions/newsletters';
import { getUserById } from '@/actions/user';

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
      isSeparated={true}
      isRated={true}
      isFollowEnable={true}
      isNewsletterFollowed={isProfile}
      type="newsletter"
      title={
        user ? `Newsletters Owned By ${user.username}` : 'Newsletters Owned'
      }
      authorId={user?.id}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const userId = Number(context.query.userId);
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
  const user = await getUserById({ token, userId });

  if (!newsletterList || !user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      newslettersListData: newsletterList.newslettersListData || null,
      user: user.response,
    },
  };
};

export default NewslettersOwned;
