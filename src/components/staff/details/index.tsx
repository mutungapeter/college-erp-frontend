"use client"
import { StaffType } from '@/definitions/staff';
import { useGetStaffDetailsQuery } from '@/store/services/staff/staffService';
import Link from 'next/link';
import { useState } from 'react';
import {
    FaSpinner
} from 'react-icons/fa';
import { IoArrowBackOutline } from 'react-icons/io5';
import Tabs from './tabs';
import PersonalInfoTab from './tabs/PersonalInfo';
import StaffHeader from './tabs/StaffHeader';
import WorkDetailsTab from './tabs/WorkDetails';


interface Props {
  staff_id: string;
}

const StaffDetails = ({ staff_id }: Props) => {
 
  const { data, isLoading, error, refetch } = useGetStaffDetailsQuery(staff_id, {
    refetchOnMountOrArgChange: true,
  });
 const staffDetails = data as StaffType;
  const [activeTab, setActiveTab] = useState<"personal" | "work">("personal");
 
const tabs = [
    { id: "personal", label: "Personal Information" },
    { id: "work", label: "Work Details" },
    
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Error loading staff details</div>
          <button 
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-xl">No staff data found</div>
      </div>
    );
  }





  return (
    <>
    <div className="w-full md:max-w-c-1235 mx-auto font-nunito">
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <Link
              href="/dashboard/staff"
              passHref
              className="p-6 flex items-center space-x-3 hover:text-primary cursor-pointer"
            >
              <IoArrowBackOutline />
              <span>Back</span>
            </Link>
            
            <StaffHeader data={staffDetails} />
    
            <Tabs 
              tabs={tabs} 
              activeTab={activeTab} 
              onChange={(tab) => setActiveTab(tab as typeof activeTab)} 
            />
          </div>

          {activeTab === "personal" && <PersonalInfoTab data={staffDetails} refetchData={refetch} />}
          {activeTab === "work" && <WorkDetailsTab data={staffDetails} refetchData={refetch} />}
        </div>
    </>

  );
};

export default StaffDetails;