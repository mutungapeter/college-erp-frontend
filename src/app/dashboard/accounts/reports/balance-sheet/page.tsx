


"use client";
import BalanceSheetReports from '@/components/accounting/reports/BalanceSheet';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import { Suspense } from 'react';

const BalanceSheetReportsPage = () => {
  return (
                <Suspense fallback={<PageLoadingSpinner />}>
            <BalanceSheetReports />
            </Suspense>
  )
}

export default BalanceSheetReportsPage
