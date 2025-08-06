"use client";
import TenderApplicationDetails from '@/components/procurement/tenders/TenderApplicationDetails';
import { useSearchParams } from 'next/navigation';

const TenderDetailsPage = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    

    
    return <TenderApplicationDetails id={id} />;
};

export default TenderDetailsPage;