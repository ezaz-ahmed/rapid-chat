'use client';

import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FC, useCallback, useMemo } from 'react';
import Avatar from '~/app/components/Avatar';
import useOhterUser from '~/app/hooks/userOtherUser';
import { FullConversationType } from '~/app/types';

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: FC<ConversationBoxProps> = ({ data, selected }) => {
  const otherUser = useOhterUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages.at(-1);
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) false;

    const seenArr = lastMessage?.seen || [];

    if (!userEmail) false;

    return seenArr.filter(user => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image';
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return 'Started a conversation';
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        ' w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3',
        selected ? ' bg-neutral-100' : ' bg-white'
      )}
    >
      <Avatar user={otherUser} />

      <div className='min-y-0 flex-1'>
        <div className=' focus:outline-none'>
          <div className='flex justify-between items-center mb-1'>
            <p className=' text-base font-medium text-gray-900'>
              {data.name || otherUser.name}
            </p>

            {lastMessage?.createdAt && (
              <p className=' text-xs text-gray-400 font-light'>
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              ` truncate text-sm`,
              hasSeen ? ' text-gray-500' : ' text-black font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
