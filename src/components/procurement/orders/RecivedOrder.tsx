'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';
import {
  ReceiveOrderFormData,
  receiveOrderSchema,
} from '@/schemas/procurement/po';
import { useReceiveGoodsMutation } from '@/store/services/finance/procurementService';
import { FaRegCheckCircle } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { PurchaseOrderType } from './types';

interface Props {
  refetchData: () => void;
  data: PurchaseOrderType;
}
const ReceiveOrder = ({ refetchData, data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isError, setIsError] = useState(false);

  const [receiveGoods, { isLoading: isCreating }] = useReceiveGoodsMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ReceiveOrderFormData>({
    resolver: zodResolver(receiveOrderSchema),
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

  const onSubmit = async (formData: ReceiveOrderFormData) => {
    console.log('submitting form data');

    console.log('formData', formData);
    const payLoad = {
      purchase_order: data.id,
      ...formData,
    };
    try {
      const response = await receiveGoods(payLoad).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Goods Successfully Received.');
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(errorData.error);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage('Unexpected error occured. Please try again.');
        setShowSuccessModal(true);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center 
                   gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
      >
        <FaRegCheckCircle className="text-sm" />
        Receive Goods
      </button>
      {/* <div
        onClick={handleOpenModal}
  className="bg-green-600 inline-flex cursor-pointer w-max 
   items-center space-x-2 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg
    hover:bg-green-800 transition duration-300"
>
  <MdPayment size={18} />
  <span className="text-sm font-medium">Pay Vendor</span>
</div> */}

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
                w-full sm:max-w-c-450 md:max-w-450 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-4 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Received Order
                  </p>
                  <IoCloseOutline
                    size={20}
                    className="cursor-pointer"
                    onClick={handleCloseModal}
                  />
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4   p-4 md:p-4 lg:p-4 "
                >
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Remarks
                    </label>
                    <textarea
                      id="name"
                      {...register('remarks')}
                      placeholder="Remarks optional"
                      rows={3}
                      cols={5}
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                  </div>

                  <div className="sticky bottom-0 bg-white z-40 flex md:px-4  gap-4 md:justify-between items-center py-2 ">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-red-500 bg-white shadow-sm text-red-500 py-2 text-sm px-4 rounded-lg w-full min-w-[100px] md:w-auto hover:bg-red-500 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isCreating}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-lg w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isCreating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Processing...</span>
                        </span>
                      ) : (
                        <span>Receive</span>
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
export default ReceiveOrder;
