import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner'
import Units from '@/components/curriculum/units'

import React, { Suspense } from 'react'

const CoursesPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
                  <Units />
                  </Suspense>
  )
}

export default CoursesPage
