import { getNewsletterSubscriptions } from '@/actions/newsletters';

import { NewslettersListData } from '@/types/newsletters';

import NewslettersList from '@/components/Newsletter/NewsletterList';
import parseCookies from 'next-cookies';
import { GetServerSideProps } from 'next';
import { useUser } from '@/contexts/UserContext';

interface UserNewslettersProps {
  newslettersListData?: NewslettersListData;
  isProfile?: boolean;
}

const FollowingNewsletters = ({
  newslettersListData,
  isProfile,
}: UserNewslettersProps) => {
  const { user } = useUser();
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
      authorId={user?.id}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const user = JSON.parse(context.req.cookies.user as string);
  const userId = user.id;
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
