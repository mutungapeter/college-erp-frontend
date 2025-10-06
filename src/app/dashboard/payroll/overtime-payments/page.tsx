'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import OvertimePayments from '@/components/staff/payroll/overtimepayments/OvertimePayments';
import { Suspense } from 'react';

const OvertimePaymentsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <OvertimePayments />
    </Suspense>
  );
};

export default OvertimePaymentsPage;
