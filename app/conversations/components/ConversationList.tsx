'use client';

import { FC } from 'react';
import { FullConversationType } from '~/app/types';

interface ConversationListProps {
  initialItems: FullConversationType[];
}

const ConversationList: FC<ConversationListProps> = ({ initialItems }) => {
  return <div>ConversationList</div>;
};

export default ConversationList;
