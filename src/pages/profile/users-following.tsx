import { getUserSubscriptions } from '@/actions/user';
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
      getUsersList={getUserSubscriptions}
      isSortable={false}
      isUserId={true}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const user = JSON.parse(context.req.cookies.user as string);
  const userId = user.id;
  const cookies = parseCookies(context);
  const token = cookies.accessToken;
  const usersResponse = await getUserSubscriptions({
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

Users.title = 'Following | Newsletter Hub';
Users.description = 'View all users that you are following on Newsletter Hub.';
export default Users;
