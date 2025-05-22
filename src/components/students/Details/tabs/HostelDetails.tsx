"use client";

import { StudentDetailsType } from "@/definitions/students";
import { LuMapPin } from "react-icons/lu";
import InfoCard from "../InfoCard";

interface Props {
  studentDetails: StudentDetailsType;
}

const HostelDetailsTab = ({ studentDetails }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Hostel Information</h2>
        <p className="text-sm text-gray-500">Hostel and room details</p>
      </div>
      {studentDetails?.hostel_room ? (
        <InfoCard
          icon={<LuMapPin className="text-blue-600" />}
          title="Hostel Information"
          items={[
            { label: "Hostel", value: studentDetails.hostel_room.hostel.name },
            { label: "Room", value: studentDetails.hostel_room.room_number },
            { label: "Capacity", value: `${studentDetails.hostel_room.room_capacity} students` },
            { label: "Students Assigned", value: `${studentDetails.hostel_room.students_assigned}` },
          ]}
        />
      ) : (
        <div className="text-center text-gray-600 font-medium">
          No hostel information available
        </div>
      )}
    </div>
  );
};

export default HostelDetailsTab;