'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';

import { CategoryFormData, categorySchema } from '@/schemas/inventory';
import { FiPlus } from 'react-icons/fi';
import { CategoryTypeOptions } from './types';
import { useCreateCategoryMutation } from '@/store/services/finance/inventoryService';
type SchoolOption = {
  value: string;
  label: string;
};
interface Props {
  refetchData: () => void;
}
const NewCategory = ({ refetchData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);
  const handleCategoryType = (selected: SchoolOption | null) => {
    if (selected && selected.value) {
      setValue('category_type', String(selected.value));
    }
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const onSubmit = async (formData: CategoryFormData) => {
    console.log('submitting form data');

    console.log('formData', formData);
    try {
      const response = await createCategory(formData).unwrap();
      console.log('response', response);
      setIsError(false);
      setSuccessMessage('Category Added Successfully');
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
      <div
        onClick={handleOpenModal}
        className="bg-green-600 inline-flex cursor-pointer w-max 
   items-center space-x-2 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg
    hover:bg-green-800 transition duration-300"
      >
        <FiPlus size={18} />
        <span className="text-sm font-medium">New Category</span>
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
                w-full sm:max-w-c-450 md:max-w-450 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-4 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Create New Category
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        placeholder="Name"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Category Type
                        <span className="text-red-500 mb-2">*</span>
                      </label>
                      <Select
                        options={CategoryTypeOptions}
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
                        onChange={handleCategoryType}
                      />

                      {errors.category_type && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.category_type.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      id="name"
                      {...register('description')}
                      placeholder="Description optional"
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
                        <span>Submit</span>
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
export default NewCategory;
