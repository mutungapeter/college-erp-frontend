import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import {
  StaffDocumentMultiCreate,
  staffDocumentMultiCreateSchema,
} from "@/schemas/staff/main";
import { useUploadStaffDocumentMutation } from "@/store/services/staff/staffService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FiUpload, FiX } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { toast } from "react-toastify";

interface Props {
  staffId: string;
  refetchData: () => void;
}

type SelectOption = { value: string; label: string };

const DOCUMENT_TYPE_OPTIONS: SelectOption[] = [
  { value: "KRA_PIN", label: "KRA PIN" },
  { value: "ID", label: "ID" },
  { value: "NSSF", label: "NSSF" },
  { value: "NHIF", label: "NHIF" },
  { value: "Career Certifications", label: "Career Certifications" },
];

const StaffDocumentMultiUpload = ({ staffId, refetchData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [uploadStaffDocuments, { isLoading: uploading }] =
    useUploadStaffDocumentMutation();
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StaffDocumentMultiCreate>({
    resolver: zodResolver(staffDocumentMultiCreateSchema),
    defaultValues: {
      documents: [{ document_type: "", document_file: null }],
    },
  });
  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    reset();
    setShowSuccessModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    closeModal();
  };

  const onSubmit = async (data: StaffDocumentMultiCreate) => {
    if (data.documents.some((doc) => !doc.document_file)) {
      toast.error("Please select a file for each document.");
      return;
    }

    try {
      const documentsMeta = data.documents.map((doc) => ({
        document_type: doc.document_type,
        notes: doc.notes || "",
      }));

      const formData = new FormData();
      formData.append("staff", staffId);
      formData.append("documents", JSON.stringify(documentsMeta));

      data.documents.forEach((doc, index) => {
        if (doc.document_file) {
          formData.append(`document_files[${index}]`, doc.document_file);
        }
      });

      await uploadStaffDocuments(formData).unwrap();
      setIsError(false);
      setSuccessMessage("Staff added to payroll  successfully!");
      setShowSuccessModal(true);
      refetchData();
    } catch (error: unknown) {
        setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`${errorData.error}` || "Failed to upload documents");
        setShowSuccessModal(true);
      }
    } finally {
      reset({ documents: [{ document_type: "", document_file: undefined }] });
      setShowSuccessModal(true);
    }
  };

  return (
    <>
      <div
        onClick={openModal}
        className="bg-blue-800 cursor-pointer w-max inline-flex items-center space-x-2 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition duration-300"
      >
        <FiUpload />
        <span className="text-xs font-medium">Upload Documents</span>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded bg-white shadow-lg max-h-[90vh] overflow-auto">
            <div className="sticky top-0 z-10 flex justify-between items-center bg-white px-4 py-3 border-b">
              <h3
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                Upload Staff Documents
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoCloseOutline size={28} />
              </button>
            </div>

            <div className="p-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
                className="space-y-6"
              >
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded p-4 relative">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <FiX />
                    </button>

                    <label className="block font-medium mb-1">
                      Document Type
                    </label>
                    <Select
                      options={DOCUMENT_TYPE_OPTIONS}
                      onChange={(option) =>
                        setValue(
                          `documents.${index}.document_type`,
                          option?.value || "",
                          {
                            shouldValidate: true,
                          }
                        )
                      }
                      placeholder="Select document type"
                    />
                    {errors.documents?.[index]?.document_type && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.documents[index]?.document_type?.message}
                      </p>
                    )}

                    <label className="block font-medium mt-4 mb-1">
                      Upload File
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setValue(`documents.${index}.document_file`, file, {
                          shouldValidate: true,
                        });
                      }}
                    />
                    {errors.documents?.[index]?.document_file && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.documents[index]?.document_file?.message}
                      </p>
                    )}

                    <label className="block font-medium mt-4 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      className="w-full border rounded p-2"
                      {...register(`documents.${index}.notes`)}
                    />
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      append({ document_type: "", document_file: null })
                    }
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    + Add another document
                  </button>

                  <button
                    type="submit"
                    disabled={uploading || isSubmitting}
                    className={`px-3 py-2 rounded text-white  ${
                      uploading || isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {uploading ? "Uploading..." : "Upload Documents"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <SuccessFailModal
          message={successMessage}
          onClose={handleCloseSuccessModal}
          isError={isError}
        />
      )}
    </>
  );
};

export default StaffDocumentMultiUpload;
