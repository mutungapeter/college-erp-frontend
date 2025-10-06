'use client';
import FinancialReports from '@/components/accounting/reports';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import { Suspense } from 'react';

const ReportsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <FinancialReports />
    </Suspense>
  );
};

export default ReportsPage;
