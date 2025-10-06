'use client';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import Bookings from '@/components/hostels/bookings';
import { Suspense } from 'react';

const BookingsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Bookings />
    </Suspense>
  );
};

export default BookingsPage;
