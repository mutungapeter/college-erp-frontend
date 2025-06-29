"use client";
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import Leaves from '@/components/staff/leaves';
import { Suspense } from 'react';

const LeavesPage = () => {
  return (
          <Suspense fallback={<PageLoadingSpinner />}>
                <Leaves />
                </Suspense>
  )
}

export default LeavesPage;
