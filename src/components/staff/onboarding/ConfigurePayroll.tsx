'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';
import { OnboardingType } from '@/definitions/onboarding';
import { payrollCreateSchema, PayrollCreateType } from '@/schemas/staff/main';
import { useAddStaffToPayrollMutation } from '@/store/services/staff/staffService';

interface Props {
  refetchData: () => void;
  data: OnboardingType;
}

const AddStaffPayroll = ({ refetchData, data }: Props) => {
  console.log('data', data);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [addStaffToPayroll, { isLoading: isCreating }] =
    useAddStaffToPayrollMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<PayrollCreateType>({
    resolver: zodResolver(payrollCreateSchema),
  });

  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
  };

  const handleOpenModal = () => setIsOpen(true);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const onSubmit = async (formData: PayrollCreateType) => {
    console.log('submitting form data', formData);
    const submissionData = {
      staff: data.staff.id,
      ...formData,
    };
    console.log('submissionData', submissionData);
    try {
      const response = await addStaffToPayroll(submissionData).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Staff added to payroll  successfully!');
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(
          `${errorData.error}` || 'Failed to add staff to payroll',
        );
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
      <div
        onClick={handleOpenModal}
        className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto"
      >
        <div
          className="bg-blue-800 inline-flex cursor-pointer w-max 
         items-center space-x-2 text-white px-4 py-2 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300"
        >
          {/* <FiPlus className="text-lg" /> */}
          <span className="text-xs font-medium">Complete</span>
        </div>
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
                w-full sm:max-w-c-600 md:max-w-600 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Add Staff To Payroll
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={30}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2 p-4 md:p-4 lg:p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Basic Salary<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="Ksh 0"
                          {...register('basic_salary')}
                        />
                        {errors.basic_salary && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.basic_salary.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          House Allowance<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g Ksh 5000 "
                          {...register('house_allowance')}
                        />
                        {errors.house_allowance && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.house_allowance.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Transport Allowance
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. Ksh 8000"
                          {...register('transport_allowance')}
                        />
                        {errors.transport_allowance && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.transport_allowance.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Other Allowances
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g Ksh 1000"
                          {...register('other_allowances')}
                        />
                        {errors.other_allowances && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.other_allowances.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        KRA PIN<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        {...register('kra_pin')}
                        placeholder="Enter valid KRA pin"
                      />
                      {errors.kra_pin && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.kra_pin.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Nssf Number<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. ADXXXXX"
                          {...register('nssf_number')}
                        />
                        {errors.nssf_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.nssf_number.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          NHIF No.<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. 346XXXX"
                          {...register('nhif_number')}
                        />
                        {errors.nhif_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.nhif_number.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Bank Name<span className="text-red-500"></span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g KCB, EQUITY"
                          {...register('bank_name')}
                        />
                        {errors.bank_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.bank_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Bank Acount No.<span className="text-red-500"></span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g  12348XXXX"
                          {...register('bank_account_number')}
                        />
                        {errors.bank_account_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.bank_account_number.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Mpesa No.<span className="text-red-500"></span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g 07xxxx"
                          {...register('mpesa_number')}
                        />
                        {errors.mpesa_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.mpesa_number.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-white z-40 flex  space-x-3 gap-4 md:justify-end items-center py-3">
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

export default AddStaffPayroll;
