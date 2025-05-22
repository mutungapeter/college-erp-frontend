"use client";
import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";
import Schools from "@/components/curriculum/schools";
import { Suspense } from "react";

const SchoolsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Schools />
    </Suspense>
  );
};

export default SchoolsPage;
