'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import Positions from '@/components/staff/positions';
import { Suspense } from 'react';

const PositionsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Positions />
    </Suspense>
  );
};

export default PositionsPage;
