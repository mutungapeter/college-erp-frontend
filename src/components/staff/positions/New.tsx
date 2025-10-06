'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';

import CreateAndUpdateButton from '@/components/common/CreateAndUpdateButton';
import ModalBottomButton from '@/components/common/StickyModalFooterButtons';
import {
  createPositionFormData,
  createPositionSchema,
} from '@/schemas/staff/main';
import { useCreatePositionMutation } from '@/store/services/staff/staffService';

const CreatePosition = ({ refetchData }: { refetchData: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [createPosition, { isLoading: isCreating }] =
    useCreatePositionMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<createPositionFormData>({
    resolver: zodResolver(createPositionSchema),
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

  const onSubmit = async (formData: createPositionFormData) => {
    console.log('submitting form data', formData);

    try {
      const response = await createPosition(formData).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Position Created successfully!');
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to create position: ${errorData.error}`);
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
      <CreateAndUpdateButton
        onClick={handleOpenModal}
        title="Add New"
        label="New Position"
        icon={<FiPlus className="w-4 h-4" />}
        className="flex items-center space-x-2 px-4 py-2
                     bg-emerald-500
                     text-white rounded-md hover:bg-emerald-600
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 
                     focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      />

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
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-400 md:max-w-400 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Add Position
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={20}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2 p-4 md:p-4 lg:p-4"
                >
                  <div>
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        placeholder="e.g. H.O.D , Accountant"
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <ModalBottomButton
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                    isProcessing={isCreating}
                  />
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

export default CreatePosition;
