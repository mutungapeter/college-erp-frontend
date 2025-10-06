import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import HostelRooms from '@/components/hostels/hostelRooms';
import { Suspense } from 'react';
const HostelRoomsPage = async ({
  params,
}: {
  params: Promise<{ hostel_id: string }>;
}) => {
  const id = (await params).hostel_id;

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <HostelRooms hostel_id={id} />
    </Suspense>
  );
};
export default HostelRoomsPage;
