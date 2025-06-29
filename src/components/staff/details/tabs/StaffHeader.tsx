"use client";

import { StaffType } from "@/definitions/staff";
import Image from "next/image";
import { LuBriefcase, LuMail } from "react-icons/lu";

interface Props {
  data: StaffType;
}

const StaffHeader = ({ data }: Props) => {
  return (
    <div className="px-6 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col sm:flex-row  gap-4">
          <div className="w-16 h-16 bg-slate-100 p-2 rounded-md border-4 border-white">
            <Image
              src={"/avatar/avatar.jpg"}
              alt="Student Avatar"
              width={50}
              height={50}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
              <h1 className="text-2xl font-bold text-gray-900">
                {data.user.first_name} {data.user.last_name}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-gray-600">
              {data.department && (
                <>
                  <div className="flex items-center justify-center sm:justify-start">
                    <LuBriefcase className="w-4 h-4 mr-1" />
                    <span>{data.department?.name}</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                </>
              )}

              <div className="flex items-center justify-center sm:justify-start">
                <LuMail className="w-4 h-4 mr-1" />
                <span>{data.user.email}</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            <div className="py-4 flex items-center space-x-4">
              <span className="font-normal uppercase">
                Staff No:{" "}
                <span className="font-semibold"> {data.staff_number}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`font-semibold px-2 py-0 rounded-xl 
          ${
            data.status === "Active"
              ? "text-green-600 bg-green-100"
              : data.status === "Inactive"
              ? "text-yellow-600 bg-yellow-100"
              : data.status === "Terminated"
              ? "text-red-600 bg-red-100"
              : "text-white bg-gray-500"
          }`}
          >
            {data.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StaffHeader;
