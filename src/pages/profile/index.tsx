import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { UserMe } from '@/types/user';

import Avatar from '@/components/Avatar';

import BookmarkIcon from '@/assets/icons/bookmark';
import EditIcon from '@/assets/icons/edit';

const ProfilePage = () => {
  const [user, setUser] = useState<UserMe | ''>('');

  useEffect(() => {
    const cookieUser = Cookies.get('user')
      ? JSON.parse(Cookies.get('user') as string)
      : '';
    setUser(cookieUser);
  }, []);
  return (
    <div className="bg-profile bg-cover bg-no-repeat bg-top w-screen pt-20 flex flex-col items-center">
      {user && (
        <>
          <Avatar
            src={user.avatar}
            width={252}
            height={252}
            alt="User avatar"
            className="rounded-full min-h-[252px] object-cover border-[7px] border-primary mb-8"
            username={user.username}
          />
          <h1 className="text-dark-blue text-5xl font-medium">
            {user.username}
          </h1>
          {user.profileType && (
            <p className="mb-[4px] font-inter text-dark-grey text-lg">
              (
              {user.profileType.charAt(0).toUpperCase() +
                user.profileType.slice(1)}
              )
            </p>
          )}
          <p className="text-center max-w-[512px] font-inter text-dark-grey text-sm mb-8">
            I’m passionate about sharing valuable information and insights with
            your readers. I understand the importance of staying up-to-date on
            the latest trends and developments in business field and have a keen
            ability to distill complex concepts into easily digestible pieces of
            content.
          </p>
          <div className="flex gap-6 text-sm font-semibold font-inter items-center text-dark-grey mb-8">
            <span>677K+ Followers</span>
            <div className="w-1.5 h-1.5 bg-light-grey rounded-full"></div>
            <span>170 Following</span>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="profile/settings" className="flex items-center gap-2">
              <EditIcon />
              <span className="font-inter font-semibold text-base text-dark-blue border-b border-b-dark-blue">
                Edit a profile
              </span>
            </Link>
            <Link href="profile/bookmarks" className="flex items-center gap-2">
              <BookmarkIcon />
              <span className="font-inter font-semibold text-base text-dark-blue border-b border-b-dark-blue">
                Bookmarks
              </span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
