"use client";
import VendorDetails from '@/components/procurement/vendors/VendorDetails';
import { useSearchParams } from 'next/navigation';

const VendorDetailsPage = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    

    
    return <VendorDetails id={id} />;
};

export default VendorDetailsPage;