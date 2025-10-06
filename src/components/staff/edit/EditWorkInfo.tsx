'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';
import { IoCloseOutline, IoWarningOutline } from 'react-icons/io5';

import { DepartmentType } from '@/definitions/curiculum';
import { Position, StaffType } from '@/definitions/staff';
import { updateStaffSchema, UpdateStaffType } from '@/schemas/staff/main';
import { useGetDepartmentsQuery } from '@/store/services/curriculum/departmentsService';
import {
  useGetPositionsQuery,
  useUpdateStaffMutation,
} from '@/store/services/staff/staffService';
import Select, { SingleValue } from 'react-select';

type LabelOptionType = {
  value: number | undefined;
  label: string | undefined;
};
const EditStaffWorkDetails = ({
  data,
  refetchData,
}: {
  data: StaffType | null;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpandedNote, setIsExpandedNote] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isError, setIsError] = useState(false);

  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: positionsData } = useGetPositionsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      department: data?.department.id || undefined,
      position: data?.position.id || undefined,
    },
  });
  const handleDepartmentChange = (selected: SingleValue<LabelOptionType>) => {
    if (selected) {
      const departmentId = Number(selected.value);
      setValue('department', departmentId);
    }
  };
  const handlePositionChange = (selected: SingleValue<LabelOptionType>) => {
    if (selected) {
      const positionId = Number(selected.value);
      setValue('position', positionId);
    }
  };
  const toggleNoteExpansion = () => setIsExpandedNote(!isExpandedNote);
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

  const onSubmit = async (formData: UpdateStaffType) => {
    console.log('submitting form data for update', formData);
    console.log('data', formData);
    try {
      const response = await updateStaff({
        id: data?.id,
        data: formData,
      }).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Work Info updated successfully!');
      setShowSuccessModal(true);
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log('errorData', errorData);
        setIsError(true);
        setSuccessMessage(
          'An error occured while updating Work Info. Please try again!.',
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
      <div
        onClick={handleOpenModal}
        className="px-3 py-1 rounded-lg inline-flex items-center space-x-3
         bg-blue-100 text-blue-600 hover:bg-blue-200
          hover:text-blue-700 cursor-pointer transition duration-200 shadow-sm"
        title="Edit Event"
      >
        <FiEdit className="text-sm" />
        <span>Edit</span>
      </div>

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
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-550 md:max-w-550 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-2 ">
                  <p className="text-sm md:text-lg lg:text-lg font-bold ">
                    Edit Staff quick details
                  </p>

                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={25}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>
                <div className="px-4 sm:px-6 pt-4">
                  <div
                    className={`rounded-md bg-amber-50 border border-amber-200 transition-all ${isExpandedNote ? 'mb-4' : 'mb-2'}`}
                  >
                    <div className="flex p-3">
                      <div className="flex-shrink-0">
                        <IoWarningOutline
                          className="h-5 w-5 text-amber-500"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-amber-800">
                            Changing department transfers the staff to a new
                            Department and updates their position.
                          </p>
                          <button
                            type="button"
                            onClick={toggleNoteExpansion}
                            className="ml-3 flex-shrink-0 text-amber-500 hover:text-amber-600 text-xs underline"
                          >
                            {isExpandedNote ? 'Show less' : 'show more'}
                          </button>
                        </div>

                        {isExpandedNote && (
                          <div className="mt-2 text-sm text-amber-700">
                            <p>Editing a staff&apos;s department will:</p>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>Transfer the staff to the new department</li>
                              <li>
                                Potentially affect their responsibilities and
                                reporting structure
                              </li>
                              <li>Update related work records</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3 mt-2 p-3"
                >
                  <div>
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Department<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={departmentsData?.map(
                          (department: DepartmentType) => ({
                            value: department.id,
                            label: department.name,
                          }),
                        )}
                        defaultValue={{
                          value: data?.department?.id,
                          label: data?.department?.name,
                        }}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        menuPosition="absolute"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: '44px',
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

                      {errors.department && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.department.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Position<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={positionsData?.map((position: Position) => ({
                          value: position.id,
                          label: position.name,
                        }))}
                        defaultValue={{
                          value: data?.position?.id,
                          label: data?.position?.name,
                        }}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        menuPosition="absolute"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: '44px',
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
                        onChange={handlePositionChange}
                      />

                      {errors.position && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.position.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6 gap-4 md:justify-end items-center py-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-gray-300 bg-white shadow-sm text-gray-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUpdating}
                      className="bg-blue-500 text-white py-2 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isUpdating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          Updating
                        </span>
                      ) : (
                        <span>Update</span>
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
export default EditStaffWorkDetails;
