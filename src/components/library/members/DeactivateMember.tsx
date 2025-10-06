'use client';
import { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';

import { MemberType } from '@/definitions/library';
import { useDeactivateMemberMutation } from '@/store/services/library/libraryService';
import { YearMonthCustomDate } from '@/utils/date';
import { MdBlock } from 'react-icons/md';

interface Props {
  data: MemberType | null;
  refetchData: () => void;
}

const DeactivateLibraryMember = ({ refetchData, data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [deactivateMember, { isLoading: isCreating }] =
    useDeactivateMemberMutation();

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => setIsOpen(true);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const onSubmit = async () => {
    const memberId = data?.id;

    try {
      const response = await deactivateMember(memberId).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Member Deactivated successfully!');
      setShowSuccessModal(true);

      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to Deactivate member: ${errorData.error}`);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage('Unexpected error occurred. Please try again.');
        setShowSuccessModal(true);
      }
    }
  };

  return (
    <>
      <div onClick={handleOpenModal} className="relative group">
        <div
          className="bg-red-100 cursor-pointer p-2
           w-fit text-red-700 rounded-xl hover:bg-red-700 hover:text-white transition duration-300"
          title="Request Fine Payment"
        >
          <MdBlock className="text-sm" />
        </div>

        {/* <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Send Fine Payment Request to Finance
        </div> */}
      </div>

      {isOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn"
            aria-hidden="true"
          ></div>

          <div
            className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center
           justify-start overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-550 md:max-w-550 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-3 border-b">
                  <p className="text-lg font-semibold text-gray-900">
                    Deactivate Member
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={30}
                      onClick={handleCloseModal}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  </div>
                </div>

                {/* Confirmation Message */}
                <div className="p-4">
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <FiInfo
                        className="text-blue-600 mt-0.5 flex-shrink-0"
                        size={20}
                      />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">
                          Confirmation Required
                        </p>
                        <p className="break-words whitespace-normal">
                          Please review the member details below and confirm
                          Deactivation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        Member Information
                      </h3>
                    </div>
                    <div className="p-4 space-y-4 text-sm text-gray-900">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600 font-semibold">
                            Full Name
                          </p>
                          <p>
                            {data?.user.first_name} {data?.user.last_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Role</p>
                          <p>{data?.role}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Email</p>
                          <p>{data?.user.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Status</p>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              data?.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {data?.status_text}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">
                            Date Joined
                          </p>
                          <p>{YearMonthCustomDate(data?.date_joined || '')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="sticky bottom-0 bg-white z-40 flex space-x-3 gap-4 md:justify-end items-center py-4 mt-6 border-t">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-gray-300 bg-white shadow-sm text-gray-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onSubmit}
                      disabled={isCreating}
                      className="bg-green-600 text-white py-2 hover:bg-green-700 text-sm px-4 rounded-md w-full min-w-[140px] md:w-auto disabled:bg-gray-400"
                    >
                      {isCreating ? (
                        <span className="flex items-center justify-center">
                          <SubmitSpinner />
                          <span>Deactivating...</span>
                        </span>
                      ) : (
                        <span>Deactivate</span>
                      )}
                    </button>
                  </div>
                </div>
              </>
            </div>

            {showSuccessModal && (
              <SuccessFailModal
                message={successMessage}
                onClose={handleCloseSuccessModal}
                isError={isError}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DeactivateLibraryMember;
