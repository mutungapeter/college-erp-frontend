'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';

import { EntitlementType } from '@/definitions/leaves';
import {
  LeaveEntitlementFormData,
  LeaveEntitlementSchema,
} from '@/schemas/staff/leaves';
import { useUpdateLeaveEntitlementMutation } from '@/store/services/staff/leaveService';
import { FiEdit } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';

interface Props {
  refetchData: () => void;
  data: EntitlementType;
}
const EditLeaveEntitlement = ({ refetchData, data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [updateLeaveEntitlement, { isLoading: isCreating }] =
    useUpdateLeaveEntitlementMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LeaveEntitlementFormData>({
    resolver: zodResolver(LeaveEntitlementSchema),
    defaultValues: {
      staff: data?.staff?.id ?? undefined,
      year: data?.year ?? undefined,
      total_days: data?.total_days ?? undefined,
    },
  });
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const onSubmit = async (formData: LeaveEntitlementFormData) => {
    console.log('submitting form data', formData);

    try {
      const response = await updateLeaveEntitlement({
        id: data.id,
        data: formData,
      }).unwrap();
      console.log('response', response);
      const successMessage =
        response.message || 'Leave Entitlement Updated Successfully';

      setIsError(false);
      setSuccessMessage(successMessage);
      setShowSuccessModal(true);
      //   reset();
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(errorData.error);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage('Unexpected error occured. Please try again.');
        setShowSuccessModal(true);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        title="Edit Structure"
        className="group relative p-2 bg-amber-100 text-amber-500 rounded-md hover:bg-amber-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FiEdit className="w-4 h-4" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Edit Entitlement
        </span>
      </button>

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
            className="fixed inset-0 min-h-full   z-100 w-screen flex flex-col text-center md:items-center
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-md  bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-450 md:max-w-450 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-4 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Update Leave Entitlement
                  </p>
                  <IoCloseOutline
                    size={20}
                    className="cursor-pointer"
                    onClick={handleCloseModal}
                  />
                </div>
                <div className="p-3 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Staff
                    </label>
                    <input
                      type="text"
                      value={`${data?.staff.user?.first_name} ${data?.staff.user?.last_name}`}
                      readOnly
                      className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Used Days
                      </label>
                      <input
                        type="text"
                        value={`${data?.used_days}`}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Remaining Days
                      </label>
                      <input
                        type="text"
                        value={data?.remaining_days}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4   p-4 md:p-4 lg:p-4 "
                >
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Year<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="number"
                      {...register('year')}
                      placeholder="e.g 2023"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.year && (
                      <p className="text-red-500 text-sm">
                        {errors.year.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Total days Entitled P.a
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="number"
                      {...register('total_days')}
                      placeholder="Enter days"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.total_days && (
                      <p className="text-red-500 text-sm">
                        {errors.total_days.message}
                      </p>
                    )}
                  </div>

                  <div className="sticky bottom-0 bg-white z-40 flex md:px-4  gap-4 md:justify-between items-center py-2 ">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-red-500 bg-white shadow-sm text-red-500 py-2 text-sm px-4 rounded-lg w-full min-w-[100px] md:w-auto hover:bg-red-500 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isCreating}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-lg w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isCreating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Submitting...</span>
                        </span>
                      ) : (
                        <span>Submit</span>
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
export default EditLeaveEntitlement;
