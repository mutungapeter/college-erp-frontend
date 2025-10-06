'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { z } from 'zod';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';

import schoolSchema from '@/schemas/curriculum/school';
import { useCreateSchoolMutation } from '@/store/services/curriculum/schoolSService';

const AddSchool = ({ refetchData }: { refetchData: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isError, setIsError] = useState(false);

  const [createSchool, { isLoading: isCreating }] = useCreateSchoolMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schoolSchema),
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

  const onSubmit = async (formData: z.infer<typeof schoolSchema>) => {
    console.log('submitting form data');

    try {
      const response = await createSchool(formData).unwrap();
      console.log('response', response);

      setIsError(false);
      setSuccessMessage('School added successfully!');
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to add School: ${errorData.error}`);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage('Failed to add school. Please try again.');
        setShowSuccessModal(true);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        title="Add New"
        className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FiPlus className="w-4 h-4" />
        <span>New School</span>
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
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-3 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Add New School
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={20}
                      onClick={handleCloseModal}
                      className="text-gray-500  "
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2  p-4 md:p-4 lg:p-4 "
                >
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      School name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      placeholder="e.g X School of computing"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Phone<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="text"
                        {...register('phone')}
                        placeholder="e.g Nairobi"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Location<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="location"
                        type="text"
                        {...register('location')}
                        placeholder="e.g Greec Towers, 5th Floor"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm">
                          {errors.location.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="e.g inform@x.com"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6  gap-4 md:justify-between items-center py-3 ">
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
                      className="bg-primary-600 text-white py-2 hover:bg-primary-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
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
export default AddSchool;
