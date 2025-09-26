"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { z } from "zod";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import Select from "react-select";

import IconButton from "@/components/common/IconButton";
import ModalBottomButton from "@/components/common/StickyModalFooterButtons";
import { ApplicationType } from "@/definitions/admissions";
import { EducationHistoryOptions } from "@/lib/constants";
import { applicationEducationHistoryCreateSchema } from "@/schemas/admissions/main";
import { useCreateEducationHistoryMutation } from "@/store/services/admissions/admissionsService";

type SelectOption = {
  value: string | number;
  label: string;
};

type FormValues = z.infer<typeof applicationEducationHistoryCreateSchema>;

const NewEducationHistory = ({ refetchData, data }: { refetchData: () => void; data: ApplicationType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [createEducationHistory, { isLoading: isCreating }] = useCreateEducationHistoryMutation();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(applicationEducationHistoryCreateSchema),
  });

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
  };

  const handleOpenModal = () => setIsOpen(true);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const handleLevelChange = (selected: SelectOption | null) => {
    if (selected && selected.value) {
      setValue("level", String(selected.value));
    }
  };
  
  
  const onSubmit = async (formData: FormValues) => {
    console.log("submitting form data", formData);
    const submissionData = {
        student_application: data.id,
         ...formData };
         console.log("submissionData",submissionData)
    try {
      const response = await createEducationHistory(submissionData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Education record successfully added!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to add education record: ${errorData.error}`);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage("Unexpected error occurred. Please try again.");
        setShowSuccessModal(true);
      }
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpenModal}
        title="Add New"
        label="Add New"
        icon={<FiPlus className="w-4 h-4" />}
        className="bg-primary text-white px-4 py-2 hover:bg-primary-600 focus:ring-primary-500 focus:ring-offset-1"
      />

      {isOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn"
            aria-hidden="true"
          ></div>

          <div
            className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-2xl bg-white text-left  shadow-xl transition-all   
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-6">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Add New Education History
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={20}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2 p-4 md:p-4 lg:p-4"
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
                      </div>
                        {errors.institution && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.institution.message}
                          </p>
                        )}
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
                            minHeight: "24px",
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
                        Graduated
                      </label>
                    </div>
                    {errors.graduated && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.graduated.message}
                      </p>
                    )}
                  </div>
                  <ModalBottomButton
                                      onCancel={handleCloseModal}
                                      isSubmitting={isSubmitting}
                                      isProcessing={isCreating}
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

export default NewEducationHistory;
