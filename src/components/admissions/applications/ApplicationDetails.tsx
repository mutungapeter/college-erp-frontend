'use client';
import { ApplicationType } from '@/definitions/admissions';
import {
  useUpdateApplicationMutation,
  useGetApplicationQuery,
} from '@/store/services/admissions/admissionsService';
import { CustomDate } from '@/utils/date';
import Link from 'next/link';
import { LuArrowLeft, LuSend } from 'react-icons/lu';
import ContentSpinner from '../../common/spinners/dataLoadingSpinner';

import ApplicationDocumentsCard from './ApplicationDetailsComponents/ApplicationDocument';
import EducationHistoryCard from './ApplicationDetailsComponents/EducationHistory';
import GuardianInfoCard from './ApplicationDetailsComponents/Guardian';
import PersonalInfoCard from './ApplicationDetailsComponents/PersonalInfo';
import ProgramDetailsCard from './ApplicationDetailsComponents/ProgrammeInterest';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ActionModal from '@/components/common/Modals/ActionModal';
import EnrollStudent from './New/EnrollStudent';
import { FiCheckCircle } from 'react-icons/fi';

interface Props {
  application_id: string;
}

const ApplicationDetails = ({ application_id }: Props) => {
  const { data, isLoading, isError, refetch } =
    useGetApplicationQuery(application_id);
  const applicationDetails = data as ApplicationType;

  const [modalType, setModalType] = useState<'submit' | 'accept'>('submit');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateApplication, { isLoading: isUpdating }] =
    useUpdateApplicationMutation();

  const openSubmitModal = () => {
    setModalType('submit');
    setIsModalOpen(true);
  };

  const openAcceptModal = () => {
    setModalType('accept');
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmitApplication = async () => {
    const data = {
      status: 'Under Review',
    };
    try {
      await updateApplication({ id: application_id, data }).unwrap();
      toast.success('Application submitted successfully!');
      closeModal();
      refetch();
    } catch (error: unknown) {
      handleApiError(error, 'submitting');
    }
  };

  const handleAcceptStudent = async () => {
    const data = {
      status: 'Accepted',
    };
    try {
      await updateApplication({ id: application_id, data }).unwrap();
      toast.success('Student accepted successfully!');
      closeModal();
      refetch();
    } catch (error: unknown) {
      handleApiError(error, 'accepting');
    }
  };

  const handleApiError = (error: unknown, action: string) => {
    console.log('error', error);
    if (error && typeof error === 'object' && 'data' in error && error.data) {
      const errorData = (error as { data: { error: string } }).data;
      toast.error(errorData.error || `Error ${action} student!`);
    } else {
      toast.error('Unexpected error occurred. Please try again.');
    }
  };

  if (isLoading) {
    return <ContentSpinner />;
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg mt-10 max-w-4xl mx-auto">
        <p className="font-medium">
          Failed to load Application details. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <section
      className="relative mx-auto w-full bg-white 
    shadow-md rounded-lg overflow-hidden print:shadow-none print:rounded-none"
    >
      <div
        className="px-4 md:px-6 py-4 flex flex-col sm:flex-row
       justify-between items-start sm:items-center border-b gap-3
        print:bg-white font-inter"
      >
        <Link
          href="/dashboard/admissions/applications"
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors print:hidden"
        >
          <LuArrowLeft className="mr-2" />
          Back to Applications
        </Link>
        <div className="flex items-center gap-4">
          {applicationDetails.status === 'Incomplete' && (
            <div
              className="bg-primary inline-flex cursor-pointer w-max 
                items-center space-x-2 text-white px-4 py-2
                 rounded-md hover:bg-primary-700 transition duration-300"
              onClick={openSubmitModal}
            >
              <LuSend className="w-4 h-4" />
              <span className="text-sm font-medium">Submit Application</span>
            </div>
          )}

          {applicationDetails.status === 'Under Review' && (
            <>
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                <div
                  className="bg-primary inline-flex cursor-pointer w-max 
                items-center space-x-2 text-white px-4 py-2
                 rounded-md hover:bg-primary-700 transition duration-300"
                  onClick={openAcceptModal}
                >
                  <FiCheckCircle className="text-lg text-white" />
                  <span className="text-sm font-medium">Accept Applicant</span>
                </div>
              </div>
            </>
          )}
          {applicationDetails?.status === 'Accepted' && (
            <div>
              <EnrollStudent refetchData={refetch} data={applicationDetails} />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              #{applicationDetails?.application_number || '__'}
            </h1>

            <p className="text-sm">
              Date Applied: {CustomDate(data?.created_on || '')}
            </p>
          </div>
          <span
            className={`
              px-2 py-1 rounded-md border font-medium text-sm ${
                applicationDetails.status === 'Under Review'
                  ? 'bg-blue-100 text-blue-500 border-blue-500'
                  : applicationDetails.status === 'Declined'
                    ? 'bg-red-100 text-red-500 border-500'
                    : applicationDetails.status === 'Info Requested'
                      ? 'bg-amber-100 text-amber-800'
                      : applicationDetails.status === 'Accepted'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-500'
                        : applicationDetails.status === 'Draft'
                          ? 'bg-slate-100 text-slate-800'
                          : applicationDetails.status === 'Enrolled'
                            ? 'bg-green-100 text-green-500 border-green-500 '
                            : applicationDetails.status === 'Incomplete'
                              ? 'bg-orange-100 text-orange-500 border-orange-500'
                              : 'bg-gray-100 text-gray-800'
              }`}
          >
            {applicationDetails.status}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-3">
        <PersonalInfoCard
          applicationDetails={applicationDetails}
          refetchData={refetch}
        />
        <GuardianInfoCard
          applicationDetails={applicationDetails}
          refectchData={refetch}
        />
        <EducationHistoryCard
          applicationDetails={applicationDetails}
          refetchData={refetch}
        />
        <ApplicationDocumentsCard
          applicationDetails={applicationDetails}
          refetchData={refetch}
        />
        <ProgramDetailsCard
          applicationDetails={applicationDetails}
          refetchData={refetch}
        />
      </div>

      {isModalOpen && (
        <ActionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onDelete={
            modalType === 'submit'
              ? handleSubmitApplication
              : modalType === 'accept'
                ? handleAcceptStudent
                : () => {}
          }
          isDeleting={isUpdating}
          title={
            modalType === 'submit' ? 'Submit Application' : 'Accept Application'
          }
          confirmationMessage={
            modalType === 'submit'
              ? 'Are you sure you want to submit this application for review towards your desired programme?'
              : "Are you sure you want to accept this student's application?"
          }
          deleteMessage={
            modalType === 'submit'
              ? 'This action cannot be undone.'
              : 'The student will be notified about this decision.'
          }
          actionText={
            modalType === 'submit' ? 'Submit Application' : 'Accept Student'
          }
          actionType={modalType === 'submit' ? 'create' : 'update'}
        />
      )}
    </section>
  );
};

export default ApplicationDetails;
