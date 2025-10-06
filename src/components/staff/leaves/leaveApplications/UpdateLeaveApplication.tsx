'use client';
import { zodResolver } from '@hookform/resolvers/zod';

import Select from 'react-select';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';
import { LabelOptionsType } from '@/definitions/Labels/labelOptionsType';
import { LeaveApplicationType, LeaveStatusOptions } from '@/definitions/leaves';
import {
  UpdateLeaveApplicationSchema,
  UpdateLeaveApplicationType,
} from '@/schemas/staff/leaves';
import { useUpdateLeaveApplicationMutation } from '@/store/services/staff/leaveService';

const EditLeaveApplication = ({
  data,
  refetchData,
}: {
  data: LeaveApplicationType | null;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isError, setIsError] = useState(false);

  const [updateLeaveApplication, { isLoading: isUpdating }] =
    useUpdateLeaveApplicationMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(UpdateLeaveApplicationSchema),
    defaultValues: {
      status: data?.status || '',
      reason_declined: data?.reason_declined || '',
    },
  });

  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  const handleStatusChange = (selected: LabelOptionsType | null) => {
    if (selected && selected.value) {
      setValue('status', String(selected.value));
    }
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => setIsOpen(true);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const onSubmit = async (formData: UpdateLeaveApplicationType) => {
    console.log('submitting form data for update', formData);
    console.log('data', formData);
    try {
      const response = await updateLeaveApplication({
        id: data?.id,
        data: formData,
      }).unwrap();
      console.log('response', response);

      setIsError(false);
      setSuccessMessage(' Leave Application Information status successfully!');
      setShowSuccessModal(true);

      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log('errorData', errorData);
        setIsError(true);
        setSuccessMessage(
          'An error occured while Leave Application status Info.Please try again!.',
        );
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage('Unexpected error occured. Please try again.');
        setShowSuccessModal(true);
      }
    } finally {
      refetchData();
    }
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="px-2 py-2 rounded-xl inline-flex items-center space-x-3
         bg-blue-100 text-blue-600 hover:bg-blue-200
          hover:text-blue-700 cursor-pointer transition duration-200 shadow-sm"
        title="Edit Event"
      >
        <FiEdit className="text-sm" />
      </div>

      {isOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn"
            aria-hidden="true"
          ></div>

          <div
            className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-450 md:max-w-450 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6  px-4 justify-between items-center py-6 ">
                  <p className="text-sm md:text-lg lg:text-lg font-bold ">
                    Update Leave Application status
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={25}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3 mt-2 p-3"
                >
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Status
                    </label>
                    <Select
                      options={LeaveStatusOptions}
                      onChange={handleStatusChange}
                      menuPortalTarget={document.body}
                      defaultValue={{
                        value: data?.status || '',
                        label: data?.status || '',
                      }}
                      menuPlacement="auto"
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        control: (base) => ({
                          ...base,
                          minHeight: '24px',
                          minWidth: '200px',
                          borderColor: '#d1d5db',
                          boxShadow: 'none',
                          '&:hover': {
                            borderColor: '#9ca3af',
                          },
                          '&:focus-within': {
                            borderColor: '#9ca3af',
                            boxShadow: 'none',
                          },
                        }),
                      }}
                    />
                    {errors.status && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block space-x-1 text-xs font-bold mb-2">
                      Reason For Declining
                    </label>
                    <textarea
                      id="reason_declined"
                      {...register('reason_declined')}
                      placeholder="Write here..."
                      className="w-full py-2 px-4  
                        text-sm md:text-lg font-normal border placeholder:text-sm  rounded-md focus:outline-none"
                      rows={4}
                      cols={50}
                    />
                    {errors.reason_declined && (
                      <p className="text-red-500 text-sm">
                        {errors.reason_declined.message}
                      </p>
                    )}
                  </div>

                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6 gap-4 md:justify-end items-center py-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-gray-300 bg-white shadow-sm text-gray-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUpdating}
                      className="bg-blue-500 text-white py-2 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isUpdating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          Updating
                        </span>
                      ) : (
                        <span>Update</span>
                      )}
                    </button>
                  </div>
                </form>
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
export default EditLeaveApplication;
