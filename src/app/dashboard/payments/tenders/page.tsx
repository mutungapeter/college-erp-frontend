'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import VendorPayments from '@/components/procurement/tenders/Payments/VendorPayments';

import { Suspense } from 'react';

const VendorPaymentsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <VendorPayments />
    </Suspense>
  );
};

export default VendorPaymentsPage;
