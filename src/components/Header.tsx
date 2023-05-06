import React from 'react';

import Link from 'next/link';

import Logo from '@/assets/images/logo';

import Button from './Button';
import Input from './Input';

const links = [
  { label: 'Newsletters', href: '/newsletters' },
  { label: 'Community', href: '/community' },
  { label: 'About', href: '/about' },
  { label: 'Help', href: '/help' },
];

const Header = () => {
  return (
    <div className="shadow-md bg-white py-4 px-32 flex items-center font-inter">
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
      <div className="flex gap-6 w-full items-center">
        <Link href="/login">Login</Link>
        <Link href="/sign-up">
          <Button label="Sign up" fontSize="base" rounded="xl" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
