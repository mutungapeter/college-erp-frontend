import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";
import FeeStructureItems from "@/components/finance/fees/structure/FeeStructureItems";
import { Suspense } from "react";
const FeeStructureItemsPage = async ({
  params,
}: {
  params: Promise<{ structure_id: string }>;
}) => {
  const id = (await params).structure_id;

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <FeeStructureItems structure_id={id} />
    </Suspense>
  );
};
export default FeeStructureItemsPage;
