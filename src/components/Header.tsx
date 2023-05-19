import Cookies from 'js-cookie';
import React from 'react';

import Link from 'next/link';

import { UserMe } from '@/types/user';

import ArrowDownIcon from '@/assets/icons/arrowDown';
import BookmarkIcon from '@/assets/icons/bookmark';
import LogoutIcon from '@/assets/icons/logout';
import ProfileIcon from '@/assets/icons/profile';
import SettingsIcon from '@/assets/icons/settings';
import Logo from '@/assets/images/logo';

import Avatar from './Avatar';
import Button from './Button';
import Input from './Input';
import Popover from './Popover';

const links = [
  { label: 'Newsletters', href: '/newsletters/categories/all' },
  { label: 'Categories', href: '/newsletters/categories' },
  { label: 'Users', href: '/users' },
  { label: 'Help', href: '/help' },
];

const Header = () => {
  const [user, setUser] = React.useState<UserMe | ''>('');

  React.useEffect(() => {
    const cookieUser = Cookies.get('user')
      ? JSON.parse(Cookies.get('user') as string)
      : '';
    setUser(cookieUser);
  }, []);
  const logout = () => {
    Cookies.remove('user');
    Cookies.remove('token');
    setUser('');
  };
  return (
    <div className="shadow-md py-4">
      <div className="bg-white flex items-center justify-center font-inter gap-24 w-full">
        <div>
          <Logo />
        </div>
        <div className="flex gap-12 text-lg items-center">
          {links.map((link, index) => {
            return (
              <React.Fragment key={index}>
                {index === 2 && (
                  <Input placeholder="Search Newsletter Hub" isSearch />
                )}
                <Link href={link.href}>{link.label}</Link>
              </React.Fragment>
            );
          })}
        </div>
        {!user ? (
          <div className="flex gap-6 items-center">
            <Link href="/login">Login</Link>
            <Link href="/sign-up">
              <Button label="Sign up" fontSize="base" rounded="xl" />
            </Link>
          </div>
        ) : (
          <Popover
            triggerStyles=""
            triggerContent={
              <div className="flex items-center">
                <div className="max-w-[80px] text-right mr-3">
                  <span className="text-lg whitespace-nowrap block overflow-hidden text-ellipsis font-semibold text-lightBlack">
                    {user.username}
                  </span>
                  <span className="text-grey-chat text-sm">
                    ({user.profileType})
                  </span>
                </div>
                <Avatar
                  alt="avatar"
                  width={48}
                  height={48}
                  username={user.username}
                  customStyles="p-3"
                  src={user.avatar}
                  className="rounded-full max-h-[48px] border-2 border-primary mr-2"
                />
                <div>
                  <ArrowDownIcon />
                </div>
              </div>
            }
          >
            <div className="p-4 w-[275px] box-border">
              <div className="pb-4 border-b border-b-porcelain">
                <Link
                  href="/profile"
                  className="flex gap-3 items-center text-dark-blue text-base p-2 mb-1"
                >
                  <div className="w-6 h-6">
                    <ProfileIcon />
                  </div>
                  My profile
                </Link>
                <Link
                  href="/bookmarks"
                  className="flex gap-3 items-center text-dark-blue text-base p-2"
                >
                  <div className="w-6 h-6">
                    <BookmarkIcon />
                  </div>
                  Bookmarks
                </Link>
              </div>
              <div className="pt-4">
                <Link
                  href="/profile/settings"
                  className="flex gap-3 items-center text-dark-blue text-base p-2 mb-1"
                >
                  <div className="w-6 h-6">
                    <SettingsIcon />
                  </div>
                  Account settings
                </Link>
                <span
                  className="flex gap-3 items-center text-dark-blue text-base p-2 mb-1 cursor-pointer"
                  onClick={logout}
                >
                  <div className="w-6 h-6">
                    <LogoutIcon />
                  </div>
                  Logout
                </span>
              </div>
            </div>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default Header;
