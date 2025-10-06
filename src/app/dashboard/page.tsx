'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import Dashboard from '@/components/dashboard';
import { Suspense } from 'react';
const DashboardPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Dashboard />
    </Suspense>
  );
};
export default DashboardPage;
