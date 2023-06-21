'use client';

import { useSession } from 'next-auth/react';
import { FC } from 'react';
import { FullMessageType } from '~/app/types';

interface MessageBoxProps {
  isLast: boolean;
  data: FullMessageType;
}

const MessageBox: FC<MessageBoxProps> = ({ isLast, data }) => {
  const session = useSession();

  const isOwn = session.data?.user?.email === data.sender.email;

  const seenList = (data.seen || [])
    .filter(user => user.email !== data.sender.email)
    .map(user => user.name)
    .join(', ');

  return <div>MessageBox</div>;
};

export default MessageBox;
