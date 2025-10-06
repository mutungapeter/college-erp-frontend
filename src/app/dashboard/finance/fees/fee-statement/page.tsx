'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import FeeStatementsDetails from '@/components/finance/fees/statements/FeestatementDetails';

import { Suspense } from 'react';

const FeeStatementPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <FeeStatementsDetails />
    </Suspense>
  );
};

export default FeeStatementPage;
