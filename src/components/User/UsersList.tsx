import React, { useState } from 'react';
import Input from '../Input';
import Popover from '../Popover';
import Loading from '../Loading';
import Button from '../Button';
import SearchResultsIcon from '@/assets/icons/searchResults';
import SortIcon from '@/assets/icons/sort';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
import { UserList } from '@/types/user';
import { SortType } from '@/types/sorting';
import { GetUserListType, GetUsersListProps } from '@/actions/user';
import { follow, unfollow } from '@/actions/newsletters';
import { FollowingPayload } from '@/types';
import CheckIcon from '@/assets/icons/check';
import Avatar from '../Avatar';
import Link from 'next/link';
import PlusIcon from '@/assets/icons/plus';

const sortTypes: SortType[] = [
  {
    label: 'Date joined',
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

interface UsersListProps {
  usersList: UserList;
  getUsersList: GetUserListType;
}

const UsersList = ({ usersList, getUsersList }: UsersListProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [choosedSortType, setChoosedSortType] = useState(0);
  const [page, setPage] = useState(1);
  const [usersData, setUsersData] = useState(usersList);
  const [search, setSearch] = useState((router.query.search as string) || '');
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleChangeSearch = debounce(async (value: string) => {
    setSearchLoading(true);
    setSearch(value);
    const usersListResponse = await getUsersList({
      page: 1,
      pageSize: 6 * page,
      order: sortTypes[choosedSortType].value,
      orderDirection:
        sortTypes[choosedSortType].value === 'dataJoined' ? 'DESC' : 'ASC',
      search: value,
    }).finally(() => setSearchLoading(false));
    if (usersListResponse.userList) {
      setUsersData(usersListResponse.userList);
    }
  }, 500);

  const handleSort = async (value: number) => {
    setChoosedSortType(value);
    const usersListResponse = await getUsersList({
      page: 1,
      pageSize: 6 * page,
      order: sortTypes[value].value,
      orderDirection: sortTypes[value].value === 'dataJoined' ? 'DESC' : 'ASC',
      search,
    });
    if (usersListResponse.userList) {
      setUsersData(usersListResponse.userList);
    }
  };
  const loadMoreUsers = async () => {
    setLoadMoreLoading(true);
    setPage(prevPage => prevPage + 1);

    const usersListResponse = await getUsersList({
      page: 1,
      pageSize: 9 * (page + 1),
      order: sortTypes[choosedSortType].value,
      orderDirection:
        sortTypes[choosedSortType].value === 'dataJoined' ? 'DESC' : 'ASC',
    }).finally(() => setLoadMoreLoading(false));

    if (usersListResponse.userList) {
      setUsersData(usersListResponse.userList);
    }
  };

  const handleFollow = async ({ entityId, followed }: FollowingPayload) => {
    if (!user) {
      router.push('/sign-up');
    } else {
      if (followed) {
        const response = await unfollow({ entityId, entityType: 'User' });
        if (response?.ok) {
          const usersListResponse = await getUsersList({
            page: 1,
            pageSize: 9 * (page + 1),
            order: sortTypes[choosedSortType].value,
            orderDirection:
              sortTypes[choosedSortType].value === 'dataJoined'
                ? 'DESC'
                : 'ASC',
          });
          if (usersListResponse.userList) {
            setUsersData(usersListResponse.userList);
          }
        }
      } else {
        const response = await follow({ entityId, entityType: 'User' });
        if (response?.ok) {
          const usersListResponse = await getUsersList({
            page: 1,
            pageSize: 9 * (page + 1),
            order: sortTypes[choosedSortType].value,
            orderDirection:
              sortTypes[choosedSortType].value === 'dataJoined'
                ? 'DESC'
                : 'ASC',
          });
          if (usersListResponse.userList) {
            setUsersData(usersListResponse.userList);
          }
        }
      }
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
            defaultValue={(router.query.search as string) || ''}
          />
          <Popover
            customTriggerStyles="w-[200px]"
            triggerContent={
              <div className="flex items-center justify-center md:gap-4 h-12">
                <span className="whitespace-nowrap text-sm">
                  {sortTypes[choosedSortType].label}
                </span>
                <SortIcon className="min-w-4 min-h-4" />
              </div>
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
        {searchLoading ? (
          <div className="pt-10">
            <Loading />
          </div>
        ) : usersData?.users?.length ? (
          <>
            <div className="flex flex-col pt-10 gap-16 mb-8">
              {usersData.users.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between pb-8 ${
                    usersData.users.length !== index + 1 &&
                    'border-b border-light-grey'
                  }`}
                >
                  <div className="flex gap-8 items-center">
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
                      <Link
                        href={`/users/${item.id}`}
                        className="text-lightBlack text-xl font-medium"
                      >
                        {item.username}
                      </Link>
                      {item.description && (
                        <span className="font-inter text-sm text-dark-grey whitespace-nowrap max-w-[700px] overflow-hidden text-ellipsis">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    rounded="xl"
                    fontSize="md"
                    onClick={() =>
                      handleFollow({
                        entityId: item.id,
                        followed: item.followed,
                      })
                    }
                    variant={item.followed ? 'outlined-secondary' : 'primary'}
                    label={
                      item.followed ? (
                        'Following'
                      ) : (
                        <span className="flex items-center gap-2">
                          <PlusIcon />
                          Follow
                        </span>
                      )
                    }
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
                loading={loadMoreLoading}
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

export default UsersList;
