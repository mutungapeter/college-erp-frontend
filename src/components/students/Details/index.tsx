'use client';
import ContentSpinner from '../../common/spinners/dataLoadingSpinner';
import { StudentDetailsType } from '@/definitions/students';
import { useGetStudentQuery } from '@/store/services/students/studentsService';
import { useState } from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import Link from 'next/link';
import StudentTabs from './tabs/Tabs';
import PersonalInfoTab from './tabs/PersonalInfo';
import ProgrammeDetailsTab from './tabs/ProgrammeDetails';
import HostelDetailsTab from './tabs/HostelDetails';
import StudentHeader from './tabs/StudentHeader';
import GuardianDetailsTab from './tabs/GuardianDetails';
import CampusDetailsTab from './tabs/CampusDetails';

interface Props {
  student_id: string;
}

const StudentDetails = ({ student_id }: Props) => {
  const { data, isLoading, isError, refetch } = useGetStudentQuery(student_id);
  const studentDetails = data as StudentDetailsType;
  const [activeTab, setActiveTab] = useState<
    'personal' | 'programme' | 'hostel' | 'guardian' | 'campus'
  >('personal');

  if (isLoading) {
    return <ContentSpinner />;
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg mt-10 max-w-4xl mx-auto">
        <p className="font-medium">
          Failed to load student details. Please try again later.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'programme', label: 'Programme Details' },
    { id: 'guardian', label: 'Guardian Details' },
    { id: 'campus', label: 'Campus Details' },
    { id: 'hostel', label: 'Hostel Details' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto font-nunito">
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <Link
          href="/dashboard/students"
          passHref
          className="p-6 flex items-center space-x-3 hover:text-primary cursor-pointer"
        >
          <IoArrowBackOutline />
          <span>Back</span>
        </Link>

        <StudentHeader studentDetails={studentDetails} />

        <StudentTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as typeof activeTab)}
        />
      </div>

      {activeTab === 'personal' && (
        <PersonalInfoTab
          studentDetails={studentDetails}
          refetchData={refetch}
        />
      )}
      {activeTab === 'programme' && (
        <ProgrammeDetailsTab
          studentDetails={studentDetails}
          refetchData={refetch}
        />
      )}
      {activeTab === 'guardian' && (
        <GuardianDetailsTab
          studentDetails={studentDetails}
          refetchData={refetch}
        />
      )}
      {activeTab === 'campus' && (
        <CampusDetailsTab
          studentDetails={studentDetails}
          refetchData={refetch}
        />
      )}
      {activeTab === 'hostel' && (
        <HostelDetailsTab studentDetails={studentDetails} />
      )}
    </div>
  );
};

export default StudentDetails;
