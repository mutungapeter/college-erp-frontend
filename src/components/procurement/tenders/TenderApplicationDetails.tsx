"use client";
import {
  useDeleteTenderApplicationDocumentsMutation,
  useGetApplicationDetailsQuery,
  useReviewApplicationMutation,
} from "@/store/services/finance/procurementService";

import { useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiDownload,
  FiEye,
  FiFilePlus,
  FiFileText,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";

import ActionModal from "@/components/common/Modals/ActionModal";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { formatCurrency } from "@/utils/currency";
import { CustomDate } from "@/utils/date";
import { toast } from "react-toastify";
import { ApplicationDetailsType } from "./types";

// Import the PDF export function
import { exportTenderAgreementToPDF } from "./TenderAgreementPDFDocument";
import Link from "next/link";
import { LuSend } from "react-icons/lu";
import UploadTenderApplicationDocuments from "./NewApplicationDocument";

interface Props {
  id: string | number | null;
}

const TenderApplicationDetails = ({ id }: Props) => {
  const {
    data: fetchedApplication,
    isLoading,
    error,
    refetch,
  } = useGetApplicationDetailsQuery(id, {
    skip: !id,
  });
  const [deleteTenderApplicationDocuments, { isLoading: isDeleting }] =
    useDeleteTenderApplicationDocumentsMutation();
  const [selectedApplication, setSelectedApplication] = useState<number | null>(
    null
  );
  const [modalType, setModalType] = useState<"update" | "cancel" | "submit">(
    "update"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);

  const application = fetchedApplication as ApplicationDetailsType;

  const [reviewApplication, { isLoading: isReviewLoading }] =
    useReviewApplicationMutation();
  const openUpdateModal = (id: number) => {
    setSelectedApplication(id);
    setModalType("update");
    setIsModalOpen(true);
  };
  const openSubmitModal = (id: number) => {
    setSelectedApplication(id);
    setModalType("submit");
    setIsModalOpen(true);
  };

  const openCancelModal = (id: number) => {
    setSelectedApplication(id);
    setModalType("cancel");
    setIsModalOpen(true);
  };
  const openDeleteModal = (id: number) => {
    setSelectedDoc(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDoc(null);
  };
  const closeModal = () => setIsModalOpen(false);
  const handleApproveApplication = async () => {
    const data = {
      status: "approved",
    };
    console.log(selectedApplication);
    try {
      if (selectedApplication) {
        await reviewApplication({ id: selectedApplication, data }).unwrap();
      }
      toast.success("Application Approved  successfully!");
      closeModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);

      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        toast.error(`Failed to approve application: ${errorData.error}`);
      }
    }
  };
  const handleSubmitApplication = async () => {
    const data = {
      status: "pending",
    };
    console.log(selectedApplication);
    try {
      if (selectedApplication) {
        await reviewApplication({ id: selectedApplication, data }).unwrap();
      }
      toast.success("Application Submitted  successfully!");
      closeModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);

      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        toast.error(`Failed to submit application: ${errorData.error}`);
      }
    }
  };
  const handleRejectApplication = async () => {
    const data = {
      status: "rejected",
    };
    try {
      if (selectedApplication) {
        await reviewApplication({ id: selectedApplication, data }).unwrap();
      }
      toast.success("Application rejected successfully!");
      closeModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);

      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        toast.error(
          `An error occured while rejecting the application: ${errorData.error}`
        );
      }
    }
  };
  const handleDeleteDoc = async () => {
    try {
      await deleteTenderApplicationDocuments(selectedDoc).unwrap();
      toast.success("Application document successfully deleted!");
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        toast.error(errorData.error || "Error deleting document.");
      } else {
        toast.error("Unexpected Error occurred. Please try again.");
      }
    }
  };

  const handleGenerateAgreement = async () => {
    try {
      const agreementNumber = `AGR-${
        application.id
      }-${new Date().getFullYear()}`;
      const agreementDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      await exportTenderAgreementToPDF(
        application,
        agreementNumber,
        agreementDate
      );
      toast.success("Agreement PDF generated successfully!");
    } catch (error) {
      console.error("Error generating agreement:", error);
      toast.error("Failed to generate agreement PDF. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <ContentSpinner />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Application
          </h2>
          <p className="text-gray-600">
            An error occurred while loading application details.
          </p>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      approved: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        icon: FiCheckCircle,
        iconColor: "text-green-600",
      },
      rejected: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        icon: FiXCircle,
        iconColor: "text-red-600",
      },
      pending: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        icon: FiAlertCircle,
        iconColor: "text-yellow-600",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen ">
      <Link
        href={`/dashboard/procurement/tenders/applications`}
        className="py-5 cursor-pointer flex items-center space-x-2 hover:text-blue-500 font-medium"
      >
        <FiArrowLeft className="text-xl" />
        <span>Back To Applications</span>
      </Link>
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="bg-white rounded-lg shadow border mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Tender Application Details
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Application ID: #{application.id}
                </p>
              </div>
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}
              >
                <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
                <span className={`font-medium ${statusConfig.text} capitalize`}>
                  {application.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGenerateAgreement}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiFilePlus className="w-4 h-4" />
                <span>Generate Agreement</span>
              </button>

              {application.status === "incomplete" && (
                <button
                  onClick={() => openSubmitModal(application.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <LuSend className="w-4 h-4" />

                  <span>Submit for Review</span>
                </button>
              )}

              {application.status === "pending" && (
                <>
                  <button
                    onClick={() => openUpdateModal(application.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => openCancelModal(application.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <FiXCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tender Information */}
            <div className="bg-white rounded-lg shadow border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tender Information
                </h2>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {application.tender.title}
                </h3>
                <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-md">
                  {application.tender.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-md border border-green-200">
                    <div className="flex items-center space-x-2">
                      <FiDollarSign className="text-green-600" />
                      <div>
                        <p className="text-sm text-green-600 font-medium">
                          Projected Amount
                        </p>
                        <p className="text-lg font-semibold text-green-800">
                          {formatCurrency(application.tender.projected_amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-md border border-red-200">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="text-red-600" />
                      <div>
                        <p className="text-sm text-red-600 font-medium">
                          Deadline
                        </p>
                        <p className="text-sm font-semibold text-red-800">
                          {CustomDate(application.tender.deadline)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <FiClock className="text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">
                          Duration
                        </p>
                        <p className="text-xs font-medium text-blue-800">
                          {CustomDate(application.tender.start_date)} -{" "}
                          {CustomDate(application.tender.end_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {application.tender.tender_document && (
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={application.tender.tender_document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <FiDownload className="w-4 h-4" />
                      <span>Download Tender Document</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-lg shadow border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Company Information
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Company Name
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {application.company_name}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Business Type
                      </label>
                      <p className="text-gray-900 capitalize">
                        {application.business_type}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Registration Number
                      </label>
                      <p className="text-gray-900 font-mono">
                        {application.company_registration_number}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Tax PIN
                      </label>
                      <p className="text-gray-900 font-mono">
                        {application.tax_pin}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Contact Person
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {application.contact_person}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Phone Numbers
                      </label>
                      <p className="text-gray-900">{application.phone}</p>
                      <p className="text-gray-600 text-sm">
                        {application.contact_person_phone}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email Addresses
                      </label>
                      <p className="text-gray-900">{application.email}</p>
                      <p className="text-gray-600 text-sm">
                        {application.contact_person_email}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <p className="text-gray-900 whitespace-pre-line">
                        {application.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section - Table Format */}
            <div className="bg-white rounded-lg shadow border">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Application Documents
                  </h2>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {application.documents.length} files
                  </span>
                  <UploadTenderApplicationDocuments
                    data={application}
                    refetchData={refetch}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                {application.documents.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Uploaded
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {application.documents.map((doc, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FiFileText className="text-blue-600 w-5 h-5 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {doc.document_name || `Document ${index + 1}`}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600 capitalize">
                              {doc.document_type || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {CustomDate(doc.created_on)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => window.open(doc.file, "_blank")}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                                title="View Document"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => window.open(doc.file, "_blank")}
                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-md transition-colors"
                                title="Download Document"
                              >
                                <FiDownload className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(doc.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                                title="Delete Document"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <FiFileText className="text-gray-400 text-4xl mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      No documents uploaded
                    </p>
                    <p className="text-gray-400 text-sm">
                      Documents will appear here once uploaded
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-lg shadow border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Timeline
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      Application Submitted
                    </p>
                    <p className="text-xs text-gray-500">
                      {CustomDate(application.created_on)}
                    </p>
                  </div>
                </div>

                {application.reviewed_on && (
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full mt-2 ${
                        application.status === "approved"
                          ? "bg-green-500"
                          : application.status === "rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Application Reviewed
                      </p>
                      <p className="text-xs text-gray-500">
                        {CustomDate(application.reviewed_on)}
                      </p>
                    </div>
                  </div>
                )}

                {application.updated_on !== application.created_on && (
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Last Updated
                      </p>
                      <p className="text-xs text-gray-500">
                        {CustomDate(application.updated_on)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Documents:</span>
                  <span className="font-semibold text-gray-900">
                    {application.documents.length}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Business Type:</span>
                  <span className="font-medium text-gray-900 capitalize text-sm">
                    {application.business_type}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Tender Value:</span>
                  <span className="font-semibold text-green-600 text-sm">
                    {formatCurrency(application.tender.projected_amount)}
                  </span>
                </div>

                {application.reviewed_by && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Reviewed By:</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {application.reviewed_by.first_name}{" "}
                      {application.reviewed_by.last_name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleDeleteDoc}
          isDeleting={isDeleting}
          confirmationMessage="Are you sure you want delete this document?"
          deleteMessage="This document will be deleted action cannot be undone."
          title="Delete Document"
          actionText="Delete"
        />
        {isModalOpen && (
          <ActionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onDelete={
              modalType === "update"
                ? handleApproveApplication
                : modalType === "cancel"
                ? handleRejectApplication
                :modalType === "submit"
                ? handleSubmitApplication
                : () => {}
            }
            confirmationMessage={
              modalType === "update"
                ? "Are you sure you want to approve this tender application  and automatically award the tender  to the applicant ?"
                : modalType === "submit"
                ? "Are you sure you want to submit this tender application for review?"
                : "Are you sure you want Reject this tender application?"
            }
            deleteMessage={
              modalType === "update"
                ? "This will automatically award the tender to the applicant and generate invoice for the tender amount.Also will create a vendor record for this awarded applicant"
                : modalType === "submit"
                ? "This will submit the tender application for review"
                : "This will  reject the tender application"
            }
            isDeleting={isReviewLoading}
            title={
              modalType === "update"
                ? "Approve  Application "
                : modalType === "cancel"
                ? "Reject Application"
                : modalType === "submit"
                ? "Submit Application For Review"
                : ""
            }
            actionText={
              modalType === "update"
                ? "Approve"
                : modalType === "cancel"
                ? "Reject"
                : modalType === "submit"
                ? "Submit"
                : ""
            }
            actionType={
              modalType === "update"
                ? "update"
                : modalType === "cancel"
                ? "cancel"
                :  modalType === "submit"
                ? "create"
                : "create"
            }
          />
        )}
      </div>
    </div>
  );
};

export default TenderApplicationDetails;
