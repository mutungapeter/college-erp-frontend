'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import NewOrderPage from '@/components/procurement/orders/NewOrderPage';
import { Suspense } from 'react';

const NewordersPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <NewOrderPage />
    </Suspense>
  );
};

export default NewordersPage;
