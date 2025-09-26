

import RoleWithPermissionsDetails from "@/components/accounts/permissions/RolesDetails";
import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";
import { Suspense } from "react";

const RoleWithPermissionsDetailsPage =async function ({
  params,
}: {
  params: Promise<{ id: string }>; 
}) {
  const { id } = await params; 
  
return (

      <>
        <Suspense fallback={<PageLoadingSpinner />}>
        <RoleWithPermissionsDetails role_id={id} />
        </Suspense>
      </>
  );

};

export default RoleWithPermissionsDetailsPage;