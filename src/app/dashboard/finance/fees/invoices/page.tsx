"use client";
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import FeesInvoicesList from '@/components/finance/fees/invoices';
import { Suspense } from 'react';

const FessInvoicesPage = () => {
  return (
          <Suspense fallback={<PageLoadingSpinner />}>
                <FeesInvoicesList />
                </Suspense>
  )
}

export default FessInvoicesPage;
