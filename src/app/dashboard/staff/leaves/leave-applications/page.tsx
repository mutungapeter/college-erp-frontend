'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import LeaveApplications from '@/components/staff/leaves/leaveApplications';
import { Suspense } from 'react';

const LeaveApplicationsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <LeaveApplications />
    </Suspense>
  );
};

export default LeaveApplicationsPage;
