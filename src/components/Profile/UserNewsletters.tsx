import { getNewslettersList } from '@/actions/newsletters';

import Link from 'next/link';

import { NewslettersListData } from '@/types/newsletters';

import Button from '../Button';
import NewslettersList from '../Newsletter/NewsletterList';

interface UserNewslettersProps {
  newslettersListData: NewslettersListData;
  isProfile?: boolean;
}

const UserNewsletters = ({
  newslettersListData,
  isProfile,
}: UserNewslettersProps) => {
  return (
    <div className="pt-8 max-w-[1280px]">
      <h3 className="text-dark-blue text-5xl font-medium mb-8">
        Your Newsletters
      </h3>
      <Link href="/newsletters/add">
        <Button
          label="Add a Newsletter"
          rounded="xl"
          fontSize="md"
          customStyles="mb-8"
        />
      </Link>
      <div>
        <NewslettersList
          newslettersListData={newslettersListData}
          getNewslettersList={getNewslettersList}
          isSeparated={false}
          isRated={!isProfile}
          isAuthor={!isProfile}
          isFollowEnable={!isProfile}
          type="newsletter"
        />
      </div>
    </div>
  );
};

export default UserNewsletters;
