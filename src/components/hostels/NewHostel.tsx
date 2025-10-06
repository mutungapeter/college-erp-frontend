'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';

import { CampusType } from '@/definitions/curiculum';
import { HostelGenderOptions } from '@/lib/constants';
import { HostelCreateType, hostelCreateSchema } from '@/schemas/hostels/main';
import { useGetCampusesQuery } from '@/store/services/curriculum/campusService';
import { useCreateHostelsMutation } from '@/store/services/hostels/hostelService';
import CreateAndUpdateButton from '../common/CreateAndUpdateButton';
import ModalBottomButton from '../common/StickyModalFooterButtons';

type SelectOption = {
  value: string | number;
  label: string;
};

const AddHostel = ({ refetchData }: { refetchData: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [createHostels, { isLoading: isCreating }] = useCreateHostelsMutation();

  const { data: campusData } = useGetCampusesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<HostelCreateType>({
    resolver: zodResolver(hostelCreateSchema),
    defaultValues: {
      name: '',
      campus: undefined,
      gender: '',
      rooms: 0,
      capacity: 0,
      room_cost: 0,
    },
  });

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

  const handleGenderChange = (selected: SelectOption | null) => {
    if (selected && selected.value) {
      setValue('gender', String(selected.value));
    }
  };

  const handleCampusChange = (selected: SelectOption | null) => {
    if (selected) {
      const campusId = Number(selected.value);
      setValue('campus', campusId);
    }
  };

  const onSubmit = async (formData: HostelCreateType) => {
    console.log('submitting form data', formData);

    try {
      const response = await createHostels(formData).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Hostel added successfully!');
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to add  Hostel: ${errorData.error}`);
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
        label="New Hostel"
        icon={<FiPlus className="w-4 h-4" />}
        className="flex items-center space-x-2 px-4 py-2
               bg-primary
               text-white rounded-md hover:bg-emerald-600
               focus:outline-none focus:ring-2 focus:ring-primary-500 
               focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
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
                w-full sm:max-w-c-550 md:max-w-550 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Add New Hostel
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={20}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-2 mt-2 p-4 "
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
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Campus
                      </label>
                      <Select
                        options={campusData?.map((item: CampusType) => ({
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

export default AddHostel;
