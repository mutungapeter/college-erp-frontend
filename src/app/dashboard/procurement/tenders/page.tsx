'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import Tenders from '@/components/procurement/tenders';
import { Suspense } from 'react';

const TendersPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Tenders />
    </Suspense>
  );
};

export default TendersPage;
