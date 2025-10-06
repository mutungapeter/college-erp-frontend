'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import TendersApplications from '@/components/procurement/tenders/TenderApplicationList';
import { Suspense } from 'react';

const TendersApplicationsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <TendersApplications />
    </Suspense>
  );
};
export default TendersApplicationsPage;
