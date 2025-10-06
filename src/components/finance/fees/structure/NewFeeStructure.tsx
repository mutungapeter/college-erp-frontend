'use client';
import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

import {
  ProgrammeType,
  SemesterType,
  StudyYearType,
} from '@/definitions/curiculum';
import {
  FeeStructureFormData,
  feeStructureSchema,
} from '@/schemas/finance/fees';
import { useGetStudyYearsQuery } from '@/store/services/curriculum/academicYearsService';
import { useGetProgrammesQuery } from '@/store/services/curriculum/programmesService';
import { useGetSemestersQuery } from '@/store/services/curriculum/semestersService';
import { useCreateFeeStructureMutation } from '@/store/services/finance/finaceServices';
import { FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
type SchoolOption = {
  value: string;
  label: string;
};
interface Props {
  refetchData: () => void;
}
const AddFeeStructure = ({ refetchData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [createFeeStructure, { isLoading: isCreating }] =
    useCreateFeeStructureMutation();
  const { data: semeestersData } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: programmesData } = useGetProgrammesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: yearsData } = useGetStudyYearsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FeeStructureFormData>({
    resolver: zodResolver(feeStructureSchema),
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
  const handleSemesterChange = (selected: SchoolOption | null) => {
    if (selected) {
      const semesterId = Number(selected.value);
      setValue('semester', semesterId);
    }
  };

  const handleProgrammeChange = (selected: SchoolOption | null) => {
    if (selected) {
      const programmeId = Number(selected.value);
      setValue('programme', programmeId);
    }
  };
  const handleYearChange = (selected: SchoolOption | null) => {
    if (selected && selected.value) {
      setValue('year_of_study', Number(selected.value));
    }
  };
  const onSubmit = async (formData: FeeStructureFormData) => {
    console.log('submitting form data');

    console.log('payload', formData);
    try {
      const response = await createFeeStructure(formData).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Fee Stucture Created Successfully');
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
        className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FiPlus className="w-4 h-4" />
        <span>Add Fee Structure</span>
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
                    Add new Fee Structure
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
                    <label>Programme</label>
                    <Select
                      options={programmesData?.map((prog: ProgrammeType) => ({
                        value: prog.id,
                        label: `${prog.name}(${prog.level})`,
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
                      onChange={handleProgrammeChange}
                    />

                    {errors.programme && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.programme.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label>Semester</label>
                    <Select
                      options={semeestersData?.map((sem: SemesterType) => ({
                        value: sem.id,
                        label: `${sem.name}(${sem.academic_year.name})`,
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
                      onChange={handleSemesterChange}
                    />

                    {errors.semester && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.semester.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label>Year Of Study</label>
                    <Select
                      options={yearsData?.map((item: StudyYearType) => ({
                        value: item.id,
                        label: item.name,
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
                      onChange={handleYearChange}
                    />

                    {errors.year_of_study && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.year_of_study.message}
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
export default AddFeeStructure;
