import { follow, unfollow } from '@/actions/newsletters';
import { getUsersList } from '@/actions/user';
import { useUser } from '@/contexts/UserContext';
import { FollowingPayload } from '@/types';
import { debounce } from 'lodash';
import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { SortType } from '@/types/sorting';
import parseCookies from 'next-cookies';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Popover from '@/components/Popover';

import CheckIcon from '@/assets/icons/check';
import PlusIcon from '@/assets/icons/plus';
import SearchResultsIcon from '@/assets/icons/searchResults';
import SortIcon from '@/assets/icons/sort';
import Link from 'next/link';
import Loading from '@/components/Loading';
import UsersList from '@/components/User/UsersList';
import { UserList } from '@/types/user';

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

interface UsersListProps {
  usersList: UserList;
}

const Users = ({ usersList }: UsersListProps) => {
  return <UsersList usersList={usersList} getUsersList={getUsersList} />;
};

export const getServerSideProps: GetServerSideProps = async context => {
  const search = (context.query.search as string) || '';
  const cookies = parseCookies(context);
  const token = cookies.accessToken;
  const usersResponse = await getUsersList({
    page: 1,
    pageSize: 9,
    order: 'dataJoined',
    orderDirection: 'DESC',
    search,
    token,
  });
  return {
    props: {
      usersList: usersResponse.userList,
    },
  };
};

export default Users;
