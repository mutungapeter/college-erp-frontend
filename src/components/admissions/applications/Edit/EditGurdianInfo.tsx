"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { z } from "zod";
import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import { ApplicationType } from "@/definitions/admissions";
import { updateGurdianSchema } from "@/schemas/admissions/main";
import { useUpdateApplicationMutation } from "@/store/services/admissions/admissionsService";

const EditGuardianApplicationPersonalInfo = ({
  data,
  refetchData,
}: {
  data: ApplicationType | null;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isError, setIsError] = useState(false);

  const [updateApplication, { isLoading: isUpdating }] =
    useUpdateApplicationMutation();

  const {
    register,
    handleSubmit,

    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(updateGurdianSchema),
    defaultValues: {
      guardian_name: data?.guardian_name || "",
      guardian_email: data?.guardian_email || "",
      guardian_relationship: data?.guardian_relationship || "",
      guardian_phone_number: data?.guardian_phone_number || "",
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

  const onSubmit = async (
    formData: z.infer<typeof updateGurdianSchema>
  ) => {
    console.log("submitting form data for update", formData);
    console.log("data", formData);
    try {
      const response = await updateApplication({
        id: data?.id,
        data: formData,
      }).unwrap();
      console.log("response", response);

      setIsError(false);
      setSuccessMessage("Personal Info updated successfully!");
      setShowSuccessModal(true);

      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        setIsError(true);
        setSuccessMessage(
          "An error occured while updating Personal Info.Please try again!."
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

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="px-3 py-1 rounded-lg inline-flex items-center space-x-3
         bg-blue-100 text-blue-600 hover:bg-blue-200
          hover:text-blue-700 cursor-pointer transition duration-200 shadow-sm"
        title="Edit Event"
      >
        <FiEdit className="text-sm" />
        <span>Update</span>
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
                w-full sm:max-w-c-550 md:max-w-550 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-2 ">
                  <p className="text-sm md:text-lg lg:text-lg font-bold ">
                    Edit Personal Information
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={25}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3 mt-2 p-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2 gap-2">
                    <div>
                      <label className="block space-x-1 text-xs font-bold mb-2">
                        Guardian name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="guardian_name"
                        type="text"
                        {...register("guardian_name")}
                        placeholder="Enter new First name"
                        className="w-full py-2 px-4  text-sm font-light border placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.guardian_name && (
                        <p className="text-red-500 text-sm">
                          {errors.guardian_name.message}
                        </p>
                      )}
                    </div>

                    
                    <div>
                      <label className="block text-xs font-bold mb-2">
                       Guardian email
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("guardian_email")}
                        placeholder="e.g user@example.com"
                        className="w-full py-2 px-4 text-sm border  font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.guardian_email && (
                        <p className="text-red-500 text-sm">
                          {errors.guardian_email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Guardian relationship<span className="text-red-500"></span>
                      </label>
                      <input
                        id="guardian_relationship"
                        type="text"
                        {...register("guardian_relationship")}
                        placeholder="e.g Father , Mother ,Uncle etc"
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.guardian_relationship && (
                        <p className="text-red-500 text-sm">
                          {errors.guardian_relationship.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Guardian Phone<span className="text-red-500"></span>
                      </label>
                      <input
                        id="guardian_phone_number"
                        type="text"
                        {...register("guardian_phone_number")}
                        placeholder="e.g 07xxxxxxxxx"
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.guardian_phone_number && (
                        <p className="text-red-500 text-sm">
                          {errors.guardian_phone_number.message}
                        </p>
                      )}
                    </div>

                    
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
export default EditGuardianApplicationPersonalInfo;
