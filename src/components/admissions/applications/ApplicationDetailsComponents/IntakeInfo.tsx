'use client';
import { ApplicationType } from '@/definitions/admissions';
import {
  LuCalendar,
  LuBuilding,
  LuClock,
  LuMail,
  LuPhone,
} from 'react-icons/lu';
import { CustomDate } from '@/utils/date';

interface EnrollmentDetailsCardProps {
  applicationDetails: ApplicationType;
}

const EnrollmentDetailsCard = ({
  applicationDetails,
}: EnrollmentDetailsCardProps) => {
  return (
    <div className="md:col-span-2 space-y-4 p-5 border rounded-lg shadow-sm  transition-shadow">
      <div className="flex items-center gap-2 border-b pb-3">
        <LuCalendar className="text-indigo-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">
          Enrollment Details
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-r pr-4">
          <h4 className="flex items-center gap-2 font-medium text-gray-700 mb-3">
            <LuClock size={16} />
            Intake Information
          </h4>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Intake:</span>
              <span className="text-gray-800 font-medium">
                {applicationDetails?.intake?.name || ''}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Start Date:</span>
              <span className="text-gray-800">
                {CustomDate(applicationDetails?.intake?.start_date || '')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">End Date:</span>
              <span className="text-gray-800">
                {CustomDate(applicationDetails?.intake?.end_date || '')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`text-sm px-2 py-0.5 rounded ${
                  applicationDetails?.intake?.closed
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {applicationDetails?.intake?.closed ? 'Closed' : 'Open'}
              </span>
            </div>
          </div>
        </div>

        {/* Campus Information */}
        <div className="md:border-r md:pr-4">
          <h4 className="flex items-center gap-2 font-medium text-gray-700 mb-3">
            <LuBuilding size={16} />
            Campus Information
          </h4>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="text-gray-800 font-medium">
                {applicationDetails?.campus?.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">City:</span>
              <span className="text-gray-800">
                {applicationDetails?.campus?.city}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="text-gray-800">
                {applicationDetails?.campus?.address}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Population:</span>
              <span className="text-gray-800">
                {applicationDetails?.campus?.population} students
              </span>
            </div>
          </div>
        </div>

        {/* Campus Contact Information */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Campus Contact</h4>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-800">
              <LuMail className="text-gray-500" size={16} />
              <span>{applicationDetails?.campus?.email}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-800">
              <LuPhone className="text-gray-500" size={16} />
              <span>{applicationDetails?.campus?.phone_number}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDetailsCard;
