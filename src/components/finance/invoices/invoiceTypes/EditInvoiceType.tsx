'use client';
import { useEffect, useState } from 'react';

import {
  InvoiceTypeFormData,
  invoiceTypeSchema,
} from '@/schemas/finance/fees/invoices';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

import CreateAndUpdateButton from '@/components/common/CreateAndUpdateButton';
import ModalBottomButton from '@/components/common/StickyModalFooterButtons';
import {
  useUpdateInvoiceTypeMutation
} from '@/store/services/finance/feesService';
import { getApiErrorMessage } from '@/utils/errorHandler';
import { FiEdit } from 'react-icons/fi';
import { InvoiceType } from '../types';

interface Props {
  refetchData: () => void;
  data: InvoiceType;
}
const EditInvoiceType = ({ refetchData, data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log('data', data);
  const [updateInvoiceType, { isLoading: isUpdating }] =
    useUpdateInvoiceTypeMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<InvoiceTypeFormData>({
    resolver: zodResolver(invoiceTypeSchema),
    defaultValues: {
      name: data?.name ?? '',
      description: data?.name ?? '',
      is_active: data?.is_active ?? false,
      is_fee_type: data?.is_fee_type ?? false,
    },
  });
  useEffect(() => {
    if (data && isOpen) {
      reset({
        name: data.name ?? '',
        description: data.description ?? '',
        is_active: data.is_active ?? false,
        is_fee_type: data.is_fee_type ?? false,
      });
    }
  }, [data, isOpen, reset]);
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);
  const onSubmit = async (formData: InvoiceTypeFormData) => {
    console.log('Form Data:', formData);
    try {
      const res = await updateInvoiceType({
        id: data.id,
        data: formData,
      }).unwrap();
      const msg = res?.message || 'Invoice Type updated successfully!';
      toast.success(msg);
      handleCloseModal();
      refetchData();
    } catch (error: unknown) {
      console.log('error', error);
      handleCloseModal();
      toast.error(getApiErrorMessage(error));
    } finally {
      handleCloseModal();
      refetchData();
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    reset({
      name: data.name ?? '',
      description: data.description ?? '',
      is_active: data.is_active ?? false,
      is_fee_type: data.is_fee_type ?? false,
    });
  };

  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
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
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
            aria-hidden="true"
          />

          <div className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center justify-center overflow-y-auto p-2 md:p-3 pointer-events-none">
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
          overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
          w-full sm:max-w-c-450 md:max-w-450 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-4 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Edit Invoice Type
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
                      Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="admissionNumber"
                      placeholder="Enter name"
                      {...register('name')}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {String(errors.name.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="descripition here..."
                      {...register('description')}
                      rows={3}
                      cols={15}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">
                        {String(errors.description.message)}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('is_active')}
                        className="
    h-4 w-4 
    border border-gray-300 rounded 
    checked:bg-primary checked:border-primary 
    accent-white  /* makes tick/checkmark white */
    focus:ring-primary
  "
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('is_fee_type')}
                        className="
        h-4 w-4 
        border border-gray-300 rounded 
        checked:bg-primary checked:border-primary 
        accent-white /* tick/checkmark white */
        focus:ring-primary
      "
                      />
                      <span className="text-sm text-gray-700">Fee Type</span>
                    </label>
                  </div>

                  <ModalBottomButton
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                    isProcessing={isUpdating}
                  />
                </form>
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default EditInvoiceType;
