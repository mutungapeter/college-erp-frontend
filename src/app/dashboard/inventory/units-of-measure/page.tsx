'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import UnitsMeasure from '@/components/inventory/unitsOfmeasure';
import { Suspense } from 'react';

const UnitsMeasurePage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <UnitsMeasure />
    </Suspense>
  );
};

export default UnitsMeasurePage;
