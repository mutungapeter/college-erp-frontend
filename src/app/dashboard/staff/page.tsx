'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import Staff from '@/components/staff';
import { Suspense } from 'react';

const StaffPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Staff />
    </Suspense>
  );
};

export default StaffPage;
