"use client";
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import FeesPayments from '@/components/finance/fees/payments';

import { Suspense } from 'react';

const FeeStatementPage = () => {
  return (
          <Suspense fallback={<PageLoadingSpinner />}>
                <FeesPayments />
                </Suspense>
  )
}

export default FeeStatementPage;
