"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiUserPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { z } from "zod";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import Select from "react-select";

import { ApplicationType } from "@/definitions/admissions";
import {
    ProgrammeCohortType
} from "@/definitions/curiculum";
import { enrollStudentSchema } from "@/schemas/admissions/main";
import { useEnrollApplicationMutation } from "@/store/services/admissions/admissionsService";
import { useGetCohortsQuery } from "@/store/services/curriculum/cohortsService";
import IconButton from "@/components/common/IconButton";
import ModalBottomButton from "@/components/common/StickyModalFooterButtons";

type SelectOption = {
  value: string | number;
  label: string;
};

type FormValues = z.infer<typeof enrollStudentSchema>;
interface Props {
  refetchData: () => void;
  data: ApplicationType  | null;
}
const EnrollStudent = ({ refetchData, data }:Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [enrollApplication, { isLoading: isCreating }] = useEnrollApplicationMutation();
 
  const { data: cohortsData } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(enrollStudentSchema),
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

 
  const handleCohortChange = (selected: SelectOption | null) => {
    if (selected) {
      const cohortId = Number(selected.value);
      setValue("cohort", cohortId);
    }
  };

  const onSubmit = async (formData: FormValues) => {
    console.log("submitting form data", formData);

    try {
      const response = await enrollApplication({
        application: data?.id,
        campus: data?.campus?.id,
        
        ...formData,
      }).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Student admitted successfully!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to admit Student: ${errorData.error}`);
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
        label="Enroll Applicant"
        icon={<FiUserPlus className="w-4 h-4" />}
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
                overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-450 md:max-w-450 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 
                flex  px-4 justify-between items-center py-6">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Enroll Applicant
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
                  
                   <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Class/Cohort Enrolling To<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={cohortsData?.map(
                          (item: ProgrammeCohortType) => ({
                            value: item.id,
                            label: `${item.name}(${item.current_year} - ${item.current_semester.name})`,
                          })
                        )}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        // menuPosition="absolute"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 10000,
                            overflow: "visible",
                            maxHeight: "300px",
                            paddingY: "20px",
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

export default EnrollStudent;
