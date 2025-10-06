'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import Vendors from '@/components/procurement/vendors';

import { Suspense } from 'react';

const VendorsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Vendors />
    </Suspense>
  );
};

export default VendorsPage;
