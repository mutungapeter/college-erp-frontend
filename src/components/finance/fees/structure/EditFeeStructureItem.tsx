'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';

import { Feeitem } from '@/definitions/finance/fees/feeStructure';
import {
  FeeStructureItemFormData,
  feeStructureItemSchema,
} from '@/schemas/finance/fees';
import { useUpdateFeeStructureItemMutation } from '@/store/services/finance/finaceServices';
import { FiEdit } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';

interface Props {
  refetchData: () => void;
  data: Feeitem;
}
const EditFeeStructureItem = ({ refetchData, data }: Props) => {
  //   console.log("data=============", data);
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [updateFeeStructureItem, { isLoading: isCreating }] =
    useUpdateFeeStructureItemMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FeeStructureItemFormData>({
    resolver: zodResolver(feeStructureItemSchema),
    defaultValues: {
      description: data?.description ?? '',
      amount: Number(data?.amount) ?? 0,
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

  const onSubmit = async (formData: FeeStructureItemFormData) => {
    console.log('submitting form data');

    try {
      const response = await updateFeeStructureItem({
        id: data.id,
        data: formData,
      }).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Fee Stucture item Updated Successfully');
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
        title="Edit Structure"
        className="group relative p-2 bg-amber-100 text-amber-500 rounded-md hover:bg-amber-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FiEdit className="w-4 h-4" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Edit Fee Structure Item
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
                    Edit Fee Structure Item
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
                      Amount<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="number"
                      {...register('amount')}
                      placeholder="Ksh"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Description/What is the amount for
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="name"
                      {...register('description')}
                      placeholder="e.g Tution Fee"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      rows={3}
                      cols={15}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">
                        {errors.description.message}
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
                          <span>Updating...</span>
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
export default EditFeeStructureItem;
