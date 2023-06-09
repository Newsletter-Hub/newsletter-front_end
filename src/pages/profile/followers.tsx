import { getFollowers } from '@/actions/user';
import React from 'react';

import { GetServerSideProps } from 'next';

import parseCookies from 'next-cookies';
import UsersList from '@/components/User/UsersList';
import { UserList } from '@/types/user';

interface UsersListProps {
  usersList: UserList;
}

const Users = ({ usersList }: UsersListProps) => {
  return (
    <UsersList
      usersList={usersList}
      getUsersList={getFollowers}
      isSortable={false}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const cookies = parseCookies(context);
  const token = cookies.accessToken;
  const usersResponse = await getFollowers({
    page: 1,
    pageSize: 9,
    token,
  });
  return {
    props: {
      usersList: usersResponse.userList,
    },
  };
};

export default Users;
