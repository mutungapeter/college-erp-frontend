'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import BorrowedBooksList from '@/components/library/books/BorrowedBooks';

import { Suspense } from 'react';

const BorrowedBooksListPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <BorrowedBooksList />
    </Suspense>
  );
};

export default BorrowedBooksListPage;
