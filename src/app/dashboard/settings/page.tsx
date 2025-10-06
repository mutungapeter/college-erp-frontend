'use client';

import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import SettingsPage from '@/components/settings';
import { Suspense } from 'react';

const SettingPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <SettingsPage />
    </Suspense>
  );
};

export default SettingPage;
