import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import StudyYears from '@/components/curriculum/studyYears';

import React, { Suspense } from 'react';

const AcademicYearsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <StudyYears />
    </Suspense>
  );
};

export default AcademicYearsPage;
