"use client";
import ActionModal from "@/components/common/Modals/ActionModal";
import { ApplicationType } from "@/definitions/admissions";
import { handleApiError } from "@/lib/ApiError";
import { useDeleteDocumentMutation } from "@/store/services/admissions/admissionsService";
import React, { useState } from "react";
import { FiTrash } from "react-icons/fi";
import { LuDownload, LuFileText } from "react-icons/lu";
import { toast } from "react-toastify";
import ApplicationDocumentUpdateButton from "../Edit/EditApplicationDocument";
import ApplicationDocumentUploadButton from "../New/NewApplicationDocument";
interface ApplicationDocumentsCardProps {
  applicationDetails: ApplicationType;
  refetchData: () => void;
}

const ApplicationDocumentsCard = ({
  applicationDetails,
  refetchData,
}: ApplicationDocumentsCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const documents = applicationDetails.application_document || [];
  console.log(documents, "documents");
  const [deleteDocument, { isLoading: isDeleting }] =
    useDeleteDocumentMutation();

  const openActionModal = (id: number) => {
    setIsModalOpen(true);
    setSelectedDocument(id);
  };

  const closeActionModal = () => {
    setIsModalOpen(false);
  };
  const handleDeleteDocument = async () => {
    try {
      await deleteDocument(selectedDocument).unwrap();
      toast.success("Application deleted successfully!");
      closeActionModal();
      refetchData();
    } catch (error: unknown) {
      handleApiError(error, "Deleting  document");
    }
  };

  const getFileName = (path: string) => {
    if (!path) return "";
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case "Certificate":
        return "bg-green-100 text-green-800";
      case "Transcript":
        return "bg-blue-100 text-blue-800";
      case "Indentification":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className=" space-y-4 p-5 border rounded-lg w-full shadow-sm transition-shadow">
      <div className="flex md:items-center md:justify-between md:flex-row flex-col md:space-y-0 space-y-4 border-b pb-3">
        <div className="flex items-center gap-2">
          <LuFileText className="text-indigo-600" size={20} />
          <h3 className="text-sm md:text-lg font-semibold text-gray-800">
            Application Documents
          </h3>
        </div>
        <div className="flex items-center justify-end md:justify-start">
          <ApplicationDocumentUploadButton
            studentApplicationId={applicationDetails.id}
            refetchData={refetchData}
          />
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="text-gray-500 italic">No documents available</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Document
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((document) => (
                <React.Fragment key={document.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg">
                          <LuFileText className="text-gray-500" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {document.document_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getFileName(document.document_file)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getDocumentTypeColor(
                          document.document_type
                        )}`}
                      >
                        {document.document_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {document.verified ? (
                          <span className="text-green-600 px-3 py-1 rounded-xl text-xs bg-green-100">
                            Verified
                          </span>
                        ) : (
                          <span className="text-yellow-600 text-sm px-3 py-1 rounded-xl bg-yellow-100">
                            Pending verification
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <a
                          href={document.document_file}
                          download={getFileName(document.document_file)}
                          className="text-blue-600  hover:bg-blue-100
                            p-2 rounded-md cursor-pointer flex items-center gap-1"
                        >
                          <LuDownload className="text-sm" />
                        </a>
                        <div>
                          <ApplicationDocumentUpdateButton
                            currentDocument={document}
                            refetchData={refetchData}
                          />
                        </div>
                        <div
                          onClick={() => openActionModal(document.id)}
                          className="flex items-center space-x-2 md:p-2 p-1 text-red-600 bg-red-100 hover:bg-red-700 hover:text-white rounded-md transition duration-300 shadow-sm cursor-pointer"
                        >
                          <FiTrash className="text-sm" />
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && (
        <ActionModal
          isOpen={isModalOpen}
          onClose={closeActionModal}
          onDelete={handleDeleteDocument}
          title="Delete Document"
          confirmationMessage="Are you sure you want to delete this document?"
          deleteMessage="This action cannot be undone."
          actionText="Delete"
          actionType="delete"
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default ApplicationDocumentsCard;
