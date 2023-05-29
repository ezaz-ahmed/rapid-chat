import { ReactNode } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import getUsers from '../actions/getUsers';
import UserList from './components/UserList';

const UsersLayout = async ({ children }: { children: ReactNode }) => {
  const users = await getUsers();

  return (
    // @ts-expect-error
    <Sidebar>
      <UserList items={users} />
      {children}
    </Sidebar>
  );
};

export default UsersLayout;
