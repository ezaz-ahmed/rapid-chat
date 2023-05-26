'use client';

import { Toaster } from 'react-hot-toast';

const ToasterContext = () => {
  return <Toaster reverseOrder={false} position='bottom-left' />;
};

export default ToasterContext;
