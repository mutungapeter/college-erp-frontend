"use client";
import RoleWithPermissionsDetails from '@/components/accounts/permissions/RolesDetails';
import { useSearchParams } from 'next/navigation';

const RoleWithPermissionsDetailsPage = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    

    
    return <RoleWithPermissionsDetails id={id} />;
};

export default RoleWithPermissionsDetailsPage;