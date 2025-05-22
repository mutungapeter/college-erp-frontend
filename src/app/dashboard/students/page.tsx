"use client";
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner'
import Students from '@/components/students';

import React, { Suspense } from 'react'

const StudentsPage = () => {
  return (
                <Suspense fallback={<PageLoadingSpinner />}>
            <Students />
            </Suspense>
  )
}

export default StudentsPage;
