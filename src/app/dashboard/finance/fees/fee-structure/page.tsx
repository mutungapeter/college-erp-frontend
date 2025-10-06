'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import FeeStructuresList from '@/components/finance/fees/structure';

import { Suspense } from 'react';

const FeeStructurePage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <FeeStructuresList />
    </Suspense>
  );
};

export default FeeStructurePage;
