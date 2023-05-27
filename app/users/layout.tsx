import { ReactNode } from 'react';
import Sidebar from '../components/sidebar/Sidebar';

const UsersLayout = async ({ children }: { children: ReactNode }) => {
  return (
    // @ts-expect-error
    <Sidebar>{children}</Sidebar>
  );
};

export default UsersLayout;
