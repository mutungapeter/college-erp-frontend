"use client";
import ActionModal from "@/components/common/Modals/ActionModal";
import { ApplicationType } from "@/definitions/admissions";
import { handleApiError } from "@/lib/ApiError";
import { useDeleteEducationHistoryMutation } from "@/store/services/admissions/admissionsService";
import { useState } from "react";
import { FiTrash } from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";
import { toast } from "react-toastify";
import EditEducationHistory from "../Edit/EditEducationHistory";
import NewEducationHistory from "../New/NewEducationHistory";

interface EducationHistoryCardProps {
  applicationDetails: ApplicationType;
  refetchData: () => void;
}

const EducationHistoryCard = ({ applicationDetails, refetchData }: EducationHistoryCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState<number | null>(null);
    
  const educationHistory = applicationDetails.application_education_history || [];
   const [deleteEducationHistory, { isLoading: isDeleting }] =useDeleteEducationHistoryMutation();
  
    const openActionModal = (id: number) => {
      setIsModalOpen(true);
      setSelectedEducation(id);
    };
  
    const closeActionModal = () => {
      setIsModalOpen(false);
    };
     const handleDeleteEducationHistory = async () => {
        try {
          await deleteEducationHistory(selectedEducation).unwrap();
          toast.success("Education History deleted successfully!");
          closeActionModal();
          refetchData();
        } catch (error: unknown) {
          handleApiError(error, "Deleting  education history");
        }
      };
  // console.log("educationHistory", educationHistory);
  const getEducationLevelColor = (level: string) => {
    switch (level) {
      case "Primary School":
        return "bg-gray-100 text-gray-800";
      case "Secondary School":
        return "bg-blue-100 text-blue-800";
      case "Undergraduate":
        return "bg-green-100 text-green-800";
      case "Masters":
        return "bg-purple-100 text-purple-800";
      case "Doctorate":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className=" w-full space-y-4 p-5 border rounded-lg shadow-sm  transition-shadow">
      <div className="flex md:items-center md:justify-between md:flex-row flex-col md:space-y-0 space-y-4 border-b pb-3">
    <div className="flex items-center  gap-2">
        <LuGraduationCap className="text-teal-600" size={20} />
        <h3 className="md:text-lg text-sm font-semibold text-gray-800">Education History</h3>
    </div>
    <div className="flex items-center justify-end md:justify-start">
        <NewEducationHistory refetchData={refetchData} data={applicationDetails} />
    </div>
      </div>
      
      {educationHistory.length === 0 ? (
        <div className="text-gray-500 italic">No education history available</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Institution</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Level</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Major</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Year</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Grade/GPA</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {educationHistory.map((education) => (
                <tr key={education.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg">
                        <LuGraduationCap className="text-gray-500" size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{education.institution}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getEducationLevelColor(education.level)}`}>
                      {education.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{education.major}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{education.year}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{education.grade_or_gpa}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {education.graduated ? (
                        <>
                          
                          <span className="text-green-800 bg-green-100 text-xs rounded-3xl py-1 px-2">Graduated</span>
                        </>
                      ) : (
                        <>
                          
                          <span className="text-amber-800 bg-amber-100 text-xs rounded-3xl py-1 px-2">Not Graduated</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="flex items-center gap-x-3 px-4 py-3 whitespace-nowrap">
                      <EditEducationHistory data={education} application_id={applicationDetails?.id} refetchData={refetchData} />
                  <div
                                           onClick={() => openActionModal(education.id)}
                                           className="flex items-center space-x-2 md:p-2 p-1 text-red-600 bg-red-100 hover:bg-red-700 hover:text-white rounded-md transition duration-300 shadow-sm cursor-pointer"
                                         >
                                           <FiTrash className="text-sm" />
                                         </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       {isModalOpen && (
              <ActionModal
                isOpen={isModalOpen}
                onClose={closeActionModal}
                onDelete={handleDeleteEducationHistory}
                title="Delete Education History"
                confirmationMessage="Are you sure you want to delete this Education History?"
                deleteMessage="This action cannot be undone."
                actionText="Delete"
                actionType="delete"
                isDeleting={isDeleting}
              />
            )}
    </div>
  );
};

export default EducationHistoryCard;