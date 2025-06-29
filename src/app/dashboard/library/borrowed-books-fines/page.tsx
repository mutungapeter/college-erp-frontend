
"use client";
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import BorrowedBooksFines from '@/components/library/books/fines';

import { Suspense } from 'react';

const BorrowedBooksFinesPage = () => {
  return (
          <Suspense fallback={<PageLoadingSpinner />}>
                <BorrowedBooksFines />
                </Suspense>
  )
}

export default BorrowedBooksFinesPage
