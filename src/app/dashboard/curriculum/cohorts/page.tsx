"use client";
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner'
import Cohorts from '@/components/curriculum/cohorts'
import React, { Suspense } from 'react'

const CohortsPage = () => {
  return (
                <Suspense fallback={<PageLoadingSpinner />}>
            <Cohorts />
            </Suspense>
  )
}

export default CohortsPage
