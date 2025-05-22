"use client";
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner'
import Campuses from '@/components/curriculum/campuses'
import React, { Suspense } from 'react'

const CampusesPage = () => {
  return (
          <Suspense fallback={<PageLoadingSpinner />}>
                <Campuses />
                </Suspense>
  )
}

export default CampusesPage
