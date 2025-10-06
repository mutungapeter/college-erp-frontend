'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import FeeBalances from '@/components/finance/fees/balances';

import { Suspense } from 'react';

const FeeBalancesPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <FeeBalances />
    </Suspense>
  );
};

export default FeeBalancesPage;
