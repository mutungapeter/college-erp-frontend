'use client';
import IncomeStatementReports from '@/components/accounting/reports/IncomeStatement';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import { Suspense } from 'react';

const IncomeStatementReportsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <IncomeStatementReports />
    </Suspense>
  );
};

export default IncomeStatementReportsPage;
