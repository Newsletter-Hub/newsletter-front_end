import { getNewslettersList } from '@/actions/newsletters';

import Link from 'next/link';

import { NewslettersListData } from '@/types/newsletters';
import { UserMe } from '@/types/user';

import Button from '../Button';
import NewslettersList from '../Newsletter/NewsletterList';

interface UserNewslettersProps {
  newslettersListData: NewslettersListData;
  isProfile?: boolean;
  user: UserMe;
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
        <Link href="/newsletters/add">
          <Button
            label="Add a Newsletter"
            rounded="xl"
            fontSize="md"
            customStyles="mb-8"
          />
        </Link>
      )}
      <div>
        <NewslettersList
          newslettersListData={newslettersListData}
          getNewslettersList={getNewslettersList}
          isSeparated={false}
          isRated={!isProfile}
          isAuthor={!isProfile}
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
