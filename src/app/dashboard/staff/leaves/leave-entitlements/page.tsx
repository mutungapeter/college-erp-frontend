'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import LeaveEntitlements from '@/components/staff/leaves/leaveEntitlements';
import { Suspense } from 'react';

const LeaveEntitlementsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <LeaveEntitlements />
    </Suspense>
  );
};

export default LeaveEntitlementsPage;
