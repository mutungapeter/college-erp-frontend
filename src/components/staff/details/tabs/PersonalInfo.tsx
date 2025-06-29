"use client";


import { LuUser, LuPhone } from "react-icons/lu";

import { StaffType } from "@/definitions/staff";
import InfoCard from "@/components/students/Details/InfoCard";
import EditPersonalInfo from "../../edit/EditPersonalInfo";


interface Props {
  data: StaffType;
  refetchData: () => void;
}

const PersonalInfoTab = ({ data, refetchData }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Personal Information</h2>
        <p className="text-sm text-gray-500">Personal details and contact information</p>
        </div>
        <div>
            <EditPersonalInfo data={data} refetchData={refetchData} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          icon={<LuUser className="text-blue-600" />}
          title="Basic Information"
          items={[
            { label: "Username", value: data.user.username },
            { label: "First Name", value: data.user.first_name },
            { label: "Last Name", value: data.user.last_name },
              { label: "ID No", value: data?.user?.id_number ?? null },
            { label: "Passport No", value: data?.user?.passport_number ?? null },
            { label: "Gender", value: data.user.gender },
            { label: "Date of Birth", value: data.user.date_of_birth },
          ]}
        />
        <InfoCard
          icon={<LuPhone className="text-blue-600" />}
          title="Contact Information"
          items={[
            { label: "Phone", value: data.user.phone_number },
            { label: "Email", value: data.user.email },
            { label: "Address", value: data.user.address },
            { label: "Postal Code", value: data?.user?.postal_code ?? null },
            { label: "Country", value: data?.user?.country ?? null },
            { label: "City", value: data.user.city },
          ]}
        />
      </div>
    </div>
  );
};

export default PersonalInfoTab;