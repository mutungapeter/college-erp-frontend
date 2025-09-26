"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import IconButton from "@/components/common/IconButton";
import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import ModalBottomButton from "@/components/common/StickyModalFooterButtons";
import { ApplicationType } from "@/definitions/admissions";
import { updateApplicationPersonalInfoSchema } from "@/schemas/admissions/main";
import { useUpdateApplicationMutation } from "@/store/services/admissions/admissionsService";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { z } from "zod";

const EditStudentApplicationPersonalInfo = ({
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
    resolver: zodResolver(updateApplicationPersonalInfoSchema),
    defaultValues: {
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
      email: data?.email || "",
      phone_number: data?.phone_number || "",
      gender: data?.gender || "",
      id_number: data?.id_number || "",
      passport_number: data?.passport_number || "",
      date_of_birth: data?.date_of_birth || "",
      postal_code: data?.postal_code || "",
      city: data?.city || "",
      country: data?.country || "",
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
    formData: z.infer<typeof updateApplicationPersonalInfoSchema>
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
      <IconButton
        onClick={handleOpenModal}
        title="Edit"
        icon={<FiEdit className="w-4 h-4" />}
        className="group relative p-2 bg-amber-100 text-amber-500 hover:bg-amber-600 hover:text-white focus:ring-amber-500"
        tooltip="Edit"
      />

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
              className="relative transform justify-center
               animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-2xl bg-white text-left
                 shadow-xl transition-all   
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-2
                justify-between items-center py-6 ">
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
                        First name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="first_name"
                        type="text"
                        {...register("first_name")}
                        placeholder="Enter new First name"
                        className="w-full py-2 px-4  text-sm font-light border placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-sm">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Last Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="last_name"
                        type="text"
                        {...register("last_name")}
                        placeholder="Enter new last name"
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-sm">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Email
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="e.g +2547..."
                        className="w-full py-2 px-4 text-sm border  font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-2">
                        ID NO:<span className="text-red-500"></span>
                      </label>
                      <input
                        id="id_number"
                        type="text"
                        {...register("id_number")}
                        placeholder="e.g XXXXXXX"
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.id_number && (
                        <p className="text-red-500 text-sm">
                          {errors.id_number.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Passport No:<span className="text-red-500"></span>
                      </label>
                      <input
                        id="passport_number"
                        type="text"
                        {...register("passport_number")}
                        placeholder="e.g XXXXXXX"
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.passport_number && (
                        <p className="text-red-500 text-sm">
                          {errors.passport_number.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-2">
                        City
                        <span className="text-red-500"></span>
                      </label>
                      <input
                        id="city"
                        type="text"
                        {...register("city")}
                        placeholder="e.g Thika"
                        className="w-full py-2 text-sm px-4 border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Country<span className="text-red-500"></span>
                      </label>
                      <input
                        id="country"
                        type="text"
                        {...register("country")}
                        placeholder="e.g Kenya"
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.country && (
                        <p className="text-red-500 text-sm">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Postal Code<span className="text-red-500"></span>
                      </label>
                      <input
                        id="postal_code"
                        type="text"
                        {...register("postal_code")}
                        placeholder="e.g 82-90119 "
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.postal_code && (
                        <p className="text-red-500 text-sm">
                          {errors.postal_code.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <ModalBottomButton
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                    isProcessing={isUpdating}
                  />
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
export default EditStudentApplicationPersonalInfo;
