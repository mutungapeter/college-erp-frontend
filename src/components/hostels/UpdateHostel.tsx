'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import Select, { SingleValue } from 'react-select';

import { CampusType } from '@/definitions/curiculum';
import { HostelsType } from '@/definitions/hostels';
import { HostelGenderOptions } from '@/lib/constants';
import { hostelUpdateSchema, HostelUpdateType } from '@/schemas/hostels/main';
import { useGetCampusesQuery } from '@/store/services/curriculum/campusService';
import { useUpdateHostelMutation } from '@/store/services/hostels/hostelService';
import { FiEdit } from 'react-icons/fi';
import ModalBottomButton from '../common/StickyModalFooterButtons';
type SchoolOption = {
  value: string;
  label: string;
};
const EditHostel = ({
  data,
  refetchData,
}: {
  data: HostelsType;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  //   console.log("data", data);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isError, setIsError] = useState(false);

  const [updateHostel, { isLoading: isUpdating }] = useUpdateHostelMutation();
  const { data: campusData } = useGetCampusesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<HostelUpdateType>({
    resolver: zodResolver(hostelUpdateSchema),
    defaultValues: {
      name: data?.name || '',
      gender: data?.gender || '',
      rooms: data?.rooms || 0,
      room_cost: Number(data?.room_cost) || 0,
      capacity: data?.capacity || 0,
      campus: data?.campus.id || undefined,
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
  const handleCampusChange = (
    selected: SingleValue<{ value: number | null; label: string }>,
  ) => {
    if (selected) {
      setValue('campus', Number(selected.value));
    } else {
      setValue('campus', null);
    }
  };

  const handleGenderChange = (selected: SchoolOption | null) => {
    if (selected && selected.value) {
      setValue('gender', String(selected.value));
    }
  };
  const onSubmit = async (formData: HostelUpdateType) => {
    console.log('submitting form data');

    try {
      const response = await updateHostel({
        id: data.id,
        data: formData,
      }).unwrap();
      console.log('response', response);

      setIsError(false);
      setSuccessMessage('Hostel Updated successfully!');
      setShowSuccessModal(true);

      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to update Hostel: ${errorData.error}`);
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
      <div
        onClick={handleOpenModal}
        className="p-2 rounded-xl  text-blue-600 hover:bg-blue-200 hover:text-blue-700 cursor-pointer transition duration-200 shadow-sm"
        title="Edit Depart"
      >
        <FiEdit className="text-sm" />
      </div>

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
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-md  bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-3 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Edit Hostel
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        placeholder="e.g. The Richest Man In Babylon"
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Gender<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={HostelGenderOptions}
                        onChange={handleGenderChange}
                        menuPortalTarget={document.body}
                        defaultValue={{
                          value: data?.gender || '',
                          label: data?.gender || '',
                        }}
                        menuPlacement="auto"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 999999,
                          }),
                          menu: (base) => ({
                            ...base,
                            position: 'absolute',
                            width: 'max-content',
                            minWidth: '100%',
                            minHeight: '50px',
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
                      />
                      {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Rooms
                      </label>
                      <input
                        type="number"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        placeholder="no. of rooms"
                        {...register('rooms')}
                      />
                      {errors.rooms && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.rooms.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Hostel Capacity
                      </label>
                      <input
                        type="number"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        placeholder="total capacity"
                        {...register('capacity')}
                      />
                      {errors.capacity && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.capacity.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Cost Per Room
                      </label>
                      <input
                        type="number"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        placeholder="Ksh."
                        {...register('room_cost')}
                      />
                      {errors.room_cost && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.room_cost.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Campus</label>
                      <Select
                        options={campusData?.map((item: CampusType) => ({
                          value: item.id,
                          label: item.name,
                        }))}
                        defaultValue={{
                          value: data?.campus?.id || null,
                          label: data?.campus?.name || '',
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
export default EditHostel;
