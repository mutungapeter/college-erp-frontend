import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import HostelRoomOccupants from '@/components/hostels/occupants';

import { Suspense } from 'react';
const HostelRoomOccupantsPage = async ({
  params,
}: {
  params: Promise<{ room_id: string }>;
}) => {
  const id = (await params).room_id;

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <HostelRoomOccupants room_id={id} />
    </Suspense>
  );
};
export default HostelRoomOccupantsPage;
