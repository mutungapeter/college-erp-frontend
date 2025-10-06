'use client';
import { ApplicationType } from '@/definitions/admissions';
import { LuMail, LuPhone, LuUser } from 'react-icons/lu';
import EditStudentApplicationPersonalInfo from '../Edit/EditPersonalInfo';

interface PersonalInfoCardProps {
  applicationDetails: ApplicationType;
  refetchData: () => void;
}

const PersonalInfoCard = ({
  applicationDetails,
  refetchData,
}: PersonalInfoCardProps) => {
  return (
    <div
      className="space-y-4 p-5 border 
    rounded-lg shadow-sm transition-shadow  "
    >
      <div>
        <div className="flex md:tems-center md:flex-row flex-col md:gap-0 gap-5 md:justify-between">
          <div className="flex items-center gap-2 border-b pb-3">
            <LuUser className="text-blue-600" size={20} />
            <h3 className="md:text-lg text-sm font-semibold text-gray-800">
              Personal Information
            </h3>
          </div>
          <div className="flex items-center md:justify-normal justify-end ">
            <EditStudentApplicationPersonalInfo
              data={applicationDetails}
              refetchData={refetchData}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2 mb-2">
          <div className="space-y-3 p-3 rounded-xl border ">
            <InfoRow
              label="Full Name"
              value={`${applicationDetails.first_name} ${applicationDetails.last_name}`}
            />
            <InfoRow label="Gender" value={applicationDetails.gender} />
            <InfoRow
              label="Date of Birth"
              value={applicationDetails.date_of_birth}
            />
            <InfoRow label="ID Number" value={applicationDetails.id_number} />
            <InfoRow
              label="Passport Number"
              value={applicationDetails.passport_number}
            />
          </div>
          <div className="space-y-3 p-3 rounded-xl border">
            <div className="flex items-center gap-2 text-gray-800">
              <LuMail className="text-gray-500" size={16} />
              <span>{applicationDetails.email}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-800">
              <LuPhone className="text-gray-500" size={16} />
              <span>{applicationDetails.phone_number}</span>
            </div>

            <div className="border-t pt-3 mt-3 ">
              {/* <h4 className="font-medium text-gray-700 mb-2">Residence</h4> */}
              <p className="text-gray-800">
                {applicationDetails.address}
                {applicationDetails.postal_code &&
                  `, ${applicationDetails.postal_code}`}
                <br />
                {applicationDetails.city}, {applicationDetails.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for consistent formatting of info rows
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => (
  <div className="flex justify-between">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-800">{value || 'Not provided'}</span>
  </div>
);

export default PersonalInfoCard;
