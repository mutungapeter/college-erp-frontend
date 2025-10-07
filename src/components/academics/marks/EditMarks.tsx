'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';
import Select, { SingleValue } from 'react-select';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';

import { IoCloseOutline } from 'react-icons/io5';

import CreateAndUpdateButton from '@/components/common/CreateAndUpdateButton';
import ModalBottomButton from '@/components/common/StickyModalFooterButtons';
import { MarksType } from '@/definitions/academics';
import { StudyYearType } from '@/definitions/curiculum';
import { ExamDataCreate, examDataCreateSchema } from '@/schemas/exams/main';
import { useUpdateMarksMutation } from '@/store/services/academics/acadmicsService';
import { useGetStudyYearsQuery } from '@/store/services/curriculum/academicYearsService';

const EditMarks = ({
  data,
  refetchData,
}: {
  data: MarksType | null;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log("data", data)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isError, setIsError] = useState(false);

  const [updateMarks, { isLoading: isUpdating }] = useUpdateMarksMutation();
    const { data: studyYears } = useGetStudyYearsQuery(
      {},
      { refetchOnMountOrArgChange: true },
    );

  const {
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting, errors },
  } =  useForm<ExamDataCreate>({
      resolver: zodResolver(examDataCreateSchema),
    defaultValues: {
      cat_one: data?.cat_one ? Number(data.cat_one) : 0,
      cat_two: data?.cat_two ? Number(data.cat_two) : 0,
      exam_marks: data?.exam_marks ? Number(data.exam_marks) : 0,
      study_year: data?.study_year?.id ?? undefined,
    },
  });
  console.log('data', data);
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

const handleStudyYearChange = (
  selected: SingleValue<{ value: number | undefined; label?: string }>
) => {
  if (selected) {
    const itemId = Number(selected.value);
    setValue('study_year', itemId);
  }
};

  const onSubmit = async (formData: ExamDataCreate) => {
    console.log('submitting form data for update', formData);
    console.log('data', formData);
    try {
      const response = await updateMarks({
        id: data?.id,
        data: formData,
      }).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Marks   updated successfully!');
      setShowSuccessModal(true);
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log('errorData', errorData);
        setIsError(true);
        setSuccessMessage(
          'An error occured while updating marks.Please try again!.',
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
        icon={<FiEdit className="w-3 h-4" />}
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
            className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-2xl
                 bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-450 md:max-w-450 px-3"
            >
              <>
                <div
                  className="sticky top-0 bg-white z-40
                 flex sm:px-6 px-4 justify-between items-center py-6 "
                >
                  <p className="text-sm md:text-lg lg:text-lg font-bold ">
                    Edit Marks
                  </p>

                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={25}
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
                        value={`${data?.student?.user.first_name} ${data?.student?.user.last_name}`}
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
                        value={data?.student?.registration_number}
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
                        value={data?.cohort?.name}
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
                        value={`${data?.semester?.name} (${data?.semester?.academic_year})`}
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
                      value={`${data?.course?.course_code} - ${data?.course?.name}`}
                      readOnly
                      className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                    />
                  </div>
                </div> */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3 mt-2 p-3"
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
                                        defaultValue={{
                                          label: data?.study_year?.name,
                                          value: data?.study_year?.id,
                                        }}
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
export default EditMarks;
