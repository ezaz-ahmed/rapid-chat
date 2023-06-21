'use client';

import { FC, useState, useRef } from 'react';
import useConversation from '~/app/hooks/useConversation';
import { FullMessageType } from '~/app/types';
import MessageBox from './MessageBox';

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  return (
    <div className=' flex-1 overflow-y-auto'>
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          data={message}
          key={message.id}
        />
      ))}

      <div className='bottom pt-24' ref={bottomRef} />
    </div>
  );
};

export default Body;
