'use client';

import { StudentDetailsType } from '@/definitions/students';
import { LuUsers } from 'react-icons/lu';
import { MdOutlineHomeWork } from 'react-icons/md';
import EditCampusDetails from '../../Edit/EditCampusDetails';
import InfoCard from '../InfoCard';

interface Props {
  studentDetails: StudentDetailsType;
  refetchData: () => void;
}

const CampusDetailsTab = ({ studentDetails, refetchData }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Campus Details
          </h2>
          <p className="text-sm text-gray-500">
            Information about student&apos;s campus
          </p>
        </div>
        <div>
          <EditCampusDetails data={studentDetails} refetchData={refetchData} />
        </div>
      </div>
      {studentDetails?.campus ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            icon={<MdOutlineHomeWork className="text-blue-600" />}
            title="Campus Information"
            items={[
              { label: 'Campus Name', value: studentDetails.campus.name },
              { label: 'City', value: studentDetails.campus.city },
              { label: 'Address', value: studentDetails.campus.address },
            ]}
          />
          <InfoCard
            icon={<LuUsers className="text-blue-600" />}
            title="Contact Information"
            items={[
              {
                label: 'Phone Number',
                value: studentDetails.campus.phone_number,
              },
              { label: 'Email', value: studentDetails.campus.email },
              {
                label: 'Population',
                value: studentDetails.campus.population.toString(),
              },
            ]}
          />
        </div>
      ) : (
        <div className="text-center text-gray-600 font-medium">
          No campus information available
        </div>
      )}
    </div>
  );
};

export default CampusDetailsTab;
