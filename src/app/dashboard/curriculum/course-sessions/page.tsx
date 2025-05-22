import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner'
import CourseSessions from '@/components/curriculum/courseSessions'
import React, { Suspense } from 'react'

const CourseSessionsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
                     <CourseSessions />
                     </Suspense>
  )
}

export default CourseSessionsPage
