'use client';
import { zodResolver } from '@hookform/resolvers/zod';

import CreateAndUpdateButton from '@/components/common/CreateAndUpdateButton';
import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import ModalBottomButton from '@/components/common/StickyModalFooterButtons';
import { ApplicationType } from '@/definitions/admissions';
import { updateGurdianSchema } from '@/schemas/admissions/main';
import { useUpdateApplicationMutation } from '@/store/services/admissions/admissionsService';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { z } from 'zod';

const EditGuardianApplicationPersonalInfo = ({
  data,
  refetchData,
}: {
  data: ApplicationType | null;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isError, setIsError] = useState(false);

  const [updateApplication, { isLoading: isUpdating }] =
    useUpdateApplicationMutation();

  const {
    register,
    handleSubmit,

    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(updateGurdianSchema),
    defaultValues: {
      guardian_name: data?.guardian_name || '',
      guardian_email: data?.guardian_email || '',
      guardian_relationship: data?.guardian_relationship || '',
      guardian_phone_number: data?.guardian_phone_number || '',
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

  const onSubmit = async (formData: z.infer<typeof updateGurdianSchema>) => {
    console.log('submitting form data for update', formData);
    console.log('data', formData);
    try {
      const response = await updateApplication({
        id: data?.id,
        data: formData,
      }).unwrap();
      console.log('response', response);

      setIsError(false);
      setSuccessMessage('Personal Info updated successfully!');
      setShowSuccessModal(true);

      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log('errorData', errorData);
        setIsError(true);
        setSuccessMessage(
          'An error occured while updating Personal Info.Please try again!.',
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
      <CreateAndUpdateButton
        onClick={handleOpenModal}
        title="Edit"
        icon={<FiEdit className="w-4 h-4" />}
        className="group relative p-2 bg-amber-100 text-amber-500 hover:bg-amber-600 hover:text-white focus:ring-amber-500"
        tooltip="Edit"
      />

      {isOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            // onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn"
            aria-hidden="true"
          ></div>

          <div
            className="fixed inset-0 min-h-full z-100 w-screen 
            flex flex-col text-center md:items-center
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center 
              animate-fadeIn max-h-[90vh] font-inter
                overflow-y-auto rounded-2xl bg-white 
                text-left shadow-xl transition-all   
                w-full sm:max-w-c-450 md:max-w-450 px-3"
            >
              <>
                <div
                  className="sticky top-0 bg-white z-40 flex px-2 
                justify-between items-center py-6 "
                >
                  <p className="text-sm md:text-lg lg:text-lg font-bold ">
                    Edit Guardian Information
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
                  className="space-y-5 mt-2 p-3"
                >
                  <div>
                    <label className="block space-x-1 text-sm font-bold mb-2">
                      Guardian name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="guardian_name"
                      type="text"
                      {...register('guardian_name')}
                      placeholder="Enter new First name"
                      className="w-full py-2 px-4 text-sm bg-slate-50 border font-light placeholder:text-sm rounded-md focus:outline-none"
                    />
                    {errors.guardian_name && (
                      <p className="text-red-500 text-sm">
                        {errors.guardian_name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Guardian email
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register('guardian_email')}
                        placeholder="e.g user@example.com"
                        className="w-full py-2 px-4 text-sm bg-slate-50 border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.guardian_email && (
                        <p className="text-red-500 text-sm">
                          {errors.guardian_email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Guardian relationship
                        <span className="text-red-500"></span>
                      </label>
                      <input
                        id="guardian_relationship"
                        type="text"
                        {...register('guardian_relationship')}
                        placeholder="e.g Father , Mother ,Uncle etc"
                        className="w-full py-2 px-4 text-sm bg-slate-50 border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.guardian_relationship && (
                        <p className="text-red-500 text-sm">
                          {errors.guardian_relationship.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Guardian Phone<span className="text-red-500"></span>
                    </label>
                    <input
                      id="guardian_phone_number"
                      type="text"
                      {...register('guardian_phone_number')}
                      placeholder="e.g 07xxxxxxxxx"
                      className="w-full py-2 px-4 text-sm bg-slate-50 border font-light placeholder:text-sm rounded-md focus:outline-none"
                    />
                    {errors.guardian_phone_number && (
                      <p className="text-red-500 text-sm">
                        {errors.guardian_phone_number.message}
                      </p>
                    )}
                  </div>

                  <ModalBottomButton
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                    isProcessing={isUpdating}
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
export default EditGuardianApplicationPersonalInfo;
