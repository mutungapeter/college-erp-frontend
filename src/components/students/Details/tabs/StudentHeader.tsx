'use client';

import { StudentDetailsType } from '@/definitions/students';
import Image from 'next/image';
import { LuBriefcase, LuMail } from 'react-icons/lu';

interface Props {
  studentDetails: StudentDetailsType;
}

const StudentHeader = ({ studentDetails }: Props) => {
  return (
    <div className="px-6 pt-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-50 h-50 bg-slate-100 p-2 rounded-md border-4 border-white">
          <Image
            src={'/avatar/avatar.jpg'}
            alt="Student Avatar"
            width={80}
            height={80}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <div className="text-center sm:text-left flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
            <h1 className="text-2xl font-bold text-gray-900">
              {studentDetails.user.first_name} {studentDetails.user.last_name}
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-gray-600">
            {studentDetails.programme && (
              <>
                <div className="flex items-center justify-center sm:justify-start">
                  <LuBriefcase className="w-4 h-4 mr-1" />
                  <span>{studentDetails.programme?.name}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
              </>
            )}

            <div className="flex items-center justify-center sm:justify-start">
              <LuMail className="w-4 h-4 mr-1" />
              <span>{studentDetails.user.email}</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
          <div className="py-4 flex items-center space-x-4">
            <span className="font-normal uppercase">
              Reg No:{' '}
              <span className="font-semibold">
                {' '}
                {studentDetails.registration_number}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;
