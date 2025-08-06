
"use client";
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import AwardedTenders from '@/components/procurement/tenders/AwardedTenders';
import { Suspense } from 'react';

const AwardedTendersPage = () => {
  return (
                <Suspense fallback={<PageLoadingSpinner />}>
            <AwardedTenders />
            </Suspense>
  )
}

export default AwardedTendersPage
