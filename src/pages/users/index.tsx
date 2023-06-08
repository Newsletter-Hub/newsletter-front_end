import { follow, unfollow } from '@/actions/newsletters';
import { getUsersList } from '@/actions/user';
import { useUser } from '@/contexts/UserContext';
import { FollowingPayload } from '@/types';
import { debounce } from 'lodash';
import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import parseCookies from 'next-cookies';
import UsersList from '@/components/User/UsersList';
import { UserList } from '@/types/user';

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
