import { useEffect, useRef, useState } from 'react';
import { FiCheckCircle, FiUploadCloud, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { uploadStudentSchema } from '@/schemas/students/main';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CampusType,
  ProgrammeCohortType,
  ProgrammeType,
} from '@/definitions/curiculum';
import { useGetCampusesQuery } from '@/store/services/curriculum/campusService';
import { useGetCohortsQuery } from '@/store/services/curriculum/cohortsService';
import { useGetProgrammesQuery } from '@/store/services/curriculum/programmesService';
import { useGetUserRolesQuery } from '@/store/services/permissions/permissionsService';
import { useUploadStudentsMutation } from '@/store/services/students/studentsService';
import { getApiErrorMessage } from '@/utils/errorHandler';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import { MdOutlineCloudUpload } from 'react-icons/md';
import Select from 'react-select';
import { z } from 'zod';
import { RoleType } from '../accounts/permissions/types';
import CreateAndUpdateButton from '../common/CreateAndUpdateButton';
import SubmitSpinner from '../common/spinners/submitSpinner';
interface Props {
  refetchData: () => void;
}
type SelectOption = {
  value: string | number;
  label: string;
};
type FormValues = z.infer<typeof uploadStudentSchema>;
const StudentUploadButton = ({ refetchData }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

 
  const [uploadStudents, { isLoading: isUploading }] =
    useUploadStudentsMutation();
  const { data: programmesData } = useGetProgrammesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: cohortsData } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: campusData } = useGetCampusesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: rolesData } = useGetUserRolesQuery(
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
 
  const {
    setValue,
    reset,
    handleSubmit,

    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(uploadStudentSchema),
  });
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  const handleProgrammeChange = (selected: SelectOption | null) => {
    if (selected) {
      const progId = Number(selected.value);
      setValue('programme', progId);
    }
  };
  const handleCohortChange = (selected: SelectOption | null) => {
    if (selected) {
      const cohortId = Number(selected.value);
      setValue('cohort', cohortId);
    }
  };
  const handleCampusChange = (selected: SelectOption | null) => {
    if (selected) {
      const campusId = Number(selected.value);
      setValue('campus', campusId);
    }
  };
  const handleRoleChange = (selected: SelectOption | null) => {
    if (selected) {
      const itemId = Number(selected.value);
      setValue('role', itemId);
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
    formData.append('programme', String(data.programme));
    formData.append('cohort', String(data.cohort));
    formData.append('campus', String(data.campus));
    formData.append('role', String(data.role));
    console.log('formData', formData);
    try {
      const response = await uploadStudents(formData).unwrap();
      console.log('response', response);

      // setSuccessMessage(
      //   `Upload complete! ${response.count} student(s) Uploaded, ${response.failed_count} failed.`
      // );
      toast.success(
        `Upload complete! ${response.count} student(s) Uploaded, ${response.failed_count} failed.`,
      );
      // setShowSuccessModal(true);

      refetchData();
      setFile(null);
      setError('');
      reset();
      closeModal();
    } catch (error: unknown) {
      console.log('error', error);
   
      setError(
        'Failed to upload Students,confirm that all required data is included in the uploaded file.',
      );
      closeModal();

      toast.error(getApiErrorMessage(error));
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
      <CreateAndUpdateButton
        onClick={openModal}
        // title="Add New"
        label="Upload Students"
        icon={<FiUploadCloud className="text-xl" />}
        className="flex items-center space-x-2 px-4 py-2 border-2
         border-primary-500 text-primary-600
          hover:bg-primary-50 hover:border-primary-600
          focus:outline-none
           hover:text-primary-700 rounded-md transition duration-300 
           cursor-pointer"
      />

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
                    w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div
                  className="sticky top-0 bg-white z-40 
                    flex  px-4 justify-between items-center py-6"
                >
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Upload students
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
                  className="space-y-4 px-3"
                >
                  <div>
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Course<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={programmesData?.map((item: ProgrammeType) => ({
                          value: item.id,
                          label: `${item.name}(${item.level})`,
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                    <div className="relative">
                      <div className="relative">
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Class<span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={cohortsData?.map(
                            (item: ProgrammeCohortType) => ({
                              value: item.id,
                              label: `${item.name} ${
                                item?.current_year ?? ''
                              } ${item?.current_semester?.name ?? ''}`,
                            }),
                          )}
                          menuPortalTarget={document.body}
                          menuPlacement="auto"
                          // menuPosition="absolute"
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
                          onChange={handleCohortChange}
                        />

                        {errors.cohort && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cohort.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="relative">
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Campus<span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={campusData?.map((item: CampusType) => ({
                            value: item.id,
                            label: `${item.name}`,
                          }))}
                          menuPortalTarget={document.body}
                          menuPlacement="auto"
                          // menuPosition="absolute"
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
                          onChange={handleCampusChange}
                        />

                        {errors.campus && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.campus.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pb-3 border-b mt-5">
                    <h2 className="text-lg font-semibold">
                      Student Portal Access Permission
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Enrolling a student here will automatically create their
                      student account for accessing the university student
                      portal. Selecting a role is{' '}
                      <span className="font-semibold">mandatory </span>
                      because it determines their level of access. Once
                      enrolled, the student will receive their login credentials
                      and a temporary password sent to their registered email
                      address.
                    </p>
                  </div>
                  <div className="relative">
                    <label className="block space-x-1 text-sm font-medium mb-2">
                      Role<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={rolesData?.map((item: RoleType) => ({
                        value: item.id,
                        label: `${item?.name}`,
                      }))}
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      // menuPosition="absolute"
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 10000,
                          overflow: 'visible',
                          maxHeight: '300px',
                          paddingY: '20px',
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
                      onChange={handleRoleChange}
                    />

                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                  <label className="block space-x-1 text-sm font-medium mb-2">
                    Csv File <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer mb-6
                  ${
                    file
                      ? 'border-primary bg-primary-50'
                      : error
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-300 hover:border-primary hover:bg-primary-50'
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
                          <FiCheckCircle className="text-green-500 text-4xl mb-3" />
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
                          Supported formats: CSV
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
                      href="/students.csv"
                      download
                      className="text-primary hover:text-primary-800 text-sm underline"
                    >
                      Download template file
                    </a>
                  </div>
                  {/* <ModalBottomButton
                    onCancel={closeModal}
                    isSubmitting={isSubmitting}
                    isProcessing={isUploading}
                  /> */}
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

            
          </div>
        </div>
      )}
    </>
  );
};

export default StudentUploadButton;
