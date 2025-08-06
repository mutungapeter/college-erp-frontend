
"use client";
import ArchivedChartOfAccounts from '@/components/accounting/accounts/Archieved';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import { Suspense } from 'react';

const ArchivedChartOfAccountsPage = () => {
  return (
                <Suspense fallback={<PageLoadingSpinner />}>
            <ArchivedChartOfAccounts />
            </Suspense>
  )
}

export default ArchivedChartOfAccountsPage
