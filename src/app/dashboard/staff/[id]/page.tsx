import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";
import StaffDetails from "@/components/staff/details";
import { Suspense } from "react";
const StaffDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <StaffDetails staff_id={id} />
    </Suspense>
  );
};
export default StaffDetailsPage;
