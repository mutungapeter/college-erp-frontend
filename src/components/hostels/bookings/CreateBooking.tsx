'use client';
import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';

import { HostelRoomsType, HostelsType } from '@/definitions/hostels';
import { LabelOptionsType } from '@/definitions/Labels/labelOptionsType';
import { StudentDetailsType } from '@/definitions/students';
import {
  HostelRoomBookingCreateSchema,
  HostelRoomBookingCreateType,
} from '@/schemas/hostels/main';
import {
  useCreateHostelRoomBookingMutation,
  useGetHostelRoomsQuery,
  useGetHostelsQuery,
} from '@/store/services/hostels/hostelService';
import { useGetStudentsQuery } from '@/store/services/students/studentsService';

import { BsCalendarPlus } from 'react-icons/bs';
import Select from 'react-select';

interface Props {
  refetchData: () => void;
}

const CreateBooking = ({ refetchData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState<number | null>(null);

  const [createRoomBooking, { isLoading: isCreating }] =
    useCreateHostelRoomBookingMutation();
  const { data: studentsData } = useGetStudentsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: hostelsData } = useGetHostelsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const { data: roomsData } = useGetHostelRoomsQuery(
    { hostel_id: String(selectedHostel) },
    {
      skip: !selectedHostel,
      refetchOnMountOrArgChange: true,
    },
  );

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<HostelRoomBookingCreateType>({
    resolver: zodResolver(HostelRoomBookingCreateSchema),
    defaultValues: {
      student: undefined,
      hostel_room: undefined,
    },
  });

  useEffect(() => {
    setValue('hostel_room', undefined as unknown as number, {
      shouldValidate: true,
    });
  }, [selectedHostel, setValue]);

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedHostel(null);
    reset();
  };

  const handleOpenModal = () => setIsOpen(true);

  const handleStudentChange = (selected: LabelOptionsType | null) => {
    if (selected) {
      const studentId = Number(selected.value);
      setValue('student', studentId, { shouldValidate: true });
    }
  };
  const handleRoomChange = (selected: LabelOptionsType | null) => {
    if (selected) {
      const roomId = Number(selected.value);
      setValue('hostel_room', roomId, { shouldValidate: true });
    }
  };

  const handleHostelChange = (selected: LabelOptionsType | null) => {
    if (selected) {
      const hostelId = Number(selected.value);
      setSelectedHostel(hostelId);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const onSubmit = async (formData: HostelRoomBookingCreateType) => {
    console.log('submitting form data', formData);

    try {
      const response = await createRoomBooking(formData).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Booking created successfully!');
      setShowSuccessModal(true);
      reset();
      setSelectedHostel(null);
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to create booking: ${errorData.error}`);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage('Unexpected error occurred. Please try again.');
        setShowSuccessModal(true);
      }
    }
  };

  const studentOptions =
    studentsData?.map((item: StudentDetailsType) => ({
      value: item.id,
      label: `${item.user.first_name} ${item.user.last_name} - ${item.registration_number}`,
    })) || [];

  const hostelOptions =
    hostelsData?.map((item: HostelsType) => ({
      value: item.id,
      label: item.name,
    })) || [];

  const roomOptions =
    roomsData?.rooms?.map((item: HostelRoomsType) => ({
      value: item.id,
      label: `Room ${item.room_number} (capacity-${item.room_capacity} beds, ${item.occupancy} occupied)`,
    })) || [];

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="group relative inline-flex items-center gap-2.5 px-3 py-2 bg-green-600 text-white 
    text-sm font-semibold rounded-lg shadow-sm border border-green-700 hover:bg-green-700 
    hover:border-green-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 
    focus:ring-offset-2 overflow-hidden transition-all duration-300"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <BsCalendarPlus className="w-4 h-4 z-10 transition-transform duration-200 group-hover:scale-110" />
        <span className="z-10">New Booking</span>
      </button>

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
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Book a Room
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={30}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2 p-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student/Occupant <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={studentOptions}
                      onChange={handleStudentChange}
                      placeholder="Select a student..."
                      isClearable
                      isSearchable
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        control: (base) => ({
                          ...base,
                          minHeight: '40px',
                          borderColor: errors.student ? '#ef4444' : '#d1d5db',
                          boxShadow: 'none',
                          '&:hover': {
                            borderColor: errors.student ? '#ef4444' : '#9ca3af',
                          },
                          '&:focus-within': {
                            borderColor: errors.student ? '#ef4444' : '#2563eb',
                            boxShadow: 'none',
                          },
                        }),
                        option: (base, state) => ({
                          ...base,
                          fontSize: '0.875rem',
                          color: state.isSelected ? '#ffffff' : '#333333',
                          cursor: 'pointer',
                          backgroundColor: state.isSelected
                            ? '#4f46e5'
                            : state.isFocused
                              ? '#e5e7eb'
                              : '#ffffff',
                          '&:hover': {
                            backgroundColor: '#e5e7eb',
                          },
                          padding: '8px 12px',
                        }),
                      }}
                    />
                    {errors.student && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.student.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Hostel <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={hostelOptions}
                      onChange={handleHostelChange}
                      placeholder="Select a hostel to view rooms..."
                      isSearchable
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        control: (base) => ({
                          ...base,
                          minHeight: '40px',
                          borderColor: '#d1d5db',
                          boxShadow: 'none',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: '#9ca3af',
                          },
                          '&:focus-within': {
                            borderColor: '#2563eb',
                            boxShadow: 'none',
                          },
                        }),
                        option: (base, state) => ({
                          ...base,
                          fontSize: '0.875rem',
                          color: state.isSelected ? '#ffffff' : '#333333',
                          cursor: 'pointer',
                          backgroundColor: state.isSelected
                            ? '#4f46e5'
                            : state.isFocused
                              ? '#e5e7eb'
                              : '#ffffff',
                          '&:hover': {
                            backgroundColor: '#e5e7eb',
                          },
                          padding: '8px 12px',
                        }),
                      }}
                    />
                  </div>

                  {/* Room Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Room <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={roomOptions}
                      onChange={handleRoomChange}
                      placeholder={
                        selectedHostel
                          ? 'Select a room...'
                          : 'Please select a hostel first'
                      }
                      isDisabled={!selectedHostel}
                      isClearable
                      isSearchable
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        control: (base) => ({
                          ...base,
                          minHeight: '40px',
                          borderColor: errors.hostel_room
                            ? '#ef4444'
                            : '#d1d5db',
                          boxShadow: 'none',
                          cursor: 'pointer',
                          backgroundColor: !selectedHostel
                            ? '#f9fafb'
                            : 'white',
                          '&:hover': {
                            borderColor: errors.hostel_room
                              ? '#ef4444'
                              : '#9ca3af',
                          },
                          '&:focus-within': {
                            borderColor: errors.hostel_room
                              ? '#ef4444'
                              : '#2563eb',
                            boxShadow: 'none',
                          },
                        }),
                        option: (base, state) => ({
                          ...base,
                          fontSize: '0.875rem',
                          color: state.isSelected ? '#ffffff' : '#333333',
                          cursor: 'pointer',
                          backgroundColor: state.isSelected
                            ? '#4f46e5'
                            : state.isFocused
                              ? '#e5e7eb'
                              : '#ffffff',
                          '&:hover': {
                            backgroundColor: '#e5e7eb',
                          },
                          padding: '8px 12px',
                        }),
                      }}
                    />
                    {errors.hostel_room && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.hostel_room.message}
                      </p>
                    )}
                    {!selectedHostel && (
                      <p className="text-gray-500 text-sm mt-1">
                        Select a hostel above to view available rooms
                      </p>
                    )}
                  </div>

                  <div className="sticky bottom-0 bg-white z-40 flex space-x-3 gap-4 md:justify-end items-center py-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-gray-300 bg-white shadow-sm text-gray-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isCreating}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto disabled:opacity-50"
                    >
                      {isSubmitting || isCreating ? (
                        <span className="flex items-center gap-2">
                          <SubmitSpinner />
                          <span>Creating...</span>
                        </span>
                      ) : (
                        <span>Create Booking</span>
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

export default CreateBooking;
