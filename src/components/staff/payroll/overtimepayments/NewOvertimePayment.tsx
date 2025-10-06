'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';
import Select from 'react-select';

import { StaffType } from '@/definitions/staff';
import {
  overtimeRecordSchema,
  OvertimeRecordsFormData,
} from '@/schemas/payroll/main';
import {
  useCreateOvertimePaymentMutation,
  useGetStaffListQuery,
} from '@/store/services/staff/staffService';
type SchoolOption = {
  value: string;
  label: string;
};
const CreateOvertimePayment = ({
  refetchData,
}: {
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isError, setIsError] = useState(false);

  const [createOvertimePayment, { isLoading: isCreating }] =
    useCreateOvertimePaymentMutation();

  const { data: staffData } = useGetStaffListQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const {
    handleSubmit,
    reset,
    setValue,
    register,
    formState: { isSubmitting, errors },
  } = useForm<OvertimeRecordsFormData>({
    resolver: zodResolver(overtimeRecordSchema),
    defaultValues: {
      staff: undefined,
      date: '',
      hours: 0,
      rate_per_hour: 0,
      approved: false,
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

  const handleStaffChange = (selected: SchoolOption | null) => {
    if (selected) {
      const staffId = Number(selected.value);
      setValue('staff', staffId);
    }
  };

  const onSubmit = async (formData: OvertimeRecordsFormData) => {
    console.log('submitting form data');

    try {
      const response = await createOvertimePayment(formData).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Overtime Payment Added successfully!');
      setShowSuccessModal(true);
      reset();
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
        title="Add Fee Item"
        className="flex items-center space-x-2 p-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FiPlus className="w-4 h-4" />
        <span>Add Overtime Payment</span>
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
                overflow-y-auto rounded-xl  bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-450 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-3 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    New Overtime Payment
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2  p-4 md:p-4 lg:p-4 "
                >
                  <div>
                    <label>Staff</label>
                    <Select
                      options={staffData?.map((item: StaffType) => ({
                        value: item.id,
                        label: `${item.user.first_name} ${item.user.last_name} -  ${item.staff_number} `,
                      }))}
                      menuPortalTarget={document.body}
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
                      onChange={handleStaffChange}
                    />

                    {errors.staff && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.staff.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overtime date
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary "
                        {...register('date')}
                      />
                    </div>
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate Per Hour
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary "
                          {...register('rate_per_hour')}
                          placeholder="Ksh"
                        />
                      </div>
                      {errors.rate_per_hour && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.rate_per_hour.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hours
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary "
                          {...register('hours')}
                        />
                      </div>
                      {errors.hours && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.hours.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6  gap-4 md:justify-end items-center py-3 ">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-gray-300 bg-white shadow-sm text-gray-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isCreating}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isCreating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Adding...</span>
                        </span>
                      ) : (
                        <span>Add</span>
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
export default CreateOvertimePayment;
