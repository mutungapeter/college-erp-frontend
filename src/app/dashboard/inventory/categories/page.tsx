'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import Categories from '@/components/inventory/categories';
import { Suspense } from 'react';

const CategoriesPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Categories />
    </Suspense>
  );
};

export default CategoriesPage;
