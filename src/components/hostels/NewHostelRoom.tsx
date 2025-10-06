'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';

import { HostelsType } from '@/definitions/hostels';
import {
  HostelRoomCreateType,
  hostelRoomCreateSchema,
} from '@/schemas/hostels/main';
import { useCreateHostelRoomMutation } from '@/store/services/hostels/hostelService';
import CreateAndUpdateButton from '../common/CreateAndUpdateButton';
import ModalBottomButton from '../common/StickyModalFooterButtons';

interface Props {
  data: HostelsType;
  refetchData: () => void;
}
const AddRoom = ({ refetchData, data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [createHostelRoom, { isLoading: isCreating }] =
    useCreateHostelRoomMutation();
  console.log('data', data);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<HostelRoomCreateType>({
    resolver: zodResolver(hostelRoomCreateSchema),
    defaultValues: {
      room_number: '',
      room_capacity: 0,
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

  const onSubmit = async (formData: HostelRoomCreateType) => {
    console.log('submitting form data', formData);
    const submissionData = {
      hostel: data.id,
      ...formData,
    };
    try {
      const response = await createHostelRoom(submissionData).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Hostel Room added successfully!');
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to add  Hostel Room: ${errorData.error}`);
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
        label="Add Room"
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
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-600 md:max-w-600 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Add Room
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={30}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Hostel
                      </label>
                      <input
                        type="text"
                        value={`${data?.name}`}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>

                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Current No. of Rooms
                      </label>
                      <input
                        type="text"
                        value={data?.rooms}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div> */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Hostels Gender
                      </label>
                      <input
                        type="text"
                        value={data?.gender}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Current Hostel Capacity
                      </label>
                      <input
                        type="text"
                        value={`${data?.capacity} People`}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div> */}
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-2 mt-2 p-4 "
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Room Number
                      </label>
                      <input
                        type="text"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        placeholder="e.g 101"
                        {...register('room_number')}
                      />
                      {errors.room_number && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.room_number.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Room Capacity
                      </label>
                      <input
                        type="number"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        placeholder="e.g 3, 4 "
                        {...register('room_capacity')}
                      />
                      {errors.room_capacity && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.room_capacity.message}
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

export default AddRoom;
