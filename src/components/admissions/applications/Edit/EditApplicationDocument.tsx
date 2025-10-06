import CreateAndUpdateButton from '@/components/common/CreateAndUpdateButton';
import ModalBottomButton from '@/components/common/StickyModalFooterButtons';
import { Application_document } from '@/definitions/admissions';
import { handleApiError } from '@/lib/ApiError';
import { ApplicationDocumentOptions } from '@/lib/constants';
import {
  ApplicationDocumentUpdate,
  applicationDocumentUpdateSchema,
} from '@/schemas/admissions/applicationDocuments';
import { useUpdateApplicationDocumentMutation } from '@/store/services/admissions/admissionsService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiCheckCircle, FiEdit, FiEdit2, FiX } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';

interface Props {
  currentDocument: Application_document;
  refetchData: () => void;
}

type SelectOption = {
  value: string | number;
  label: string;
};

const ApplicationDocumentUpdateButton = ({
  currentDocument,
  refetchData,
}: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [isError, setIsError] = useState(false);
  // const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateApplicationDocument, { isLoading: isUpdating }] =
    useUpdateApplicationDocumentMutation();
  console.log('currentDocument', currentDocument);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setError('');
    reset();
  };

  const {
    setValue,
    reset,
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ApplicationDocumentUpdate>({
    resolver: zodResolver(applicationDocumentUpdateSchema),
    defaultValues: {
      document_name: currentDocument?.document_name || '',
      document_type: currentDocument?.document_type || '',
      verified: currentDocument?.verified || false,
    },
  });
  const verifiedValue = watch('verified');

  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  //   // Set initial values when modal opens
  //   useEffect(() => {
  //     if (isModalOpen) {
  //       setValue("document_name", currentDocument.document_name);
  //       setValue("document_type", currentDocument.document_type);
  //       setValue("verified", currentDocument.verified);
  //     }
  //   }, [isModalOpen, currentDocument, setValue]);

  const handleDocumentTypeChange = (selected: SelectOption | null) => {
    if (selected) {
      setValue('document_type', selected.value.toString());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');

    if (!selectedFile) return;

    setFile(selectedFile);
    setValue('document_file', selectedFile, {
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
    setValue('document_file', selectedFile, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onSubmit = async (data: ApplicationDocumentUpdate) => {
    // For update, file is optional
    const formData = new FormData();

    if (data.document_name) {
      formData.append('document_name', data.document_name);
    }

    if (data.document_type) {
      formData.append('document_type', data.document_type);
    }

    if (file) {
      formData.append('document_file', file);
    }

    // Include verified status
    if (data.verified !== undefined) {
      formData.append('verified', data.verified.toString());
    }

    try {
      await updateApplicationDocument({
        id: currentDocument?.id,
        data: formData,
      }).unwrap();

      // setSuccessMessage("Document updated successfully!");
      refetchData();
      closeModal();
      // setIsError(false);
      toast.success('Document updated successfully!');
    } catch (error: unknown) {
      // setIsError(true);
      // setError("Failed to update document, please try again.");
      handleApiError(error, 'Updating document');
      toast.error('Unexpected error occurred. Please try again.');
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getCurrentDocumentTypeOption = () => {
    return ApplicationDocumentOptions.find(
      (option) => option.value === currentDocument?.document_type,
    );
  };

  return (
    <>
      <CreateAndUpdateButton
        onClick={openModal}
        title="Edit"
        icon={<FiEdit className="w-4 h-4" />}
        className="group relative p-2 bg-amber-100 text-amber-500 hover:bg-amber-600 hover:text-white focus:ring-amber-500"
        tooltip="Edit"
      />
      {isModalOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            // onClick={}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn"
            aria-hidden="true"
          ></div>

          <div
            className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center 
              animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-2xl bg-white text-left 
                shadow-xl transition-all font-inter  
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div
                  className="sticky top-0 bg-white z-40 flex  px-4 
                justify-between items-center py-6"
                >
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Edit Application Document
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={20}
                      onClick={closeModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  encType="multipart/form-data"
                  className="space-y-4 px-2"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Document Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Document Name"
                      className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                      {...register('document_name')}
                    />
                    {errors.document_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.document_name.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-2">
                      Document Type<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={ApplicationDocumentOptions}
                      defaultValue={getCurrentDocumentTypeOption()}
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (base) => ({
                          ...base,
                          minHeight: '44px',
                          minWidth: '200px',
                          borderColor: '#d1d5db',
                        }),
                      }}
                      onChange={handleDocumentTypeChange}
                    />
                    {errors.document_type && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.document_type.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="verified"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      {...register('verified')}
                    />
                    <label
                      htmlFor="graduated"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      Verified {verifiedValue ? '(Yes)' : '(No)'}
                    </label>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer mb-6
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
                      accept=".pdf,.doc,.docx,.png,.jpg"
                    />
                    {file ? (
                      <div className="flex flex-col items-center relative w-full">
                        <FiCheckCircle className="text-green-500 text-4xl mb-3" />
                        <p className="text-gray-700 font-medium">{file.name}</p>
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
                    ) : (
                      <>
                        <FiEdit2
                          className={`text-4xl mb-3 ${
                            error ? 'text-red-500' : 'text-amber-500'
                          }`}
                        />
                        <p className="text-gray-700 font-medium">
                          {currentDocument?.document_file
                            ? 'Replace current file'
                            : 'Add a file'}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Supported formats: PDF, DOC, DOCX, PNG, JPG
                        </p>
                        {currentDocument?.document_file && (
                          <p className="text-blue-600 text-sm mt-3">
                            Current file:{' '}
                            {currentDocument?.document_file.split('/').pop()}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">
                      {error}
                    </div>
                  )}

                  <ModalBottomButton
                    onCancel={closeModal}
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

export default ApplicationDocumentUpdateButton;
