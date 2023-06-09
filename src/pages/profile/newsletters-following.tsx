import { getMyNewsletterSubscriptions } from '@/actions/newsletters';

import { NewslettersListData } from '@/types/newsletters';

import NewslettersList from '@/components/Newsletter/NewsletterList';
import parseCookies from 'next-cookies';
import { GetServerSideProps } from 'next';

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
      getNewslettersList={getMyNewsletterSubscriptions}
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
  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : null;

  const followingNewsletterList = await getMyNewsletterSubscriptions({
    entity: 'Newsletter',
    page: 1,
    pageSize: 6,
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
