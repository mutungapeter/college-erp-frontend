"use client";

import { StudentDetailsType } from "@/definitions/students";
import { LuUser, LuPhone } from "react-icons/lu";
import InfoCard from "../InfoCard";
import EditStudentPersonalInfo from "../../Edit/EditPersonalInfo";

interface Props {
  studentDetails: StudentDetailsType;
  refetchData: () => void;
}

const PersonalInfoTab = ({ studentDetails, refetchData }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Personal Information</h2>
        <p className="text-sm text-gray-500">Personal details and contact information</p>
        </div>
        <div>
            <EditStudentPersonalInfo data={studentDetails} refetchData={refetchData} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          icon={<LuUser className="text-blue-600" />}
          title="Basic Information"
          items={[
            { label: "Username", value: studentDetails.user.username },
            { label: "First Name", value: studentDetails.user.first_name },
            { label: "Last Name", value: studentDetails.user.last_name },
              { label: "ID No", value: studentDetails?.user?.id_number ?? null },
            { label: "Passport No", value: studentDetails?.user?.passport_number ?? null },
            { label: "Gender", value: studentDetails.user.gender },
            { label: "Date of Birth", value: studentDetails.user.date_of_birth },
          ]}
        />
        <InfoCard
          icon={<LuPhone className="text-blue-600" />}
          title="Contact Information"
          items={[
            { label: "Phone", value: studentDetails.user.phone_number },
            { label: "Email", value: studentDetails.user.email },
            { label: "Address", value: studentDetails.user.address },
            { label: "Postal Code", value: studentDetails?.user?.postal_code ?? null },
            { label: "Country", value: studentDetails?.user?.country ?? null },
            { label: "City", value: studentDetails.user.city },
          ]}
        />
      </div>
    </div>
  );
};

export default PersonalInfoTab;