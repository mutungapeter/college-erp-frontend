'use client';

import Marks from '@/components/academics/marks';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import React, { Suspense } from 'react';

const MarksPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Marks />
    </Suspense>
  );
};

export default MarksPage;
