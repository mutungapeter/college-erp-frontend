"use client";
import Transactions from '@/components/accounting/transactions';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import { Suspense } from 'react';

const TransactionsPage = () => {
  return (
                <Suspense fallback={<PageLoadingSpinner />}>
            <Transactions />
            </Suspense>
  )
}

export default TransactionsPage
