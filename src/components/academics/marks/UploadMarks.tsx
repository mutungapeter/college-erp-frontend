import { useEffect, useRef, useState } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { zodResolver } from '@hookform/resolvers/zod';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';
import {
  CourseType,
  ProgrammeCohortType,
  SemesterType,
  StudyYearType,
} from '@/definitions/curiculum';
import { uploadMarksSchema } from '@/schemas/exams/main';
import { useUploadMarksMutation } from '@/store/services/academics/acadmicsService';
import { useGetStudyYearsQuery } from '@/store/services/curriculum/academicYearsService';
import { useGetCohortsQuery } from '@/store/services/curriculum/cohortsService';
import { useGetCoursesQuery } from '@/store/services/curriculum/coursesService';
import { useGetSemestersQuery } from '@/store/services/curriculum/semestersService';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import { MdOutlineCloudUpload } from 'react-icons/md';
import Select from 'react-select';
import { z } from 'zod';
interface Props {
  refetchData: () => void;
}
type SelectOption = {
  value: string | number;
  label: string;
};
type FormValues = z.infer<typeof uploadMarksSchema>;
const UploadMarks = ({ refetchData }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadMarks, { isLoading: isUploading }] = useUploadMarksMutation();

  const { data: courses } = useGetCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: semesters } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: cohorts } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: studyYears } = useGetStudyYearsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setError('');
    reset();
  };
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    closeModal();
  };
  const {
    setValue,
    reset,
    handleSubmit,

    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(uploadMarksSchema),
  });
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  const handleSemesterChange = (selected: SelectOption | null) => {
    if (selected) {
      const semId = Number(selected.value);
      setValue('semester', semId);
    }
  };
  const handleCohortChange = (selected: SelectOption | null) => {
    if (selected) {
      const cohortId = Number(selected.value);
      setValue('cohort', cohortId);
    }
  };
  const handleStudyYearChange = (selected: SelectOption | null) => {
    if (selected) {
      const itemId = Number(selected.value);
      setValue('study_year', itemId);
    }
  };
  const handleCourseChange = (selected: SelectOption | null) => {
    if (selected) {
      const courseId = Number(selected.value);
      setValue('course', courseId);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');

    if (!selectedFile) return;

    setFile(selectedFile);
    setValue('file', selectedFile, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError('');

    const selectedFile = e.dataTransfer.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setValue('file', selectedFile, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onSubmit = async (data: FormValues) => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('course', String(data.course));
    formData.append('semester', String(data.semester));
    formData.append('cohort', String(data.cohort));

    console.log('formData', formData);
    try {
      const response = await uploadMarks(formData).unwrap();
      console.log('response', response);

      setSuccessMessage(
        `Upload complete! ${response.count} marks record(s) Uploaded, ${response.failed_count} failed.`,
      );

      setShowSuccessModal(true);
      setIsError(false);
      refetchData();
      setFile(null);
      setError('');
      reset();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      setError(
        'Failed to upload marks,confirm that  all required fields is included in the uploaded file .',
      );
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log('errorData', errorData);

        const msg =
          errorData.error || 'Marks upload failed.Look for duplicate entries.';
        setSuccessMessage(msg);
        setShowSuccessModal(true);
      } else {
        toast.error('Unexpected erorr occured. Please try again.');
      }
    } finally {
      setFile(null);
      setError('');
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div
        onClick={openModal}
        className="flex items-center space-x-2 px-4 py-2 bg-primary-50
         hover:bg-primary-30 text-primary border-2 border-primary   rounded-md 
         transition duration-300 shadow-sm cursor-pointer"
      >
        <MdOutlineCloudUpload className="text-lg md:text-xl" />
        <span className="text-sm md:text-lg">Upload Marks</span>
      </div>

      {isModalOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={closeModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn"
            aria-hidden="true"
          ></div>

          <div
            className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center
               justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center font-inter animate-fadeIn max-h-[90vh]
                    overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all   
                    w-full sm:max-w-c-550 md:max-w-550 px-3"
            >
              <>
                <div
                  className="sticky top-0 bg-white z-40 
                    flex  px-4 justify-between items-center py-6"
                >
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Upload Marks
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={20}
                      onClick={closeModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  encType="multipart/form-data"
                  className="space-y-5 px-3 "
                >
                  <div className="grid grid-cols md:grid-cols-2 grid-cols-1 gap-3">
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Class<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={cohorts?.map((item: ProgrammeCohortType) => ({
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
                        onChange={handleCohortChange}
                      />

                      {errors.cohort && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cohort.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Unit<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={courses?.map((item: CourseType) => ({
                          value: item.id,
                          label: `${item.course_code}(${item.name})`,
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
                        onChange={handleCourseChange}
                      />

                      {errors.course && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.course.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block space-x-1 text-sm font-medium mb-2">
                      Semester<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={semesters?.map((item: SemesterType) => ({
                        value: item.id,
                        label: `${item.name}(${item.academic_year.name})`,
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
                      onChange={handleSemesterChange}
                    />

                    {errors.semester && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.semester.message}
                      </p>
                    )}
                  </div>
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

                  <div
                    className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer mb-6
                  ${
                    file
                      ? 'border-primary-400 bg-primary-50'
                      : error
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-300 hover:border-secondary-400 hover:bg-secondary-50'
                  }`}
                    onClick={triggerFileInput}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".csv,.xls,.xlsx"
                    />

                    {file ? (
                      <>
                        <div className="flex flex-col items-center relative w-full">
                          <FiCheckCircle className="text-primary text-4xl mb-3" />
                          <p className="text-gray-700 font-medium">
                            {file.name}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFile(null);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <MdOutlineCloudUpload
                          className={`text-4xl mb-3 ${
                            error ? 'text-red-500' : 'text-primary'
                          }`}
                        />
                        <p className="text-gray-700 font-medium">
                          Click to select or drag a file here
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Supported formats: CSV(.csv)
                        </p>
                      </>
                    )}
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="mb-6 text-center">
                    <a
                      href="/students_marks.csv"
                      download
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Download template file
                    </a>
                  </div>

                  <div className="flex justify-between bg-white sticky bottom-0 py-3 px-3 gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border min-w-[120px] border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!file || isSubmitting || isUploading}
                      className={`px-4 py-2 rounded-md text-white min-w-[120px] font-medium flex items-center gap-2
                    ${
                      !file || isUploading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-700'
                    }`}
                    >
                      {isUploading ? (
                        <>
                          <SubmitSpinner />
                        </>
                      ) : (
                        <>
                          <MdOutlineCloudUpload />
                          Upload
                        </>
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

export default UploadMarks;
