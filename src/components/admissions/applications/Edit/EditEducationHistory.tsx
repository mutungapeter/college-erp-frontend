"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";

import { IoCloseOutline } from "react-icons/io5";
import { z } from "zod";

import { Application_education_history } from "@/definitions/admissions";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { EducationHistoryOptions } from "@/lib/constants";
import { updateApplicationEducationHistorySchema } from "@/schemas/admissions/main";
import Select from "react-select";
import { useUpdateEducationHistoryMutation } from "@/store/services/admissions/admissionsService";

const EditEducationHistory = ({
  data,
  refetchData,
  application_id
}: {
  data: Application_education_history | null;
  application_id: number | null;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isError, setIsError] = useState(false);

  const [updateEducationHistory, { isLoading: isUpdating }] = useUpdateEducationHistoryMutation();
  console.log("data", data);
  type FormValues = z.infer<typeof updateApplicationEducationHistorySchema>;
  const {
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(updateApplicationEducationHistorySchema),
    defaultValues: {
      institution: data?.institution || "",
      grade_or_gpa: data?.grade_or_gpa || "",
      level: data?.level || "",
      year: data?.year || "",
      major: data?.major || "",
      graduated: data?.graduated || false,
    },
  });
const graduatedValue = watch("graduated");
  const handleLevelChange = (selected: LabelOptionsType | null) => {
    if (selected && selected.value) {
      setValue("level", String(selected.value));
    }
  };
  
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

  const onSubmit = async (formData: FormValues) => {
    console.log("submitting form data for update", formData);
   
    const submissionData = {
      student_application: application_id,
      ...formData,
    }
    console.log("submissionData", submissionData);

    try {
      const response = await updateEducationHistory({
        id: data?.id,
        data: submissionData,
      }).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Education history details updated successfully!");
      setShowSuccessModal(true);
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        setIsError(true);
        setSuccessMessage(
          "An error occured while updating Education History details.Please try again!."
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
        className="p-2 rounded-xl  text-blue-600 hover:bg-blue-200 hover:text-blue-700 cursor-pointer transition duration-200 shadow-sm"
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
                w-full sm:max-w-c-550 md:max-w-550 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-2 ">
                  <p className="text-sm md:text-lg lg:text-lg font-bold ">
                    Edit Education History
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
                  <div>
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Instituion<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        placeholder="e.g. Masinde Muliro University of Science and Technology"
                        {...register("institution")}
                      />
                      {errors.institution && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.institution.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Year<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. 2018"
                          {...register("year")}
                        />
                        {errors.year && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.year.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Grade/GPA<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. "
                          {...register("grade_or_gpa")}
                        />
                        {errors.grade_or_gpa && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.grade_or_gpa.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Major<span className="text-red-500"></span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g user@example.com"
                          {...register("major")}
                        />
                        {errors.major && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.major.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Level<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={EducationHistoryOptions}
                        onChange={handleLevelChange}
                        defaultValue={{
                          value:
                            data?.level || "",
                          label:
                            data?.level || "",
                        }}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        menuPosition="absolute"
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
                      {errors.level && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.level.message}
                        </p>
                      )}
                    </div>
                  </div>
                   <div className="mt-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="graduated"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        {...register("graduated")}
                      />
                       <label htmlFor="graduated" className="ml-2 text-sm font-medium text-gray-700">
                        Graduated {graduatedValue ? "(Yes)" : "(No)"}
                      </label>
                    </div>
                    {errors.graduated && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.graduated.message}
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
export default EditEducationHistory;
