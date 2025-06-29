"use client";
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import FeeStatement from '@/components/finance/fees/statements';

import { Suspense } from 'react';

const FeeStatementPage = () => {
  return (
          <Suspense fallback={<PageLoadingSpinner />}>
                <FeeStatement />
                </Suspense>
  )
}

export default FeeStatementPage;
