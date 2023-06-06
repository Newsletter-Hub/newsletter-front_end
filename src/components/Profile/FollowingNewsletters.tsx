import { getMySubscriptions } from '@/actions/newsletters';

import { NewslettersListData } from '@/types/newsletters';

import NewslettersList from '../Newsletter/NewsletterList';

interface UserNewslettersProps {
  newslettersListData?: NewslettersListData;
  isProfile?: boolean;
}

const FollowingNewsletters = ({
  newslettersListData,
  isProfile,
}: UserNewslettersProps) => {
  return (
    <div className="pt-8 max-w-[1280px]">
      <h3 className="text-dark-blue text-5xl font-medium mb-8">
        Newsletters Following
      </h3>
      <NewslettersList
        newslettersListData={newslettersListData}
        getNewslettersList={getMySubscriptions}
        isSeparated={false}
        isRated={true}
        isFollowEnable={true}
        isNewsletterFollowed={isProfile}
        type="newsletter"
      />
    </div>
  );
};

export default FollowingNewsletters;
