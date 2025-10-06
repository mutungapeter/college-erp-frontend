'use client';
import { useEffect, useState } from 'react';

import {
  AcademicYearFormDataType,
  academicYearSchema,
} from '@/schemas/curriculum/academicYears';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

import CreateAndUpdateButton from '@/components/common/CreateAndUpdateButton';
import ModalBottomButton from '@/components/common/StickyModalFooterButtons';
import { useCreateAcademicYearMutation } from '@/store/services/curriculum/academicYearsService';
import { getApiErrorMessage } from '@/utils/errorHandler';
import { FiPlus } from 'react-icons/fi';

interface Props {
  refetchData: () => void;
}
const NewAcadmicYear = ({ refetchData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [createAcademicYear, { isLoading: isCreating }] =
    useCreateAcademicYearMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<AcademicYearFormDataType>({
    resolver: zodResolver(academicYearSchema),
  });

  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);
  const onSubmit = async (formData: AcademicYearFormDataType) => {
    console.log('Form Data:', formData);
    try {
      const res = await createAcademicYear(formData).unwrap();
      const msg = res?.message || 'Academic Year  added successfully!';
      toast.success(msg);
      handleCloseModal();
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      handleCloseModal();
      toast.error(getApiErrorMessage(error));
    } finally {
      handleCloseModal();
      refetchData();
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <>
      <CreateAndUpdateButton
        onClick={handleOpenModal}
        title="Add New"
        label="Add Acdemic Year"
        icon={<FiPlus className="w-4 h-4" />}
        className="flex items-center space-x-2 px-4 py-2
               bg-primary
               text-white rounded-md hover:bg-emerald-600
               focus:outline-none focus:ring-2 focus:ring-primary-500 
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
                    Add New Academic Year
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
                      type="text"
                      id="admissionNumber"
                      placeholder="Enter name"
                      {...register('name')}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {String(errors.name.message)}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-6">
                    {/* Start Date */}
                    <div>
                      <label className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-700">
                          Start Date
                        </span>
                        <input
                          type="date"
                          {...register('start_date')}
                          className="
        h-10 px-3 rounded border border-gray-300
        focus:ring-primary focus:border-primary
        text-sm text-gray-700
      "
                        />
                      </label>
                      {errors.start_date && (
                        <p className="text-red-500 text-sm">
                          {String(errors.start_date.message)}
                        </p>
                      )}
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-700">End Date</span>
                        <input
                          type="date"
                          {...register('end_date')}
                          className="
        h-10 px-3 rounded border border-gray-300
        focus:ring-primary focus:border-primary
        text-sm text-gray-700
      "
                        />
                      </label>
                      {errors.end_date && (
                        <p className="text-red-500 text-sm">
                          {String(errors.end_date.message)}
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
          </div>
        </div>
      )}
    </>
  );
};
export default NewAcadmicYear;
