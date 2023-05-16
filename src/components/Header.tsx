import React from 'react';

import Link from 'next/link';

import Logo from '@/assets/images/logo';

import Avatar from './Avatar';
import Button from './Button';
import Input from './Input';

const links = [
  { label: 'Newsletters', href: '/newsletters/all' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
  { label: 'Help', href: '/help' },
];

interface UserMe {
  profileType: 'writter' | 'reader';
  username: string;
  email: string;
  avatar?: string;
  error?: string;
}

interface HeaderProps {
  user?: UserMe | null;
}

const Header = ({ user }: HeaderProps) => {
  return (
    <div className="shadow-md">
      <div className="bg-white py-4 px-32 flex items-center font-inter">
        <div className="mr-24">
          <Logo />
        </div>
        <div className="flex gap-12 text-lg items-center mr-24">
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
        {user?.error || !user ? (
          <div className="flex gap-6 w-full items-center">
            <Link href="/login">Login</Link>
            <Link href="/sign-up">
              <Button label="Sign up" fontSize="base" rounded="xl" />
            </Link>
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="max-w-[80px] text-right">
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
              className="rounded-full max-h-[48px] border-2 border-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
