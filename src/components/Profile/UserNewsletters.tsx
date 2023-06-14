import { getNewslettersList } from '@/actions/newsletters';

import Link from 'next/link';

import { NewslettersListData } from '@/types/newsletters';
import { User } from '@/types/user';

import Button from '../Button';
import NewslettersList from '../Newsletter/NewsletterList';

interface UserNewslettersProps {
  newslettersListData: NewslettersListData;
  isProfile?: boolean;
  user: User;
}

const UserNewsletters = ({
  newslettersListData,
  isProfile,
  user,
}: UserNewslettersProps) => {
  const userId = user && user.id ? +user.id : undefined;
  return (
    <div className="pt-8 max-w-[1280px]">
      <h3 className="text-dark-blue text-5xl font-medium mb-8">
        {isProfile ? 'Your Newsletters' : `${user.username} Newsletters`}
      </h3>
      {isProfile && (
        <div className="w-fit">
          <Link href="/newsletters/add">
            <Button
              label="Add a Newsletter"
              rounded="xl"
              fontSize="md"
              customStyles="mb-8"
            />
          </Link>
        </div>
      )}
      <div>
        <NewslettersList
          newslettersListData={newslettersListData}
          getNewslettersList={getNewslettersList}
          isSeparated={false}
          isRated={!isProfile}
          isFollowEnable={!isProfile}
          type="newsletter"
          authorId={userId}
          defaultSortType="date"
        />
      </div>
    </div>
  );
};

export default UserNewsletters;
