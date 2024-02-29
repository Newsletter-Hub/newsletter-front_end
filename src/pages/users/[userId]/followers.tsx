import { getFollowers } from '@/actions/user';
import React from 'react';

import { GetServerSideProps } from 'next';

import UsersList from '@/components/User/UsersList';
import { UserList } from '@/types/user';
import parseCookies from 'next-cookies';

interface UsersListProps {
  usersList: UserList;
}

const Users = ({ usersList }: UsersListProps) => {
  return (
    <UsersList
      usersList={usersList}
      getUsersList={getFollowers}
      isSortable={false}
      title="Followers"
      isUserId={true}
      isFollowEnable={true}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : undefined;
  const userId = Number(context.query.userId);
  const usersResponse = await getFollowers({
    page: 1,
    pageSize: 9,
    userId,
    token,
  });
  return {
    props: {
      usersList: usersResponse.userList,
    },
  };
};

Users.title = 'Followers | Newsletter Hub';
Users.description =
  'View all users that are following this user on Newsletter Hub.';
export default Users;
