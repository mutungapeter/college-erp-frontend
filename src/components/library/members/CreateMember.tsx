'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';

import { MemberCreateType, MemberSchema } from '@/schemas/library/main';
import { useCreateMemberMutation } from '@/store/services/library/libraryService';
import { FiPlus } from 'react-icons/fi';

interface NewMemberProps {
  refetchData: () => void;
}

const NewMember = ({ refetchData }: NewMemberProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [memberType, setMemberType] = useState<'student' | 'staff'>('student');

  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<MemberCreateType>({
    resolver: zodResolver(MemberSchema),
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

  const onSubmit = async (formData: MemberCreateType) => {
    console.log('submitting form data', formData);

    try {
      const cleanData: MemberCreateType = {};

      if (memberType === 'student' && formData.registration_number?.trim()) {
        cleanData.registration_number = formData.registration_number.trim();
      } else if (memberType === 'staff' && formData.staff_number?.trim()) {
        cleanData.staff_number = formData.staff_number.trim();
      }
      const response = await createMember(cleanData).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Member  added successfully!');
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to add member: ${errorData.error}`);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage('Unexpected error occurred. Please try again.');
        setShowSuccessModal(true);
      }
    }
  };
  const handleMemberTypeChange = (type: 'student' | 'staff') => {
    setMemberType(type);
    setValue('registration_number', '');
    setValue('staff_number', '');
  };
  return (
    <>
      <div onClick={handleOpenModal} className="relative group">
        <div
          className="bg-blue-700 inline-flex cursor-pointer p-2
         items-center justify-center space-x-2 text-white rounded-lg hover:bg-blue-700 hover:text-white transition duration-300"
          title="Issue Book"
        >
          <FiPlus className="text-sm" />
          <span className="text-sm">New Member</span>
        </div>

        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          New Member
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
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Add New Member
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
                  <div className="p-4 space-y-4">
                    {/* Member Type Selection */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Member Type
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="memberType"
                            value="student"
                            checked={memberType === 'student'}
                            onChange={() => handleMemberTypeChange('student')}
                            className="mr-2 cursor-pointer"
                          />
                          Student
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="memberType"
                            value="staff"
                            checked={memberType === 'staff'}
                            onChange={() => handleMemberTypeChange('staff')}
                            className="mr-2 cursor-pointer"
                          />
                          Staff
                        </label>
                      </div>
                    </div>

                    {/* Student Registration Number */}
                    {memberType === 'student' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Student Registration Number *
                        </label>
                        <input
                          type="text"
                          required
                          {...register('registration_number')}
                          placeholder="Enter student registration number"
                          className="w-full py-2 px-4 border border-gray-300 placeholder:text-sm rounded-md focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    )}

                    {/* Staff Number */}
                    {memberType === 'staff' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Staff Number *
                        </label>
                        <input
                          type="text"
                          required
                          {...register('staff_number')}
                          placeholder="Enter staff number"
                          className="w-full py-2 px-4 border border-gray-300 placeholder:text-sm rounded-md focus:outline-none  focus:border-blue-500"
                        />
                      </div>
                    )}

                    {errors.registration_number && memberType === 'student' && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-600 text-sm">
                          {errors.registration_number.message}
                        </p>
                      </div>
                    )}

                    {errors.staff_number && memberType === 'staff' && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-600 text-sm">
                          {errors.staff_number.message}
                        </p>
                      </div>
                    )}

                    <div className="sticky bottom-0 bg-white z-40 flex space-x-3 gap-4 md:justify-end items-center py-3">
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
                            <span>Add...</span>
                          </span>
                        ) : (
                          <span>Add</span>
                        )}
                      </button>
                    </div>
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

export default NewMember;
