import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";
import Departments from "@/components/curriculum/departments";
import React, { Suspense } from "react";

const DepartmentsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Departments />
    </Suspense>
  );
};

export default DepartmentsPage;
