'use client';
import CashflowReports from '@/components/accounting/reports/Cashflow';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import { Suspense } from 'react';

const CashflowPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <CashflowReports />
    </Suspense>
  );
};

export default CashflowPage;
