"use client";

import { StudentDetailsType } from "@/definitions/students";
import { LuUser } from "react-icons/lu";
import InfoCard from "../InfoCard";
import EditGuardianDetails from "../../Edit/EditGuardianDetails";


interface Props {
  studentDetails: StudentDetailsType;
  refetchData: () => void;
}

const GuardianDetailsTab = ({ studentDetails, refetchData }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>   
        <h2 className="text-lg font-bold text-gray-900 mb-1">Guardian Details</h2>
        <p className="text-sm text-gray-500">Guardian&apos;s contact and relationship information</p>
       </div>
       <div>
        <EditGuardianDetails data={studentDetails} refetchData={refetchData} />
        </div>
      </div>
      <InfoCard
        icon={<LuUser className="text-blue-600" />}
        title="Guardian Information"
        items={[
          { label: "Name", value: studentDetails.guardian_name },
          { label: "Phone", value: studentDetails.guardian_phone_number },
          { label: "Email", value: studentDetails.guardian_email },
          { label: "Relationship", value: studentDetails.guardian_relationship },
        ]}
      />
    </div>
  );
};

export default GuardianDetailsTab;