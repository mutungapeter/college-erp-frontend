"use client";

import InfoCard from "@/components/students/Details/InfoCard";
import { StaffType } from "@/definitions/staff";
import { LuBriefcase } from "react-icons/lu";
import EditStaffWorkDetails from "../../edit/EditWorkInfo";


interface Props {
  data: StaffType;
  refetchData: () => void;
}

const WorkDetailsTab = ({ data, refetchData }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>

        <h2 className="text-lg font-bold text-gray-900 mb-1">Work Details</h2>
        <p className="text-sm text-gray-500">Job title and department details</p>

        </div>
        <div>
          <EditStaffWorkDetails data={data} refetchData={refetchData} />
        </div>
      </div>
      {data.department ? (
        <InfoCard
          icon={<LuBriefcase className="text-blue-600" />}
          title="Work Information"
          items={[
            { label: "Staff No", value: data.staff_number },
            { label: "Position", value: data.position.name },
            { label: "Department", value: data.department.name },
            { label: "Office", value: data.department.office },
            { label: "System Role", value: data.user?.role?.name },

          ]}
        />
      ) : (
        <div className="text-center text-gray-600 font-medium">
          Staff not associated to any department or not assigned a position.
        </div>
      )}
    </div>
  );
};

export default WorkDetailsTab;