'use client';

import AccountTypes from '@/components/accounting/accountTypes';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import React, { Suspense } from 'react';

const AccountTypesPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <AccountTypes />
    </Suspense>
  );
};

export default AccountTypesPage;
