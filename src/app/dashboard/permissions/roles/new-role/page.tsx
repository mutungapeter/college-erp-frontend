
"use client";
import NewRoleWithPermissions from "@/components/accounts/permissions/CreateRole";
import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";
import { Suspense } from "react";

const NewRoleWithPermissionsPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <NewRoleWithPermissions />
    </Suspense>
  );
};

export default NewRoleWithPermissionsPage;
