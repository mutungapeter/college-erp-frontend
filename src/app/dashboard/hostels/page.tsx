'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import Hostels from '@/components/hostels';
import { Suspense } from 'react';

const HostelsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Hostels />
    </Suspense>
  );
};

export default HostelsPage;
