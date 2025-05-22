"use client";

import { StudentDetailsType } from "@/definitions/students";
import { LuBriefcase } from "react-icons/lu";
import InfoCard from "../InfoCard";
import EditStudentAcademicInfo from "../../Edit/EditAcadmicInfo";

interface Props {
  studentDetails: StudentDetailsType;
  refetchData: () => void;
}

const ProgrammeDetailsTab = ({ studentDetails, refetchData }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>

        <h2 className="text-lg font-bold text-gray-900 mb-1">Programme Details</h2>
        <p className="text-sm text-gray-500">Academic programme and department details</p>
      
        </div>
        <div>
          <EditStudentAcademicInfo data={studentDetails} refetchData={refetchData} />
        </div>
      </div>
      {studentDetails.programme ? (
        <InfoCard
          icon={<LuBriefcase className="text-blue-600" />}
          title="Programme Information"
          items={[
            { label: "Class", value: studentDetails.cohort?.name },
            { label: "Reg No", value: studentDetails.registration_number },
            { label: "Course", value: studentDetails.cohort.programme.name },
            { label: "Current Semester", value: studentDetails?.cohort?.current_semester.name },
            { label: "Level", value: studentDetails.programme.level },
            { label: "School", value: studentDetails.programme.school.name },
            { label: "Department", value: studentDetails.programme.department.name },
          ]}
        />
      ) : (
        <div className="text-center text-gray-600 font-medium">
          Student not enrolled/associated to any programme
        </div>
      )}
    </div>
  );
};

export default ProgrammeDetailsTab;