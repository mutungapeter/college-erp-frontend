'use client';
import ArchievedAccountTypes from '@/components/accounting/accountTypes/Archieved';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import { Suspense } from 'react';

const ArchievedAccountTypesPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <ArchievedAccountTypes />
    </Suspense>
  );
};

export default ArchievedAccountTypesPage;
