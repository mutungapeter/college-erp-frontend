'use client';
import Roles from '@/components/accounts/permissions/roles';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import { Suspense } from 'react';

const RolesPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Roles />
    </Suspense>
  );
};

export default RolesPage;
