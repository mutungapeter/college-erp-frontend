'use client';
import { ApplicationType } from '@/definitions/admissions';
import { CustomDate } from '@/utils/date';
import {
  LuBookOpen,
  LuBuilding,
  LuClock,
  LuMail,
  LuPhone,
} from 'react-icons/lu';
import EditProgrammeInterest from '../Edit/EditProgramInterest';

interface ProgramDetailsCardProps {
  applicationDetails: ApplicationType;
  refetchData: () => void;
}

const ProgramDetailsCard = ({
  applicationDetails,
  refetchData,
}: ProgramDetailsCardProps) => {
  return (
    <div className="space-y-4 p-5 border rounded-lg shadow-sm  transition-shadow">
      <div className="flex md:items-center md:justify-between md:flex-row flex-col md:space-y-0 space-y-5 border-b pb-3">
        <div className="flex items-center gap-2 ">
          <LuBookOpen className="text-purple-600" size={20} />
          <h3 className="text-sm md:text-lg font-semibold text-gray-800">
            Program Choices and Intake details
          </h3>
        </div>
        <div className="flex items-center justify-end md:justify-start">
          <EditProgrammeInterest
            data={applicationDetails}
            refetchData={refetchData}
          />
        </div>
      </div>

      <div className="space-y-4 grid grid-cols-1  md:grid-cols-2 gap-4 py-3 border-b border-blue-400 ">
        {/* First Choice Program */}
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
              First Choice
            </span>
          </div>
          <div className="mt-2 border-l-4 border-blue-400 pl-3">
            <h4 className="font-medium text-gray-800">
              {applicationDetails.first_choice_programme.name} (
              {applicationDetails.first_choice_programme.code})
            </h4>
            <p className="text-sm text-gray-600">
              {applicationDetails.first_choice_programme.level}
            </p>
            <div className="mt-1 text-sm">
              <p>
                School: {applicationDetails.first_choice_programme.school.name}
              </p>
              <p>
                Department:{' '}
                {applicationDetails.first_choice_programme.department.name}
              </p>
            </div>
          </div>
        </div>

        {/* Second Choice Program */}
        {applicationDetails.second_choice_programme && (
          <div className="">
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-medium">
                Second Choice
              </span>
            </div>
            <div className="mt-2 border-l-4 border-gray-300 pl-3">
              <h4 className="font-medium text-gray-800">
                {applicationDetails.second_choice_programme.name} (
                {applicationDetails.second_choice_programme.code})
              </h4>
              <p className="text-sm text-gray-600">
                {applicationDetails.second_choice_programme.level}
              </p>
              <div className="mt-1 text-sm">
                <p>
                  School:{' '}
                  {applicationDetails.second_choice_programme.school.name}
                </p>
                <p>
                  Department:{' '}
                  {applicationDetails.second_choice_programme.department.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-r pr-4">
          <h4 className="flex items-center gap-2 font-medium text-gray-700 mb-3">
            <LuClock size={16} />
            <span className="font-semibold">Intake Information</span>
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

        <div className="md:border-r md:pr-4">
          <h4 className="flex items-center gap-2 font-medium text-gray-700 mb-3">
            <LuBuilding size={16} />
            <span className="font-semibold">Campus Information</span>
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

        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Campus Contact</h4>

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

export default ProgramDetailsCard;
