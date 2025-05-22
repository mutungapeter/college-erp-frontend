"use client";
import GetApplications from '@/components/admissions/applications';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner'

import React, { Suspense } from 'react'

const ApplicationsPage = () => {
  return (
                <Suspense fallback={<PageLoadingSpinner />}>
            <GetApplications />
            </Suspense>
  )
}

export default ApplicationsPage
