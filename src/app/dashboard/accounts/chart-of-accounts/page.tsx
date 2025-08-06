
"use client";
import ChartOfAccounts from '@/components/accounting';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner'

import React, { Suspense } from 'react'

const ChartOfAccountsPage = () => {
  return (
                <Suspense fallback={<PageLoadingSpinner />}>
            <ChartOfAccounts />
            </Suspense>
  )
}

export default ChartOfAccountsPage
