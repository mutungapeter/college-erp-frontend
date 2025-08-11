
"use client";
import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";
import IssueRecords from "@/components/inventory/IssueRecords";
import { Suspense } from "react";

const IssueRecordsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <IssueRecords />
    </Suspense>
  );
};

export default IssueRecordsPage;
