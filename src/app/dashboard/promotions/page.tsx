'use client';

import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import Promotions from '@/components/reporting/promotions';
import { Suspense } from 'react';

const PromotionsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Promotions />
    </Suspense>
  );
};

export default PromotionsPage;
