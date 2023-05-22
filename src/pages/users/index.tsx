import { getUsersList } from '@/actions/user';
import { debounce } from 'lodash';
import React, { useState } from 'react';

import { GetServerSideProps } from 'next';

import { SortType } from '@/types/sorting';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Popover from '@/components/Popover';

import CheckIcon from '@/assets/icons/check';
import PlusIcon from '@/assets/icons/plus';
import SearchResultsIcon from '@/assets/icons/searchResults';
import SortIcon from '@/assets/icons/sort';

const sortTypes: SortType[] = [
  {
    label: 'Data joined',
    value: 'dataJoined',
  },
  // {
  //   label: 'Number of followers',
  //   value: 'followers',
  // },
  {
    label: 'Number of reviews',
    value: 'numberOfReviews',
  },
];

interface User {
  id: number;
  avatar: string;
  username: string;
}

interface UsersList {
  users: User[];
  total: number;
  nextPage: number;
}

interface UsersListProps {
  usersList: UsersList;
}

const UsersList = ({ usersList }: UsersListProps) => {
  const [choosedSortType, setChoosedSortType] = useState(0);
  const [page, setPage] = useState(1);
  const [usersData, setUsersData] = useState(usersList);
  const [search, setSearch] = useState('');

  const handleChangeSearch = debounce(async (value: string) => {
    setSearch(value);
    const usersListResponse = await getUsersList({
      page: 1,
      pageSize: 6 * page,
      order: sortTypes[choosedSortType].value,
      orderDirection: 'ASC',
      search: value,
    });
    if (usersListResponse) {
      setUsersData(usersListResponse as UsersList);
    }
  }, 500);

  const handleSort = async (value: number) => {
    setChoosedSortType(value);
    const usersListResponse = await getUsersList({
      page: 1,
      pageSize: 6 * page,
      order: sortTypes[value].value,
      orderDirection: 'ASC',
      search,
    });
    if (usersListResponse) {
      setUsersData(usersListResponse as UsersList);
    }
  };
  const loadMoreUsers = async () => {
    setPage(prevPage => prevPage + 1);

    const usersListResponse = await getUsersList({
      page: 1,
      pageSize: 9 * (page + 1),
      order: sortTypes[choosedSortType].value,
      orderDirection: 'ASC',
    });

    if (usersListResponse) {
      setUsersData(usersListResponse as UsersList);
    }
  };
  return (
    <div className="flex justify-center items-center flex-col pt-20 px-[17%]">
      <div className="max-w-[1280px]">
        <h1 className="text-dark-blue text-7xl font-medium mb-10">Users</h1>
        <div className="flex mb-10 items-center min-w-[500px] md:min-w-[950px] justify-between">
          <Input
            isSearch
            placeholder="Search Newsletter Hub"
            wrapperStyles="max-w-[262px]"
            customStyles="h-[48px]"
            iconStyles="!top-3"
            onChange={e => handleChangeSearch(e.target.value)}
          />
          <Popover
            triggerContent={
              <span className="flex text-base justify-center items-center px-6 py-3 gap-4">
                {sortTypes[choosedSortType].label}
                <SortIcon />
              </span>
            }
          >
            <div className="flex flex-col gap-[6px] py-[18px]">
              {sortTypes.map((item, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`flex gap-4 items-center w-full cursor-pointer px-4 py-2 ${
                      choosedSortType === index && 'bg-light-porcelain rounded'
                    }`}
                    onClick={() => handleSort(index)}
                  >
                    <span className="flex-1">{item.label}</span>
                    <div className="w-4">
                      {index === choosedSortType && (
                        <CheckIcon className="stroke-[#253646]" />
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </Popover>
        </div>
        {usersData?.users?.length ? (
          <>
            <div className="flex flex-col pt-10 gap-16 mb-8">
              {usersData.users.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex gap-8 items-center pb-8 ${
                    usersData.users.length !== index + 1 &&
                    'border-b border-light-grey'
                  }`}
                >
                  <Avatar
                    src={item.avatar}
                    alt="User avatar"
                    width={112}
                    height={112}
                    username={item.username}
                    className="rounded-full max-h-[112px] min-w-[112px]"
                    customStyles="h-[112px] min-w-[112px]"
                  />
                  <div className="flex flex-col gap-3">
                    <span className="text-lightBlack text-xl font-medium">
                      {item.username}
                    </span>
                    <span className="font-inter text-sm text-dark-grey whitespace-nowrap max-w-[700px] overflow-hidden text-ellipsis">
                      I create and curate content for both the blog and our
                      training courses. He also directs the market research and
                      strategic planning the site.
                    </span>
                  </div>
                  <Button
                    label={
                      <span className="flex gap-2 items-center text-base">
                        <PlusIcon />
                        Follow
                      </span>
                    }
                    rounded="xl"
                    fontSize="base"
                  />
                </div>
              ))}
            </div>
            {usersData.nextPage && (
              <Button
                label="See more"
                variant="outlined-secondary"
                size="full"
                onClick={loadMoreUsers}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col justify-center items-center pt-16">
            <SearchResultsIcon />
            <span className="text-5xl text-lightBlack">
              Sorry! We couldn’t find anything
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const usersList = await getUsersList({
    page: 1,
    pageSize: 9,
    order: 'dataJoined',
    orderDirection: 'ASC',
  });
  return {
    props: {
      usersList,
    },
  };
};

export default UsersList;
