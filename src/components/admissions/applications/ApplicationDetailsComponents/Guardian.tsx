"use client";
import { ApplicationType } from "@/definitions/admissions";
import { LuUserPlus, LuMail, LuPhone } from "react-icons/lu";
import EditGuardianApplicationPersonalInfo from "../Edit/EditGurdianInfo";

interface GuardianInfoCardProps {
  applicationDetails: ApplicationType;
  refectchData: () => void;
}

const GuardianInfoCard = ({ applicationDetails , refectchData}: GuardianInfoCardProps) => {
  return (
    <div className="space-y-4 p-5 border rounded-lg shadow-sm  transition-shadow">
     <div className="flex md:items-center md:flex-row md:justify-between flex-col md:gap-0 gap-5  border-b pb-3">
      <div className="flex items-center gap-2">
        <LuUserPlus className="text-amber-600" size={20} />
        <h3 className="md:text-lg text-sm font-semibold text-gray-800">Guardian Information</h3>
      </div>
      <div className=" flex justify-end md:justify-normal">
        <EditGuardianApplicationPersonalInfo data={applicationDetails} refetchData={refectchData} />
      </div>
     </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Name:</span>
          <span className="text-gray-800">{applicationDetails.guardian_name}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Relationship:</span>
          <span className="text-gray-800">{applicationDetails.guardian_relationship}</span>
        </div>
        
        <div className="border-t pt-3 mt-3 space-y-2">
          <div className="flex items-center gap-2 text-gray-800">
            <LuMail className="text-gray-500" size={16} />
            <span>{applicationDetails.guardian_email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-800">
            <LuPhone className="text-gray-500" size={16} />
            <span>{applicationDetails.guardian_phone_number}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianInfoCard;