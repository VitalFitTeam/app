import RecepcionistNavBar from '@/components/recepcionista/RecepcionistNavBar';
import { BackHandlerProvider } from '@/contexts/BackHandlerContext';
import React from 'react';

export default function RecepcionistLayout() {
  return (
    <BackHandlerProvider>
      <RecepcionistNavBar />
    </BackHandlerProvider>
  );
}
