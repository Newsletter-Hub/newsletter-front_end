import { getFollowers } from '@/actions/user';
import React from 'react';

import { GetServerSideProps } from 'next';

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
      title="Followers"
      isUserId={true}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const user =
    context.req.cookies.user && JSON.parse(context.req.cookies.user as string);
  const userId = user?.id;
  const usersResponse = await getFollowers({
    page: 1,
    pageSize: 9,
    userId,
  });
  return {
    props: {
      usersList: usersResponse.userList,
    },
  };
};

Users.title = 'Followers | Newsletter Hub';
Users.description = 'View all users that are following you on Newsletter Hub.';
export default Users;
