'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import AllPaySlips from '@/components/staff/payroll/PaySlips';
import { Suspense } from 'react';

const PaySlipsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <AllPaySlips />
    </Suspense>
  );
};

export default PaySlipsPage;
