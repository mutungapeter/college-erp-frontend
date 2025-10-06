'use client';
import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';
import { Account_type } from '@/definitions/finance/accounts/main';
import { LabelOptionsType } from '@/definitions/Labels/labelOptionsType';
import {
  AccountTypeFormData,
  accountTypeSchema,
  NormalBalanceOptions,
} from '@/schemas/finance/accounts/accountTypes';
import { useUpdateAccountTypeMutation } from '@/store/services/finance/accounting';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';

interface Props {
  refetchData: () => void;
  data: Account_type;
}
const UpdateFinanceAccountType = ({ refetchData, data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [updateAccountType, { isLoading: isCreating }] =
    useUpdateAccountTypeMutation();

  const {
    handleSubmit,
    setValue,
    register,

    formState: { isSubmitting, errors },
  } = useForm<AccountTypeFormData>({
    resolver: zodResolver(accountTypeSchema),
    defaultValues: {
      name: data?.name ?? '',
      normal_balance: data?.normal_balance ?? '',
    },
  });

  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  const handleNormalBalanceChange = (selected: LabelOptionsType | null) => {
    if (selected) {
      setValue('normal_balance', String(selected.value));
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setShowSuccessModal(false);
  };
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };
  const onSubmit = async (formData: AccountTypeFormData) => {
    console.log('submitting form data');

    console.log('payload', formData);
    try {
      const response = await updateAccountType({
        id: data.id,
        data: formData,
      }).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Account Type Updated Successfully');
      setShowSuccessModal(true);
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
        title="Edit Account Type"
        className="group relative p-2 bg-amber-100 text-amber-500 rounded-md hover:bg-amber-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FiEdit className="w-4 h-4" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Edit account type
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
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
            aria-hidden="true"
          />

          <div className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center justify-center overflow-y-auto p-2 md:p-3 pointer-events-none">
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
          overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
          w-full sm:max-w-c-450 md:max-w-450 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-4 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Add New Account
                  </p>
                  <IoCloseOutline
                    size={20}
                    className="cursor-pointer"
                    onClick={handleCloseModal}
                  />
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4   p-4 md:p-4 lg:p-4 "
                >
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      placeholder="e.g Liabilities"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block space-x-1 text-sm font-medium mb-2">
                      Normal Balance<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={NormalBalanceOptions}
                      defaultValue={{
                        value: data?.normal_balance,
                        label: data?.normal_balance,
                      }}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        control: (base) => ({
                          ...base,
                          minHeight: '25px',
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
                      onChange={handleNormalBalanceChange}
                    />

                    {errors.normal_balance && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.normal_balance.message}
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
export default UpdateFinanceAccountType;
