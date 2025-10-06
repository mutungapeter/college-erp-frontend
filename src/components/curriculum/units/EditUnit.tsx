'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import { z } from 'zod';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import Select, { SingleValue } from 'react-select';

import CreateAndUpdateButton from '@/components/common/CreateAndUpdateButton';
import ModalBottomButton from '@/components/common/StickyModalFooterButtons';
import {
  CourseType,
  DepartmentType,
  ProgrammeType,
  SchoolType,
  SemesterType,
  StudyYearType,
} from '@/definitions/curiculum';
import { unitSchema } from '@/schemas/curriculum/courses';
import { useGetStudyYearsQuery } from '@/store/services/curriculum/academicYearsService';
import { useUpdateCourseMutation } from '@/store/services/curriculum/coursesService';
import { useGetDepartmentsQuery } from '@/store/services/curriculum/departmentsService';
import { useGetProgrammesQuery } from '@/store/services/curriculum/programmesService';
import { useGetSchoolsQuery } from '@/store/services/curriculum/schoolSService';
import { useGetSemestersQuery } from '@/store/services/curriculum/semestersService';
import { FiEdit } from 'react-icons/fi';

const UpdateUnit = ({
  data,
  refetchData,
}: {
  data: CourseType;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  //   console.log("data", data);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isError, setIsError] = useState(false);

  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const { data: schoolsData } = useGetSchoolsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  //   console.log("schoolsData", schoolsData);
  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: programmesData } = useGetProgrammesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: studyYears } = useGetStudyYearsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: semesters } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const {
    register,
    handleSubmit,

    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: data?.name || '',
      course_code: data?.course_code || '',
      school: data?.school?.id ?? undefined,
      programme: data?.programme?.id ?? undefined,
      study_year: data?.study_year?.id ?? undefined,
      semester: data?.semester?.id ?? undefined,
      department: data?.department?.id ?? undefined,
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
  const handleSchoolChange = (
    selected: SingleValue<{ value: number | null; label: string }>,
  ) => {
    if (selected) {
      setValue('school', Number(selected.value));
    }
  };
  const handleDepartmentChange = (
    selected: SingleValue<{ value: number | null; label: string }>,
  ) => {
    if (selected) {
      setValue('department', Number(selected.value));
    }
  };
  const handleProgrammeChange = (
    selected: SingleValue<{ value: number | null; label: string }>,
  ) => {
    if (selected) {
      setValue('programme', Number(selected.value));
    }
  };

  const handleStudyYearChange = (
    selected: SingleValue<{ value: number | null; label: string }>,
  ) => {
    if (selected) {
      const itemId = Number(selected.value);
      setValue('study_year', itemId);
    }
  };
  const handleSemesterYearChange = (
    selected: SingleValue<{ value: number | null; label: string }>,
  ) => {
    if (selected) {
      setValue('semester', Number(selected.value));
    } else {
      setValue('semester', null);
    }
  };

  const onSubmit = async (formData: z.infer<typeof unitSchema>) => {
    console.log('submitting form data');

    try {
      const response = await updateCourse({
        id: data.id,
        data: formData,
      }).unwrap();
      console.log('response', response);

      setIsError(false);
      setSuccessMessage('Course Updated successfully!');
      setShowSuccessModal(true);

      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to update Course: ${errorData.error}`);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage('Unexpected Error occured. Please try again.');
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
        // title="Edit"
        label="Edit"
        icon={<FiEdit className="w-4 h-4 text-amber-500" />}
        className="
    px-4 py-2 w-full 
    border-none 
    focus:outline-none 
    focus:border-transparent 
    focus:ring-0 
    active:outline-none 
    active:ring-0
    hover:bg-gray-100
  "
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
            className="fixed inset-0 min-h-full   z-100 w-screen flex flex-col text-center md:items-center
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center 
              animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-2xl  bg-white 
                text-left shadow-xl transition-all   
                w-full sm:max-w-c-500 md:max-w-500 px-3 font-inter"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-3 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Edit Unit
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
                      name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      placeholder="e.g X Copmuter Science Department"
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
                      <label>School</label>
                      <Select
                        options={schoolsData?.map((school: SchoolType) => ({
                          value: school.id.toString(),
                          label: school.name,
                        }))}
                        menuPortalTarget={document.body}
                        defaultValue={{
                          value: data?.school?.id || null,
                          label: data?.school?.name || '',
                        }}
                        menuPlacement="auto"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: '25px',
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
                        onChange={handleSchoolChange}
                      />

                      {errors.school && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.school.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Department</label>
                      <Select
                        options={departmentsData?.map(
                          (depart: DepartmentType) => ({
                            value: depart.id,
                            label: depart.name,
                          }),
                        )}
                        defaultValue={{
                          value: data?.department?.id || null,
                          label: data?.department?.name || '',
                        }}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: '25px',
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
                        onChange={handleDepartmentChange}
                      />

                      {errors.school && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.school.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Course Code
                      </label>
                      <input
                        id="course_code"
                        type="text"
                        {...register('course_code')}
                        placeholder="e.g BIT"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.course_code && (
                        <p className="text-red-500 text-sm">
                          {errors.course_code.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Programme</label>
                      <Select
                        options={programmesData?.map((prog: ProgrammeType) => ({
                          value: prog.id,
                          label: prog.name,
                        }))}
                        defaultValue={{
                          value: data?.programme?.id || null,
                          label: data?.programme?.name || '',
                        }}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: '25px',
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

                      {errors.school && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.school.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Study Year<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={studyYears?.map((item: StudyYearType) => ({
                          value: item?.id,
                          label: `${item?.name ?? ''}`,
                        }))}
                        defaultValue={{
                          label: data?.study_year?.name ?? '',
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
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Semeseter<span className="text-red-500"></span>
                      </label>
                      <Select
                        options={semesters?.map((item: SemesterType) => ({
                          value: item?.id,
                          label: `${item?.name ?? ''}`,
                        }))}
                        defaultValue={{
                          label: data?.semester?.name ?? '',
                          value: data?.semester?.id,
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
                        onChange={handleSemesterYearChange}
                      />

                      {errors.semester && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.semester.message}
                        </p>
                      )}
                    </div>
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
export default UpdateUnit;
