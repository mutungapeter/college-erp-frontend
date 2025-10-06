'use client';

import ExamAssessmentList from '@/components/academics/marks/AssessmentList';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import { Suspense } from 'react';

const ExamAssessmentListPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <ExamAssessmentList />
    </Suspense>
  );
};

export default ExamAssessmentListPage;
