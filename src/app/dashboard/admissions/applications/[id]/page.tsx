import ApplicationDetails from '@/components/admissions/applications/ApplicationDetails';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import { Suspense } from 'react';
const ApplicationDetailsDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <ApplicationDetails application_id={id} />
    </Suspense>
  );
};
export default ApplicationDetailsDetailsPage;
