'use client';

import { FC, Fragment, useMemo, useState } from 'react';
import { HiChevronLeft, HiEllipsisHorizontal } from 'react-icons/hi2';
import { Conversation, User } from '@prisma/client';
import Link from 'next/link';
import useOhterUser from '~/app/hooks/userOtherUser';
import Avatar from '~/app/components/Avatar';
import ProfileDrawer from './ProfileDrawer';

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: FC<HeaderProps> = ({ conversation }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const otherUser = useOhterUser(conversation);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return 'Active';
  }, [conversation]);

  return (
    <Fragment>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className=' bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm'>
        <div className='flex gap-3 items-center'>
          <Link
            href='/conversations'
            className=' lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer'
          >
            <HiChevronLeft size={32} />
          </Link>

          <Avatar user={otherUser} />

          <div className='flex flex-col'>
            <div>{conversation.name || otherUser.name}</div>

            <div className='text-sm font-light text-neutral-500'>
              {statusText}
            </div>
          </div>
        </div>

        <HiEllipsisHorizontal
          className=' text-sky-500 hover:text-sky-600 cursor-pointer transition'
          onClick={() => setDrawerOpen(true)}
          size={32}
        />
      </div>
    </Fragment>
  );
};

export default Header;
