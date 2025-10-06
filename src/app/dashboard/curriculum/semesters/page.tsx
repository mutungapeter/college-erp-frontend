import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import Semesters from '@/components/curriculum/semesters';
import { Suspense } from 'react';

const SemestersPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Semesters />
    </Suspense>
  );
};

export default SemestersPage;
