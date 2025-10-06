import { useEffect, useRef, useState } from 'react';
import { FiCheckCircle, FiPlus, FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import SuccessFailModal from '@/components/common/Modals/SuccessFailModal';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';
import {
  createTenderFormData,
  createTenderSchema,
} from '@/schemas/procurement';
import { useCreateTenderMutation } from '@/store/services/finance/procurementService';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
interface Props {
  refetchData: () => void;
}

const CreateTender = ({ refetchData }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [createTender, { isLoading: isUploading }] = useCreateTenderMutation();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setError('');
    reset();
  };
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    closeModal();
  };
  const {
    setValue,
    reset,
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<createTenderFormData>({
    resolver: zodResolver(createTenderSchema),
  });
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');

    if (!selectedFile) return;

    setFile(selectedFile);
    setValue('tender_document', selectedFile, {
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
    setValue('tender_document', selectedFile, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onSubmit = async (data: createTenderFormData) => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('tender_document', file);
    formData.append('title', String(data.title));
    formData.append('description', String(data.description));
    formData.append('projected_amount', String(data.projected_amount));
    formData.append('deadline', String(data.deadline));
    formData.append('start_date', String(data.start_date));
    formData.append('end_date', String(data.end_date));

    console.log('formData', formData);
    try {
      const response = await createTender(formData).unwrap();
      console.log('response', response);

      setShowSuccessModal(true);
      setIsError(false);
      refetchData();
      setFile(null);
      setError('');
      reset();
    } catch (error: unknown) {
      console.log('error', error);
      setIsError(true);
      setError('Failed to create tender .');
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log('errorData', errorData);

        const msg = errorData.error || 'Failed to create tender.';
        setSuccessMessage(msg);
        setShowSuccessModal(true);
      } else {
        toast.error('Unexpected erorr occured. Please try again.');
      }
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
      <button
        onClick={openModal}
        title="Add Fee Item"
        className="flex items-center space-x-2 p-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FiPlus className="w-4 h-4" />
        <span>Add New Tender</span>
      </button>

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
            className="fixed inset-0 min-h-full   z-100 w-screen flex flex-col text-center md:items-center
                justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                     overflow-y-auto rounded-md  bg-white text-left shadow-xl transition-all   
                     w-full sm:max-w-c-600 md:max-w-600 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-4 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Add new Tender
                  </p>
                  <IoCloseOutline
                    size={20}
                    className="cursor-pointer"
                    onClick={closeModal}
                  />
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  encType="multipart/form-data"
                  className="space-y-4   p-4 md:p-4 lg:p-4 "
                >
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Title<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('title')}
                      placeholder="Tender Title"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols md:grid-cols-2 grid-cols-1 gap-3">
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Start Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="start_date"
                        type="date"
                        {...register('start_date')}
                        placeholder="start date"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.start_date && (
                        <p className="text-red-500 text-sm">
                          {errors.start_date.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        End Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="end_date"
                        type="date"
                        {...register('end_date')}
                        placeholder="End date"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.end_date && (
                        <p className="text-red-500 text-sm">
                          {errors.end_date.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Application deadline
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="deadline"
                        type="date"
                        {...register('deadline')}
                        placeholder="End date"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.deadline && (
                        <p className="text-red-500 text-sm">
                          {errors.deadline.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Projected Tender Cost
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="number"
                        {...register('projected_amount')}
                        placeholder="Ksh"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.projected_amount && (
                        <p className="text-red-500 text-sm">
                          {errors.projected_amount.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Tender brief description
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="name"
                      {...register('description')}
                      placeholder="tender description here.."
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      rows={3}
                      cols={15}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="file"
                      className="block mb-4 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span className="">Tender Document</span>
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer mb-5
                  ${
                    file
                      ? 'border-green-400 bg-green-50'
                      : error
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
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
                        accept=".pdf, .doc"
                      />

                      {file ? (
                        <>
                          <div className="flex flex-col items-center relative w-full">
                            <FiCheckCircle className="text-green-500 text-2xl mb-3" />
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
                          <FiUpload
                            className={`text-2xl mb-3 ${
                              error ? 'text-red-500' : 'text-blue-500'
                            }`}
                          />
                          <p className="text-gray-700 font-medium">
                            Click to select or drag a file here
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            Supported formats: Pdf
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="sticky bottom-0 bg-white z-40 flex md:px-4  gap-4 md:justify-between items-center py-2 ">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="border border-red-500 bg-white shadow-sm text-red-500 py-2 text-sm px-4 rounded-lg w-full min-w-[100px] md:w-auto hover:bg-red-500 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-lg w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isUploading ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Submitting...</span>
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

export default CreateTender;
