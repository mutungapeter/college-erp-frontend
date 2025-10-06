'use client';

import Transcripts from '@/components/academics/transcripts';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import React, { Suspense } from 'react';

const TranscriptsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Transcripts />
    </Suspense>
  );
};

export default TranscriptsPage;
