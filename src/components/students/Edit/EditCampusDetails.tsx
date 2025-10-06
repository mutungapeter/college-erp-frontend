'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import { StudentDetailsType } from '@/definitions/students';
import { updateCampusSchema } from '@/schemas/students/main';
import { useUpdateStudentMutation } from '@/store/services/students/studentsService';
import { IoCloseOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { z } from 'zod';

import CreateAndUpdateButton from '@/components/common/CreateAndUpdateButton';
import ModalBottomButton from '@/components/common/StickyModalFooterButtons';
import { CampusType } from '@/definitions/curiculum';
import { useGetCampusesQuery } from '@/store/services/curriculum/campusService';
import Select, { SingleValue } from 'react-select';

type CampusSelection = {
  value: number | undefined;
  label: string | undefined;
};

const EditCampusDetails = ({
  data,
  refetchData,
}: {
  data: StudentDetailsType | null;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpandedNote, setIsExpandedNote] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isError, setIsError] = useState(false);

  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  const { data: campusData } = useGetCampusesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  type FormValues = z.infer<typeof updateCampusSchema>;
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(updateCampusSchema),
    defaultValues: {
      campus: data?.campus?.id || null,
    },
  });
  const handleCampusChange = (selected: SingleValue<CampusSelection>) => {
    if (selected) {
      const campusId = Number(selected.value);
      setValue('campus', campusId);
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

  const onSubmit = async (formData: FormValues) => {
    console.log('submitting form data for update', formData);
    console.log('data', formData);
    try {
      const response = await updateStudent({
        id: data?.id,
        data: formData,
      }).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Student  Academic details updated successfully!');
      setShowSuccessModal(true);
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log('errorData', errorData);
        setIsError(true);
        setSuccessMessage(
          'An error occured while updating Student Academic details.Please try again!.',
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
        icon={<FiEdit className="w-4 h-4" />}
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
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-550 md:max-w-550 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-2 ">
                  <p className="text-sm md:text-lg lg:text-lg font-bold ">
                    Edit Student&apos;s Campus Details
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
                    className={`rounded-md bg-blue-50 border border-blue-200 transition-all ${
                      isExpandedNote ? 'mb-4' : 'mb-2'
                    }`}
                  >
                    <div className="flex p-3">
                      <div className="flex-shrink-0">
                        <IoInformationCircleOutline
                          className="h-5 w-5 text-blue-500"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-blue-800">
                            Changing campus affects student&apos;s location and
                            logistics
                          </p>
                          <button
                            type="button"
                            onClick={toggleNoteExpansion}
                            className="ml-3 flex-shrink-0 text-blue-500 hover:text-blue-600 text-xs underline"
                          >
                            {isExpandedNote ? 'Show less' : 'Show more'}
                          </button>
                        </div>

                        {isExpandedNote && (
                          <div className="mt-2 text-sm text-blue-700">
                            <p>Changing a student&apos;s campus will:</p>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>
                                Update their primary location for classes and
                                administrative services
                              </li>
                              <li>
                                May affect their hostel assignment if applicable
                              </li>
                              <li>
                                Change which campus facilities they have access
                                to
                              </li>
                              <li>
                                Update institutional records for reporting
                                purposes
                              </li>
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
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Cohort<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={campusData?.map((item: CampusType) => ({
                          value: item.id,
                          label: item.name,
                        }))}
                        defaultValue={{
                          value: data?.campus?.id,
                          label: data?.campus?.name,
                        }}
                        menuPortalTarget={document.body}
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
                        onChange={handleCampusChange}
                      />

                      {errors.campus && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.campus.message}
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
export default EditCampusDetails;
