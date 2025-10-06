import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import Programmes from '@/components/curriculum/programmes';
import React, { Suspense } from 'react';

const ProgrammesPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Programmes />
    </Suspense>
  );
};

export default ProgrammesPage;
