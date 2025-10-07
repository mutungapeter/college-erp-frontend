'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select, { SingleValue } from 'react-select';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';

import {
  CourseType,
  ProgrammeCohortType,
  SemesterType,
  StudyYearType,
} from '@/definitions/curiculum';

import CreateAndUpdateButton from '@/components/common/CreateAndUpdateButton';
import ModalBottomButton from '@/components/common/StickyModalFooterButtons';
import { StudentDetailsType } from '@/definitions/students';
import { ExamDataCreate, examDataCreateSchema } from '@/schemas/exams/main';
import { useAddMarksMutation } from '@/store/services/academics/acadmicsService';
import { useGetStudyYearsQuery } from '@/store/services/curriculum/academicYearsService';

type AddMarksProps = {
  student: StudentDetailsType;
  course: CourseType;
  semester: SemesterType;
  cohort: ProgrammeCohortType;
  refetchData: () => void;
};

const AddMarks = ({
  refetchData,
  student,
  course,
  semester,
  cohort,
}: AddMarksProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [addMarks, { isLoading: isCreating }] = useAddMarksMutation();
  const { data: studyYears } = useGetStudyYearsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ExamDataCreate>({
    resolver: zodResolver(examDataCreateSchema),
    defaultValues: {
      cat_one: 0,
      cat_two: 0,
      exam_marks: 0,
      // study_year: data?.current_year?.id || null,
    },
  });
  const cat_one = watch('cat_one');
  const cat_two = watch('cat_two');
  const exam_marks = watch('exam_marks');

  const total = (Number(cat_one) + Number(cat_two)) / 2 + Number(exam_marks);
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
  const handleStudyYearChange = (
  selected: SingleValue<{ value: number | undefined; label?: string }>
) => {
  if (selected) {
    const itemId = Number(selected.value);
    setValue('study_year', itemId);
  }
};

  const onSubmit = async (formData: ExamDataCreate) => {
    const submissionData = {
      student: student.id,
      //   programme: programme.id,
      course: course.id,
      semester: semester.id,
      cohort: cohort.id,
      ...formData,
    };

    try {
      const response = await addMarks(submissionData).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Marks Added successfully!');
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to add Marks: ${errorData.error}`);
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
        label="Add Marks"
        icon={<FiPlus className="w-4 h-4" />}
        className="bg-primary-500 text-white px-4 py-2 hover:bg-primary-600 focus:ring-primary-500 focus:ring-offset-1"
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
                overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div
                  className="sticky top-0 bg-white z-40 flex px-4
                 justify-between items-center py-6"
                >
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Add Marks
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={20}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>
                {/* <div className="p-3 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Student Name
                      </label>
                      <input
                        type="text"
                        value={`${student?.user.first_name} ${student?.user.last_name}`}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        value={student?.registration_number}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Cohort/Class
                      </label>
                      <input
                        type="text"
                        value={cohort?.name}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Semester
                      </label>
                      <input
                        type="text"
                        value={`${semester?.name} (${semester?.academic_year.name})`}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={`${course?.course_code} - ${course?.name}`}
                      readOnly
                      className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                    />
                  </div>
                </div> */}

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 p-3 "
                >
                  <div className="relative">
                    <label className="block space-x-1 text-sm font-medium mb-2">
                      Study Year<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={studyYears?.map((item: StudyYearType) => ({
                        value: item.id,
                        label: `${item.name}`,
                      }))}
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      isClearable={true}
                      isSearchable={true}
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        control: (base) => ({
                          ...base,
                          minHeight: '26px',
                          minWidth: '200px',
                          borderColor: '#d1d5db',
                          boxShadow: 'none',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: '#9ca3af',
                          },
                          '&:focus-within': {
                            borderColor: '#9ca3af',
                            boxShadow: 'none',
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                          cursor: 'pointer',
                        }),
                        option: (base) => ({
                          ...base,
                          cursor: 'pointer',
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm">Cat One</label>
                      <input
                        type="number"
                        {...register('cat_one')}
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.cat_one && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cat_one.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm">Cat Two</label>
                      <input
                        type="number"
                        {...register('cat_two')}
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.cat_two && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cat_two.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm">Exam Marks</label>
                      <input
                        type="number"
                        {...register('exam_marks')}
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.exam_marks && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.exam_marks.message}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <label className="block text-sm font-medium text-gray-700">
                        Total
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={total.toFixed(2)}
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
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

export default AddMarks;
