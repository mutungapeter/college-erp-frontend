'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import ReportingList from '@/components/reporting';

import { Suspense } from 'react';

const ReportingPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <ReportingList />
    </Suspense>
  );
};

export default ReportingPage;
