import { logout } from '@/actions/auth';
import {
  GlobalSearchPayload,
  GlobalSearchResponse,
  search,
} from '@/actions/global';
import { useUser } from '@/contexts/UserContext';
import Cookies from 'js-cookie';
import { debounce } from 'lodash';
import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useOnClickOutside } from 'usehooks-ts';

import { Alegreya } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import ArrowDownIcon from '@/assets/icons/arrowDown';
import BookmarkIcon from '@/assets/icons/bookmark';
import LogoutIcon from '@/assets/icons/logout';
import ProfileIcon from '@/assets/icons/profile';
import SearchResultsIcon from '@/assets/icons/searchResults';
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

const alegreya = Alegreya({ subsets: ['latin'] });

const Header = () => {
  const { user, setUser } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResult, setShowSearchResults] = useState(false);
  const searchResultRef = useRef(null);
  const searchPayload: GlobalSearchPayload = { search: searchTerm };

  const { data } = useQuery<GlobalSearchResponse | undefined, Error>(
    ['globalSearch', searchPayload],
    () => search(searchPayload),
    {
      enabled: true,
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
                  <div
                    ref={searchResultRef}
                    className="relative"
                    onClick={() => setShowSearchResults(true)}
                  >
                    <Input
                      placeholder="Search Newsletter Hub"
                      isSearch
                      onChange={e => handleChangeSearch(e.target.value)}
                      customStyles="lg:min-w-[400px]"
                    />
                    {showSearchResult && data && (
                      <div className="bg-white absolute w-full top-10 shadow-md border-t border-t-light-grey rounded-lg p-2">
                        {Boolean(data?.newsletters?.length) && (
                          <div>
                            <div className="flex justify-between items-center">
                              <span
                                className={`${alegreya.className} text-dark-blue font-medium text-xl`}
                              >
                                Newsletters
                              </span>
                              <Link
                                href={`/newsletters/categories/all?search=${searchTerm}`}
                                className="text-sm border-b border-b-dark-grey font-semibold"
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
                                  <Image
                                    src={(item?.image as string) || ''}
                                    width={48}
                                    height={48}
                                    alt="Newsletter image"
                                    className="rounded-[10px] w-12 h-12 object-cover"
                                  />
                                  <div>
                                    <p className="text-dark-blue text-xs font-semibold">
                                      {item.newsletterAuthor}
                                    </p>
                                    <p className="text-dark-blue font-semibold text-base">
                                      {item.title}
                                    </p>
                                    <p className="text-dark-grey text-sm whitespace-nowrap overflow-hidden max-w-[300px] text-ellipsis">
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
                                className={`${alegreya.className} text-dark-blue font-medium text-xl`}
                              >
                                Users
                              </span>
                              <Link
                                href={`/users?search=${searchTerm}`}
                                className="text-sm border-b border-b-dark-grey font-semibold"
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
                                  <Image
                                    src={(item?.avatar as string) || ''}
                                    width={48}
                                    height={48}
                                    alt="Newsletter image"
                                    className="rounded-[10px] w-12 h-12 object-cover"
                                  />
                                  <div>
                                    <p className="text-dark-blue font-semibold text-base">
                                      {item.username}
                                    </p>
                                    <p className="text-dark-grey text-sm whitespace-nowrap overflow-hidden max-w-[300px] text-ellipsis">
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
                  Account settings
                </Link>
                <span
                  className="flex gap-3 items-center text-dark-blue text-base p-2 mb-1 cursor-pointer"
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
