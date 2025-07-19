import { useState, useRef, useEffect } from "react";
import { FiUpload, FiCheckCircle, FiX } from "react-icons/fi";
import { PiSpinnerGap } from "react-icons/pi";
import { toast } from "react-toastify";

import { uploadStudentSchema } from "@/schemas/students/main";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUploadStudentsMutation } from "@/store/services/students/studentsService";
import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import { useGetProgrammesQuery } from "@/store/services/curriculum/programmesService";
import { CampusType, ProgrammeCohortType, ProgrammeType } from "@/definitions/curiculum";
import Select from "react-select";
import { useGetCohortsQuery } from "@/store/services/curriculum/cohortsService";
import { useGetCampusesQuery } from "@/store/services/curriculum/campusService";
interface Props {
  refetchData: () => void;
}
type SelectOption = {
  value: string | number;
  label: string;
};
type FormValues = z.infer<typeof uploadStudentSchema>;
const StudentUploadButton = ({ refetchData }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadStudents, { isLoading: isUploading }] =
    useUploadStudentsMutation();
  const { data: programmesData } = useGetProgrammesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: cohortsData } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: campusData } = useGetCampusesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
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
  } = useForm<FormValues>({
    resolver: zodResolver(uploadStudentSchema),
  });
  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const handleProgrammeChange = (selected: SelectOption | null) => {
    if (selected) {
      const progId = Number(selected.value);
      setValue("programme", progId);
    }
  };
  const handleCohortChange = (selected: SelectOption | null) => {
    if (selected) {
      const cohortId= Number(selected.value);
      setValue("cohort", cohortId);
    }
  };
  const handleCampusChange = (selected: SelectOption | null) => {
    if (selected) {
      const campusId= Number(selected.value);
      setValue("campus", campusId);
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

  const onSubmit = async (data: FormValues) => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("programme", String(data.programme));
    formData.append("cohort", String(data.cohort));
    formData.append("campus", String(data.campus));
    console.log("formData", formData);
    try {
      const response = await uploadStudents(formData).unwrap();
      console.log("response", response);

      setSuccessMessage(
        `Upload complete! ${response.count} student(s) Uploaded, ${response.failed_count} failed.`
      );

      setShowSuccessModal(true);
      setIsError(false);
      refetchData();
      setFile(null);
      setError("");
      reset();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      setError(
        "Failed to upload Students,confirm that all required data is included in the uploaded file."
      );
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);

        const msg =
          errorData.error ||
          "Students upload failed.Look for duplicate entries.";
        setSuccessMessage(msg);
        setShowSuccessModal(true);
      } else {
        toast.error("Unexpected erorr occured. Please try again.");
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
        className="flex items-center space-x-2 md:p-2 p-1 bg-blue-600
         hover:bg-blue-700 text-white   rounded-md transition duration-300 shadow-sm cursor-pointer"
      >
        <FiUpload className="text-sm" />
        <span className="text-xs">Upload Students</span>
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

            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Admit Students
            </h3>

            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="space-y-4"
            >
              <div>
                <div className="relative">
                  <label className="block space-x-1 text-sm font-medium mb-2">
                    Course<span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={programmesData?.map((item: ProgrammeType) => ({
                      value: item.id,
                      label: `${item.name}(${item.level})`,
                    }))}
                    menuPortalTarget={document.body}
                    menuPlacement="auto"
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: "44px",
                        minWidth: "200px",
                        borderColor: "#d1d5db",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#9ca3af",
                        },
                        "&:focus-within": {
                          borderColor: "#9ca3af",
                          boxShadow: "none",
                        },
                      }),
                    }}
                    onChange={handleProgrammeChange}
                  />

                  {errors.programme && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.programme.message}
                    </p>
                  )}
                </div>
              </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-4">

              <div className="relative">
                <div className="relative">
                  <label className="block space-x-1 text-sm font-medium mb-2">
                    Class<span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={cohortsData?.map((item: ProgrammeCohortType) => ({
                      value: item.id,
                      label: `${item.name}(${item.current_year} ${item.current_semester.name})`,
                    }))}
                    menuPortalTarget={document.body}
                    menuPlacement="auto"
                    // menuPosition="absolute"
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: "44px",
                        minWidth: "200px",
                        borderColor: "#d1d5db",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#9ca3af",
                        },
                        "&:focus-within": {
                          borderColor: "#9ca3af",
                          boxShadow: "none",
                        },
                      }),
                    }}
                    onChange={handleCohortChange}
                  />

                  {errors.cohort && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cohort.message}
                    </p>
                  )}
                </div>
              </div>
                 <div className="relative">
                <div className="relative">
                  <label className="block space-x-1 text-sm font-medium mb-2">
                    Campus<span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={campusData?.map((item: CampusType) => ({
                      value: item.id,
                      label: `${item.name}`,
                    }))}
                    menuPortalTarget={document.body}
                    menuPlacement="auto"
                    // menuPosition="absolute"
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: "44px",
                        minWidth: "200px",
                        borderColor: "#d1d5db",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#9ca3af",
                        },
                        "&:focus-within": {
                          borderColor: "#9ca3af",
                          boxShadow: "none",
                        },
                      }),
                    }}
                    onChange={handleCampusChange}
                  />

                  {errors.campus && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.campus.message}
                    </p>
                  )}
                </div>
              </div>
                  </div>
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
                  accept=".csv,.xls,.xlsx"
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
                      Supported formats: CSV, Excel (.xls, .xlsx)
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
                  href="/students.csv"
                  download
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Download template file
                </a>
              </div>

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

export default StudentUploadButton;
