"use client";
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import Books from '@/components/library/books';
import { Suspense } from 'react';

const BooksPage = () => {
  return (
          <Suspense fallback={<PageLoadingSpinner />}>
                <Books />
                </Suspense>
  )
}

export default BooksPage
