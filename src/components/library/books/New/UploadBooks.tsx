import { useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiUpload, FiX } from "react-icons/fi";
import { PiSpinnerGap } from "react-icons/pi";
import { toast } from "react-toastify";

import { zodResolver } from "@hookform/resolvers/zod";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import { UploadBooksFormData, uploadBooksSchema } from "@/schemas/library/main";
import { useUploadBooksMutation } from "@/store/services/library/libraryService";
import { useForm } from "react-hook-form";
import { IoCloseOutline } from "react-icons/io5";
interface Props {
  refetchData: () => void;
}
interface UploadResponse {
  success: boolean;
  message: string;
  success_count: number;
  skipped_count: number;
  errors: string[];
}


const UploadBooks = ({ refetchData }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const [uploadBooks, { isLoading: isUploading }] = useUploadBooksMutation();


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setError("");
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
    formState: { isSubmitting, errors },
  } = useForm<UploadBooksFormData>({
    resolver: zodResolver(uploadBooksSchema),
  });
  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError("");

    if (!selectedFile) return;

    setFile(selectedFile);
    setValue("books_csv", selectedFile, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError("");

    const selectedFile = e.dataTransfer.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setValue("books_csv", selectedFile, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
const formatUploadMessage = (response: UploadResponse): string => {
    const { success_count, skipped_count, errors } = response;
    
    let message = `Upload completed!\n`;
    message += `Successfully uploaded: ${success_count} books\n`;
    
    if (skipped_count > 0) {
      message += `Skipped: ${skipped_count} books\n`;
    }
    
    if (errors.length > 0) {
      message += `Duplicate Errors: ${errors.length}\n`;
    }
    
    return message.trim();
  };
  const onSubmit = async (data: UploadBooksFormData) => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("books_csv", data.books_csv);
    

    console.log("formData", formData);
       try {
      const response: UploadResponse = await uploadBooks(formData).unwrap();
      console.log("response", response);


      const formattedMessage = formatUploadMessage(response);
      setSuccessMessage(formattedMessage);
      
      const hasErrors = response.errors && response.errors.length > 0;
      const noSuccessfulUploads = response.success_count === 0;
      
      setIsError(hasErrors && noSuccessfulUploads);
      setShowSuccessModal(true);
      if (response.success_count > 0) {
        refetchData();
      }

      if (response.success_count > 0) {
        toast.success(`${response.success_count} books uploaded successfully!`);
      }
      
      if (response.skipped_count > 0) {
        toast.warning(`${response.skipped_count} books were skipped`);
      }

      setFile(null);
      setError("");
      reset();
      
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = error as { data: { error?: string; message?: string; errors?: string[] } };
        console.log("errorData", errorData.data);
        let errorMessage = "";
        let errorDetails: string[] = [];

        if (errorData.data.error) {
          errorMessage = errorData.data.error;
        } else if (errorData.data.message) {
          errorMessage = errorData.data.message;
        } else {
          errorMessage = "Failed to upload books. Please check your file format.";
        }

        if (errorData.data.errors && Array.isArray(errorData.data.errors)) {
          errorDetails = errorData.data.errors;
        }
        console.log("errorDetails", errorDetails)


        setSuccessMessage(errorMessage);
    
        setShowSuccessModal(true);
        
        toast.error("Upload failed. Please check the errors and try again.");
      } else {
        const errorMessage = "Unexpected error occurred. Please try again.";
        setSuccessMessage(errorMessage);
        setShowSuccessModal(true);
        toast.error(errorMessage);
      }
    } finally {
      setFile(null);
      setError("");
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div
        onClick={openModal}
        className="flex items-center space-x-2 px-4 py-2 bg-gray
         hover:bg-gray-700 text-white   rounded-md transition duration-300 shadow-sm cursor-pointer"
      >
        <FiUpload className="text-sm" />
        <span className="text-sm">Upload Books</span>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0
         bg-black bg-opacity-50 z-40
         flex items-center justify-center p-4"
        >
          <div
            className="bg-white rounded-lg
           shadow-xl 
          w-full md:max-w-c-500 p-6 relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <IoCloseOutline size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Upload Books (Csv)
            </h3>

            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="space-y-4"
            >
             
              <div
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer mb-6
                  ${
                    file
                      ? "border-green-400 bg-green-50"
                      : error
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
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
                  accept=".csv"
                />

                {file ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <FiUpload
                      className={`text-4xl mb-3 ${
                        error ? "text-red-500" : "text-blue-500"
                      }`}
                    />
                    <p className="text-gray-700 font-medium">
                      Click to select or drag a file here
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Supported formats: CSV
                    </p>
                  </>
                )}
              </div>

              {error && (
                <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">
                  {error}
                </div>
              )}

              <div className="mb-6 text-center">
                <a
                  href="/books.csv"
                  download
                  className="text-primary-600 hover:text-primary-800 text-sm underline"
                >
                  Download template file
                </a>
              </div>

              <div className="flex justify-between gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-red-500 rounded-md text-red-700 hover:bg-red-500  hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!file || isSubmitting || isUploading}
                  className={`px-4 py-2 rounded-md text-white font-medium flex items-center gap-2
                    ${
                      !file || isUploading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {isUploading ? (
                    <>
                      <PiSpinnerGap className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiUpload />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          {showSuccessModal && (
            <SuccessFailModal
              message={successMessage}
              onClose={handleCloseSuccessModal}
              isError={isError}
            />
          )}
        </div>
      )}
    </>
  );
};

export default UploadBooks;
