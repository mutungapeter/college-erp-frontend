"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import { SelectOption } from "@/components/curriculum/courseSessions/EditSession";
import { IssuedBookType } from "@/definitions/library";
import { BorrowedBookStatusOptions } from "@/lib/constants";
import {
  UpdateIssuedBookStatusSchema,
  UpdateIssuedBookStatusType,
} from "@/schemas/library/main";
import {
  useUpdateIssuedBookMutation
} from "@/store/services/library/libraryService";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit, FiInfo } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
const UpdateBorrowedBookStatus = ({
  data,
  refetchData,
}: {
  data: IssuedBookType | null;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isError, setIsError] = useState(false);
  console.log("data", data);
  const [updateIssuedBook, { isLoading: isUpdating }] =
    useUpdateIssuedBookMutation();

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<UpdateIssuedBookStatusType>({
    resolver: zodResolver(UpdateIssuedBookStatusSchema),
    defaultValues: {
      status: data?.status || "",
    },
  });

  useEffect(() => {
    console.log("Form Errors:", errors);
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

  const onSubmit = async (formData: UpdateIssuedBookStatusType) => {
    console.log("submitting form data for update", formData);
    console.log("data", formData);
    try {
      const response = await updateIssuedBook({
        id: data?.id,
        data: formData,
      }).unwrap();
      console.log("response", response);

      setIsError(false);
      setSuccessMessage("Borrowing status   updated successfully!");
      setShowSuccessModal(true);

      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        setIsError(true);
        setSuccessMessage(
          errorData.error ||
            "An error occured while updating borrowing status Info.Please try again!."
        );
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage("Unexpected error occured. Please try again.");
        setShowSuccessModal(true);
      }
    } finally {
      refetchData();
    }
  };
  const handleStatusChange = (selected: SelectOption | null) => {
    if (selected && selected.value) {
      setValue("status", String(selected.value));
    }
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="p-2 rounded-xl 
         text-blue-600 hover:bg-blue-200
          hover:text-blue-700 cursor-pointer transition duration-200 w-max shadow-sm"
        title="Edit"
      >
        <FiEdit className="text-sm" />
      </div>

      {isOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            // onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn"
            aria-hidden="true"
          ></div>

          <div
            className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-4 ">
                  <p className="text-sm md:text-lg lg:text-lg font-bold ">
                    Update Borrowed Book Status
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={25}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>
                <div className="mx-3 mb-4 p-4 bg-yellow-100 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <FiInfo
                      className="text-yellow-600 mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">
                        Status Change Guidelines
                      </p>
                      <p className="break-words whitespace-normal">
                        Borrowed Books records with status{" "}
                        <span className="font-semibold">&ldquo;Returned&ldquo;</span> cannot
                        be modified as they have completed the borrowing cycle.
                        All other statuses (Pending Return, Lost, Lost, etc.)
                        can be updated as needed to reflect the current state of
                        the book.
                      </p>
                    </div>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3 mt-2 p-3"
                >
                  <div className="relative">
                    <label className="block space-x-1 text-sm font-medium mb-2">
                      Status<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={BorrowedBookStatusOptions}
                      defaultValue={BorrowedBookStatusOptions.find(
                        (option) => option.value === data?.status || ""
                      )}
                      onChange={handleStatusChange}
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 999999,
                        }),
                        menu: (base) => ({
                          ...base,
                          position: "absolute",
                          width: "max-content",
                          minWidth: "100%",
                          minHeight: "50px",
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
                    />
                    {errors.status && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6 gap-4 md:justify-end items-center py-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-gray-300 bg-white shadow-sm text-gray-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUpdating}
                      className="bg-blue-500 text-white py-2 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isUpdating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          Updating
                        </span>
                      ) : (
                        <span>Update</span>
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
export default UpdateBorrowedBookStatus;
