import { logout } from '@/actions/auth';
import {
  GlobalSearchPayload,
  GlobalSearchResponse,
  search,
} from '@/actions/global';
import { useUser } from '@/contexts/UserContext';
import { debounce } from 'lodash';
import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useOnClickOutside } from 'usehooks-ts';

import { Alegreya } from 'next/font/google';
import Link from 'next/link';

import ArrowDownIcon from '@/assets/icons/arrowDown';
import BookmarkIcon from '@/assets/icons/bookmark';
import OwnerIcon from '@/assets/icons/owner';
import LogoutIcon from '@/assets/icons/logout';
import ProfileIcon from '@/assets/icons/profile';
import SearchResultsIcon from '@/assets/icons/searchResults';
import SettingsIcon from '@/assets/icons/settings';
import Logo from '@/assets/images/logo';

import Avatar from './Avatar';
import Button from './Button';
import Input from './Input';
import BurgerMenu from './Mobile/BurgerMenu';
import Popover from './Popover';
import SkeletonImage from './SkeletonImage';

const alegreya = Alegreya({ subsets: ['latin'] });

const Header = () => {
  const { user, setUser } = useUser();

  const links = [
    { label: 'Newsletters', href: '/newsletters/categories/all' },
    { label: 'Categories', href: '/newsletters/categories' },
    { label: 'Users', href: '/users' },
    {
      label: 'Add Newsletter',
      href: `/${user ? 'newsletters/add' : 'sign-up'}`,
      subLinks: [
        {
          label: 'Add Newsletter',
          href: `/${user ? 'newsletters/add' : 'sign-up'}`,
        },
        {
          label: 'Claim Newsletter',
          href: `/${user ? 'newsletters/claim' : 'sign-up'}`,
        },
      ],
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResult, setShowSearchResults] = useState(false);
  const searchResultRef = useRef(null);
  const searchPayload: GlobalSearchPayload = { search: searchTerm };
  const executeQuery = searchTerm !== '';

  const { data } = useQuery<GlobalSearchResponse | undefined, Error>(
    ['globalSearch', searchPayload],
    () => search(searchPayload),
    {
      enabled: executeQuery,
    }
  );

  const handleChangeSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 500);

  const handleClickOutside = () => {
    setShowSearchResults(false);
  };
  useOnClickOutside(searchResultRef, handleClickOutside);
  return (
    <div className="sticky top-0 z-50 shadow-md py-4 bg-white">
      <div className="flex items-center justify-between font-inter xl:gap-24 lg:gap-10 w-full px-2 lg:px-5">
        <div className="hidden lg:block">
          <Logo className="max-w-200px" />
        </div>
        <div className="flex xl:gap-12 lg:gap-5 text-lg items-center">
          {links.map((link, index) => {
            return (
              <React.Fragment key={index}>
                {index === 2 && (
                  <div
                    ref={searchResultRef}
                    className="relative"
                    onClick={() => setShowSearchResults(true)}
                  >
                    <Input
                      placeholder="Search Newsletter Hub"
                      isSearch
                      onChange={e => handleChangeSearch(e.target.value)}
                      customStyles="xl:min-w-[400px] md:min-w-[450px] lg:min-w-[350px] max-w-[200px]"
                    />
                    {showSearchResult && data && (
                      <div className="bg-white absolute md:w-full top-10 shadow-md border-t border-t-light-grey rounded-lg p-2 w-[95vw] z-10">
                        {Boolean(data?.newsletters?.length) && (
                          <div>
                            <div className="flex justify-between items-center">
                              <span
                                className={`${alegreya.className} text-dark-blue font-medium xl:text-xl text-md`}
                              >
                                Newsletters
                              </span>
                              <Link
                                href={`/newsletters/categories/all?search=${searchTerm}`}
                                className="xl:text-sm text-xs border-b border-b-dark-grey font-semibold hover:border-b-primary"
                              >
                                View all Newsletter results
                              </Link>
                            </div>
                            <div>
                              {data.newsletters.map(item => (
                                <Link
                                  href={`/newsletters/${item.id}`}
                                  key={item.id}
                                  className="mb-2 flex gap-2 rounded-lg hover:bg-light-porcelain p-2 items-center"
                                >
                                  <div>
                                    <SkeletonImage
                                      src={
                                        (item?.image as string) ||
                                        'https://i.imgur.com/kZMNj7Q.jpeg'
                                      }
                                      width={48}
                                      height={48}
                                      style={{ width: 48, height: 48 }}
                                      alt="Newsletter image"
                                      className="rounded-[10px] w-[48px] h-[48px] object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-dark-blue text-xs font-semibold">
                                      {item.newsletterAuthor}
                                    </p>
                                    <p className="text-dark-blue font-semibold text-base">
                                      {item.title}
                                    </p>
                                    <p className="text-dark-grey text-sm whitespace-nowrap overflow-hidden xs:max-w-[275px] sm:max-w-[300px] md:max-w-[350px] max-w-[200px] lg:max-w-[200px] text-ellipsis">
                                      {item.description}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        {Boolean(data?.users?.length) && (
                          <div>
                            <div className="flex justify-between items-center">
                              <span
                                className={`${alegreya.className} text-dark-blue font-medium xl:text-xl text-md`}
                              >
                                Users
                              </span>
                              <Link
                                href={`/users?search=${searchTerm}`}
                                className="xl:text-sm text-xs border-b border-b-dark-grey font-semibold hover:border-b-primary"
                              >
                                View all User results
                              </Link>
                            </div>
                            <div>
                              {data.users.map(item => (
                                <Link
                                  href={`/users/${item.id}`}
                                  key={item.id}
                                  className="mb-2 flex gap-2 rounded-lg hover:bg-light-porcelain p-2 items-center"
                                >
                                  <Avatar
                                    src={item?.avatar}
                                    username={item.username}
                                    width={48}
                                    height={48}
                                    alt="Newsletter image"
                                    className="rounded-[10px] w-12 h-12 min-w-[48px] object-cover"
                                  />
                                  <div>
                                    <p className="text-dark-blue font-semibold text-base">
                                      {item.username}
                                    </p>
                                    <p className="text-dark-grey text-sm whitespace-nowrap overflow-hidden xs:max-w-[280px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[270px] xl:max-w-[320px] max-w-[230px] text-ellipsis">
                                      {item.description}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        {!data.users.length && !data.newsletters.length && (
                          <div className="flex flex-col items-center text-center">
                            <SearchResultsIcon />
                            <span className="text-2xl text-dark-blue">
                              Sorry! We couldn’t find anything
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {link.subLinks ? (
                  <Popover
                    triggerStyles="hidden lg:flex"
                    customWrapperStyles="mr-2"
                    triggerContent={
                      <div className="lg:flex items-center">
                        <div>
                          <span className="hidden lg:block">{link.label}</span>
                        </div>
                        <div className="ml-2">
                          <ArrowDownIcon />
                        </div>
                      </div>
                    }
                  >
                    <div className="p-4 box-border">
                      <div>
                        {link.subLinks.map(subLink => (
                          <Link
                            href={subLink.href}
                            key={subLink.href}
                            className="flex gap-3 items-center text-dark-blue text-base p-2 hidden lg:block "
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </Popover>
                ) : (
                  <Link href={link.href} className="hidden lg:block">
                    {link.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="lg:hidden">
          <BurgerMenu>
            {!user ? (
              <div>
                <div className="flex flex-col gap-3 border-b border-b-light-grey pb-3 mb-3">
                  {links.map(link => (
                    <Link href={link.href} key={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="flex items-center w-full justify-between">
                  <Link href="/login">Login</Link>
                  <Link href="/sign-up">
                    <Button label="Sign up" fontSize="base" rounded="xl" />
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex mb-3 items-center">
                  <Avatar
                    alt="avatar"
                    width={48}
                    height={48}
                    username={user.username}
                    customStyles="p-3"
                    src={user.avatar}
                    className="rounded-full h-12 w-12 border-2 border-primary"
                  />
                  <div className="ml-3">
                    <span className="text-lg whitespace-nowrap block overflow-hidden text-ellipsis font-semibold text-lightBlack">
                      {user.username}
                    </span>
                    <span className="text-grey-chat text-sm">
                      (
                      {user.profileType.charAt(0).toUpperCase() +
                        user.profileType.slice(1)}
                      )
                    </span>
                  </div>
                </div>
                <div className="mb-3 border-b border-b-porcelain">
                  <div className="pb-2 border-b border-b-porcelain">
                    <Link
                      href="/profile"
                      className="flex gap-3 items-center text-dark-blue text-sm p-2"
                    >
                      <div className="w-6 h-6">
                        <ProfileIcon className="!w-5" />
                      </div>
                      My Profile
                    </Link>
                    <Link
                      href="/profile/newsletters-owned"
                      className="flex gap-3 items-center text-dark-blue text-sm p-2"
                    >
                      <div className="w-6 h-6">
                        <OwnerIcon className="!w-5" />
                      </div>
                      My Newsletters
                    </Link>
                    <Link
                      href="/profile/bookmarks"
                      className="flex gap-3 items-center text-dark-blue text-sm p-2"
                    >
                      <div className="w-6 h-6">
                        <BookmarkIcon className="!w-4" />
                      </div>
                      Bookmarks
                    </Link>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/profile/settings"
                      className="flex gap-3 items-center text-dark-blue text-sm p-2 mb-1"
                    >
                      <div className="w-6 h-6">
                        <SettingsIcon className="!w-5" />
                      </div>
                      Account Settings
                    </Link>
                    <span
                      className="flex gap-3 items-center text-dark-blue text-sm p-2 mb-1 cursor-pointer hover:text-primary"
                      onClick={() => logout({ setUser })}
                    >
                      <div className="w-6 h-6">
                        <LogoutIcon className="!w-5" />
                      </div>
                      Logout
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {links.map(link => (
                    <>
                      {link.subLinks ? (
                        link.subLinks.map(subLink => (
                          <Link href={subLink.href} key={subLink.href}>
                            {subLink.label}
                          </Link>
                        ))
                      ) : (
                        <Link href={link.href} key={link.href}>
                          {link.label}
                        </Link>
                      )}
                    </>
                  ))}
                </div>
              </div>
            )}
          </BurgerMenu>
        </div>
        {!user ? (
          <div className="lg:flex gap-6 items-center hidden">
            <Link href="/login">Login</Link>
            <Link href="/sign-up">
              <Button label="Sign up" fontSize="base" rounded="xl" />
            </Link>
          </div>
        ) : (
          <Popover
            triggerStyles="hidden lg:flex"
            customWrapperStyles="mr-2"
            triggerContent={
              <div className="lg:flex items-center">
                <div className="max-w-[80px] text-right mr-3">
                  <span className="text-lg whitespace-nowrap block overflow-hidden text-ellipsis font-semibold text-lightBlack">
                    {user.username}
                  </span>
                  <span className="text-grey-chat text-sm">
                    (
                    {user.profileType.charAt(0).toUpperCase() +
                      user.profileType.slice(1)}
                    )
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
                <div className="ml-2">
                  <ArrowDownIcon />
                </div>
              </div>
            }
          >
            <div className="p-4 w-[275px] box-border">
              <div className="pb-4 border-b border-b-porcelain">
                <Link
                  href="/profile"
                  className="flex gap-3 items-center text-dark-blue text-base p-2"
                >
                  <div className="w-6 h-6">
                    <ProfileIcon />
                  </div>
                  My Profile
                </Link>
                <Link
                  href="/profile/newsletters-owned"
                  className="flex gap-3 items-center text-dark-blue text-base p-2"
                >
                  <div className="w-6 h-6">
                    <OwnerIcon />
                  </div>
                  My Newsletters
                </Link>
                <Link
                  href="/profile/bookmarks"
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
                  Account Settings
                </Link>
                <span
                  className="flex gap-3 items-center text-dark-blue text-base p-2 mb-1 cursor-pointer hover:text-primary"
                  onClick={() => logout({ setUser })}
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
