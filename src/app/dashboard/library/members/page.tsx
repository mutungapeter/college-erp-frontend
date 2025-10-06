'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import Members from '@/components/library/members';
import { Suspense } from 'react';

const MembersPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Members />
    </Suspense>
  );
};

export default MembersPage;
