"use client";
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import PayRoll from '@/components/staff/payroll';
import { Suspense } from 'react';

const PayrollPage = () => {
  return (
          <Suspense fallback={<PageLoadingSpinner />}>
                <PayRoll />
                </Suspense>
  )
}

export default PayrollPage;
