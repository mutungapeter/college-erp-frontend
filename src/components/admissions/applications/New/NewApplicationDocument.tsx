import IconButton from "@/components/common/IconButton";
import { handleApiError } from "@/lib/ApiError";
import { ApplicationDocumentOptions } from "@/lib/constants";
import {
  ApplicationDocumentCreate,
  applicationDocumentCreateSchema,
} from "@/schemas/admissions/applicationDocuments";
import { useCreateApplicationDocumentMutation } from "@/store/services/admissions/admissionsService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheckCircle, FiUpload, FiUploadCloud, FiX } from "react-icons/fi";
import { MdOutlineCloud, MdOutlineCloudUpload } from "react-icons/md";
import { PiSpinnerGap } from "react-icons/pi";
import Select from "react-select";
import { toast } from "react-toastify";

interface Props {
  studentApplicationId: number;
  refetchData: () => void;
}

type SelectOption = {
  value: string | number;
  label: string;
};

const ApplicationDocumentUploadButton = ({
  studentApplicationId,
  refetchData,
}: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [isError, setIsError] = useState(false);
  // const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [createApplicationDocument, { isLoading: isUploading }] =
    useCreateApplicationDocumentMutation();
  console.log("Student application ID", studentApplicationId);
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
  } = useForm<ApplicationDocumentCreate>({
    resolver: zodResolver(applicationDocumentCreateSchema),
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
    setValue("document_file", selectedFile, {
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
    setValue("document_file", selectedFile, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onSubmit = async (data: ApplicationDocumentCreate) => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("student_application", studentApplicationId.toString());
    formData.append("document_name", data.document_name);
    formData.append("document_type", data.document_type);
    formData.append("document_file", file);
    console.log("formData", formData);
    try {
      await createApplicationDocument(formData).unwrap();
      // setSuccessMessage("Document upload successful!");
      refetchData();
      closeModal();
      // setIsError(false);
    } catch (error: unknown) {
      handleApiError(error, "Failed to upload document");
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
      <IconButton
        onClick={openModal}
        title="Add New"
        label="Upload"
        icon={<FiUploadCloud className="w-4 h-4 text-white" />}
        className="flex items-center space-x-2 px-4 py-2  
              
                    text-white
                    bg-primary rounded-md transition duration-300 cursor-pointer"
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full md:max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 py-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-xl py-4 font-bold text-gray-800 mb-6">
              Upload Application Document
            </h3>

            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="space-y-4"
            >
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
                  menuPortalTarget={document.body}
                  menuPlacement="auto"
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base) => ({
                      ...base,
                      minHeight: "44px",
                      minWidth: "200px",
                      borderColor: "#d1d5db",
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

              <div
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer mb-6
                  ${
                    file
                      ? "border-primary bg-green-50"
                      : error
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-primary hover:bg-primary-50"
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
                    <FiCheckCircle className="text-primary text-4xl mb-3" />
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
                    <MdOutlineCloudUpload
                      className={`text-4xl mb-3 ${
                        error ? "text-red-500" : "text-primary"
                      }`}
                    />
                    <p className="text-gray-700 font-medium">
                      Click to select or drag a file here
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Supported formats: PDF, DOC, DOCX, PNG, JPG
                    </p>
                  </>
                )}
              </div>

              {error && (
                <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">
                  {error}
                </div>
              )}

              <div className="flex justify-between gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border min-w-[120px] border-gray-300 rounded-md text-gray-700
                   hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!file || isSubmitting || isUploading}
                  className={`px-4 py-2 rounded-md min-w-[120px] text-white font-medium flex items-center gap-2
                    ${
                      !file || isUploading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:bg-primary-700"
                    }`}
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

export default ApplicationDocumentUploadButton;
