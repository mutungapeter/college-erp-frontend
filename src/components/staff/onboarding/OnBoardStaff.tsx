'use client';

import ActionModal from '@/components/common/Modals/ActionModal';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';
import { handleApiError } from '@/lib/ApiError';
import {
  useCompleteOnboardingMutation,
  useGetOnboardingProgressQuery,
} from '@/store/services/staff/staffService';
import Link from 'next/link';
import { useState } from 'react';
import {
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaCreditCard,
  FaExclamationTriangle,
  FaUser,
} from 'react-icons/fa';
import { IoArrowBackSharp } from 'react-icons/io5';
import { LuFileText } from 'react-icons/lu';
import { toast } from 'react-toastify';
import AddStaffPayroll from './ConfigurePayroll';
import StaffDocumentMultiUpload from './UploadDocuments';

interface Props {
  staff_id: string;
}

const StaffOnBoarding = ({ staff_id }: Props) => {
  const { data, isLoading, error, refetch } =
    useGetOnboardingProgressQuery(staff_id);
  console.log('data', data);
  const [modalType, setModalType] = useState<'submit' | 'accept'>('submit');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completeOnboarding, { isLoading: isUpdating }] =
    useCompleteOnboardingMutation();
  const openSubmitModal = () => {
    setModalType('submit');
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleCompleteOnboarding = async () => {
    const data = {
      onboarding_completed: true,
    };
    try {
      await completeOnboarding({ id: staff_id, data }).unwrap();
      toast.success('Onboarding completed successfully!');
      closeModal();
      refetch();
    } catch (error: unknown) {
      handleApiError(error, 'Completing Onboarding');
    }
  };
  if (isLoading) {
    return (
      <>
        <ContentSpinner />
      </>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <FaExclamationTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-red-700 mb-3">Failed to load onboarding data</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalSteps = 5;
  const completedCount = [
    data.user_created,
    data.staff_details_completed,
    data.documents_uploaded,
    data.payroll_setup_completed,
    data.onboarding_completed,
  ].filter(Boolean).length;

  const progressPercentage = (completedCount / totalSteps) * 100;

  return (
    <div className="max-w-c-1235 mx-auto p-6">
      <div className="bg-white rounded-lg flex flex-col gap-4 shadow-md border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link
            href={'/dashboard/staff'}
            className="flex items-center hover:text-primary-500 cursor-pointer space-x-2"
          >
            <IoArrowBackSharp className="text-xl " />
            <h3 className="">Back to Staff</h3>
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Staff Onboarding Progress
        </h2>
        <p className="text-gray-600 mb-4">
          Complete all steps to finish onboarding the below staff/Employee
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {data.staff?.user?.first_name} {data.staff?.user?.last_name}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700">Department:</span>
                  <span className="ml-1">{data.staff?.department?.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-1">
                    {data.staff?.department?.department_type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            {completedCount} of {totalSteps} completed
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                data.user_created
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <FaUser className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                User Account Created
              </h3>
              <p className="text-sm text-gray-500">
                System access credentials established
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {data.user_created ? (
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <FaCheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Complete</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <FaClock className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Staff Details Completed */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                data.staff_details_completed
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <FaClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Staff Details Completed
              </h3>
              <p className="text-sm text-gray-500">
                Personal and professional information collected
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {data.staff_details_completed ? (
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <FaCheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Complete</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <FaClock className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Documents Uploaded */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                data.documents_uploaded
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <LuFileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Documents Uploaded</h3>
              <p className="text-sm text-gray-500">
                Required identification and certification documents
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {data.documents_uploaded ? (
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <FaCheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Complete</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <FaClock className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Pending</span>
                </div>

                <StaffDocumentMultiUpload
                  staffId={staff_id}
                  refetchData={refetch}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                data.payroll_setup_completed
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <FaCreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Payroll Setup Completed
              </h3>
              <p className="text-sm text-gray-500">
                Salary structure and payment preferences configured
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {data.payroll_setup_completed ? (
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <FaCheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Complete</span>
              </div>
            ) : (
              <div className="flex  flex-col gap-3">
                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <FaClock className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Pending</span>
                </div>

                <AddStaffPayroll data={data} refetchData={refetch} />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                data.onboarding_completed
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <FaCheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Onboarding Completed
              </h3>
              <p className="text-sm text-gray-500">Ready to start working</p>
            </div>
          </div>
          <div className="flex items-center">
            {data.onboarding_completed ? (
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <FaCheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Complete</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <FaClock className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <div
                  onClick={openSubmitModal}
                  className="bg-blue-800 inline-flex cursor-pointer w-max 
         items-center space-x-2 text-white px-4 py-2 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300"
                >
                  <span className="text-xs font-medium">
                    Complete Onboarding
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ActionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onDelete={
            modalType === 'submit' ? handleCompleteOnboarding : () => {}
          }
          isDeleting={isUpdating}
          title={modalType === 'submit' ? 'Complete Onboarding' : ''}
          confirmationMessage={
            modalType === 'submit' ? 'Complete onboarding for this Staff?' : ''
          }
          deleteMessage={modalType === 'submit' ? '' : ''}
          actionText={modalType === 'submit' ? 'Complete Onboarding' : ''}
          actionType={modalType === 'submit' ? 'create' : 'update'}
        />
      )}

      {/* Completion Message */}
      {completedCount === totalSteps && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <FaCheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-green-900">
            🎉 Onboarding Complete!
          </h3>
          <p className="text-green-700">
            All steps completed successfully. Ready to start working!
          </p>
        </div>
      )}
    </div>
  );
};

export default StaffOnBoarding;
