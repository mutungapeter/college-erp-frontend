'use client';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import { LiaUserCheckSolid } from 'react-icons/lia';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useGetStudyYearsQuery } from '@/store/services/curriculum/academicYearsService';
import { usePromoteStudentMutation } from '@/store/services/reporting/reportingService';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';
import { LabelOptionsType } from '@/definitions/Labels/labelOptionsType';
import {
  SinglePromotionFormData,
  singlePromotionSchema,
} from '@/schemas/curriculum/semesterReporting';
import { StudyYearType } from '@/definitions/curiculum';

interface Props {
  refetchData: () => void;
}
const SingleStudentsPromotion = ({ refetchData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [promoteStudent, { isLoading: isCreating }] =
    usePromoteStudentMutation();

  const { data: studyYearsData } = useGetStudyYearsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const {
    register,
    handleSubmit,
    setValue,

    reset,
    formState: { isSubmitting, errors },
  } = useForm<SinglePromotionFormData>({
    resolver: zodResolver(singlePromotionSchema),
  });

  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);
  const onSubmit = async (formData: SinglePromotionFormData) => {
    console.log('Form Data:', formData);
    try {
      await promoteStudent(formData).unwrap();
      toast.success('Student promoted to next study year successfully!');
      handleCloseModal();
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      handleCloseModal();
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        toast.error(errorData.error);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };

  console.log('acadmicyearsData', studyYearsData);

  const handleStudyYearChange = (selected: LabelOptionsType | null) => {
    console.log('item:', selected?.value, typeof selected?.value);

    if (selected) {
      const itemId = Number(selected.value);
      setValue('study_year', itemId);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        title="Single promotion"
        className="flex items-center space-x-2 py-2 px-4 border border-secondary-500  text-secondary rounded-md hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <LiaUserCheckSolid className="w-4 h-4" />
        <span>Promote Student</span>
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
                    Promote Student to Next Study Year
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
                      Admission No:<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="admissionNumber"
                      placeholder="Enter a valid reg no"
                      {...register('registration_number')}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.registration_number && (
                      <p className="text-red-500 text-sm">
                        {String(errors.registration_number.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Study Year Promoting To
                      <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={studyYearsData?.map((item: StudyYearType) => ({
                        value: item.id,
                        label: `${item.name}`,
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
                      onChange={handleStudyYearChange}
                    />

                    {errors.study_year && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.study_year.message}
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
          </div>
        </div>
      )}
    </>
  );
};
export default SingleStudentsPromotion;
