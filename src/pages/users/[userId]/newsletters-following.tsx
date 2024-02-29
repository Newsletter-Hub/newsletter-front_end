import { getNewsletterSubscriptions } from '@/actions/newsletters';

import { NewslettersListData } from '@/types/newsletters';

import NewslettersList from '@/components/Newsletter/NewsletterList';
import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';

interface UserNewslettersProps {
  newslettersListData?: NewslettersListData;
  isProfile?: boolean;
}

const FollowingNewsletters = ({
  newslettersListData,
  isProfile,
}: UserNewslettersProps) => {
  return (
    <NewslettersList
      newslettersListData={newslettersListData}
      getNewslettersList={getNewsletterSubscriptions}
      isSeparated={false}
      isRated={true}
      isFollowEnable={true}
      isNewsletterFollowed={isProfile}
      type="newsletter"
      title="Newsletters Following"
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const userId = Number(context.query.userId);
  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : null;
  const followingNewsletterList = await getNewsletterSubscriptions({
    entity: 'Newsletter',
    page: 1,
    pageSize: 6,
    authorId: userId,
    token,
  });

  if (!followingNewsletterList) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      newslettersListData: followingNewsletterList.newslettersListData || null,
    },
  };
};

export default FollowingNewsletters;
