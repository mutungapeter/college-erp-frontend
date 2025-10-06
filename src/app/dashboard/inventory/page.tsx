'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import InventoryItems from '@/components/inventory/store';
import { Suspense } from 'react';

const InventoryItemsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <InventoryItems />
    </Suspense>
  );
};

export default InventoryItemsPage;
