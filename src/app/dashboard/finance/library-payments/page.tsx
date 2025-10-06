'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import LibraryPayments from '@/components/finance/library/Payments';

import { Suspense } from 'react';

const LibraryPaymentsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <LibraryPayments />
    </Suspense>
  );
};

export default LibraryPaymentsPage;
