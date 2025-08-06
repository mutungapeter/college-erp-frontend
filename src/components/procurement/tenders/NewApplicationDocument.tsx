import { handleApiError } from "@/lib/ApiError";
import { ApplicationDocumentFormData, tenderApplicationDocumentCreateSchema } from "@/schemas/procurement";
import { useUploadTenderApplicationDocumentsMutation } from "@/store/services/finance/procurementService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheckCircle, FiUpload, FiX } from "react-icons/fi";
import { PiSpinnerGap } from "react-icons/pi";
import Select from "react-select";
import { toast } from "react-toastify";
import { ApplicationDetailsType, TenderApplicationDocumentOptions } from "./types";

interface Props {
  data: ApplicationDetailsType;
  refetchData: () => void;
}

type SelectOption = {
  value: string | number;
  label: string;
};


const UploadTenderApplicationDocuments = ({ data, refetchData }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [isError, setIsError] = useState(false);
  // const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [UploadTenderApplicationDocuments, { isLoading: isUploading }] = useUploadTenderApplicationDocumentsMutation();
console.log("data", data)
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setError("");
    reset();
  };

  const {
    setValue,
    reset,
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<ApplicationDocumentFormData>({
    resolver: zodResolver(tenderApplicationDocumentCreateSchema),
  });

   useEffect(() => {
      console.log("Form Errors:", errors);
    }, [errors]);
  
  const handleDocumentTypeChange = (selected: SelectOption | null) => {
    if (selected) {
      setValue("document_type", selected.value.toString());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError("");

    if (!selectedFile) return;

    setFile(selectedFile);
    setValue("file", selectedFile, {
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
    setValue("file", selectedFile, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onSubmit = async (submittedData: ApplicationDocumentFormData) => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    const application_id = String(data.id)
    const formData = new FormData();
    formData.append("application", application_id);
    formData.append("document_name", submittedData.document_name);
    formData.append("document_type", submittedData.document_type);
    formData.append("file", file);
    if  (submittedData.description) {
      formData.append("description", submittedData.description);
    }
    console.log("formData", formData);
    try {
       await UploadTenderApplicationDocuments(formData).unwrap();
      // setSuccessMessage("Document upload successful!");
      refetchData();
      closeModal();
      // setIsError(false);
    } catch (error:unknown) {
      handleApiError(error, "Failed to upload document")
      // setIsError(true);
      // setError("Failed to upload document, please try again.");
      toast.error("Unexpected error occurred. Please try again.");
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
        className="flex items-center space-x-2 md:p-2 p-2 w-fit bg-green-600 hover:bg-green-700 hover:ring-2 hover:ring-green-500 text-white rounded-md transition duration-300 shadow-sm cursor-pointer"
      >
        <FiUpload className="text-sm" />
        <span className="text-xs">Upload Document</span>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-6">Upload Application Document</h3>

            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Document Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Document Name"
                   className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                  {...register("document_name")}
                />
                {errors.document_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.document_name.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2">
                  Document Type<span className="text-red-500">*</span>
                </label>
                <Select
                  options={TenderApplicationDocumentOptions}
                  menuPortalTarget={document.body}
                  menuPlacement="auto"
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base) => ({ ...base, minHeight: "44px", minWidth: "200px", borderColor: "#d1d5db" }),
                  }}
                  onChange={handleDocumentTypeChange}
                />
                {errors.document_type && (
                  <p className="text-red-500 text-sm mt-1">{errors.document_type.message}</p>
                )}
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer mb-6
                  ${file ? "border-green-400 bg-green-50" : error ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}
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
                    <p className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(2)} KB</p>
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
                    <FiUpload className={`text-4xl mb-3 ${error ? "text-red-500" : "text-blue-500"}`} />
                    <p className="text-gray-700 font-medium">Click to select or drag a file here</p>
                    <p className="text-gray-500 text-sm mt-1">Supported formats: PDF, DOC, DOCX, PNG, JPG</p>
                  </>
                )}
              </div>

              {error && (
                <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!file || isSubmitting || isUploading}
                  className={`px-4 py-2 rounded-md text-white font-medium flex items-center gap-2
                    ${!file || isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {isUploading ? (
                    <PiSpinnerGap className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  ) : (
                    <FiUpload />
                  )}
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadTenderApplicationDocuments;
