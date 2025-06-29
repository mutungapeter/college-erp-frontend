"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { z } from "zod";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";

import { CourseSessionType, CourseType, ProgrammeCohortType } from "@/definitions/curiculum";

import { useGetCohortsQuery } from "@/store/services/curriculum/cohortsService";
import { useGetCoursesQuery } from "@/store/services/curriculum/coursesService";
import { updateSessionsSchema } from "@/schemas/curriculum/Sessions";
import { useUpdateCourseSessionMutation } from "@/store/services/curriculum/courseSessionService";
import { SessionStatusOptions } from "@/lib/constants";


export type SelectOption = {
  value: string | number;
  label: string;
};

type FormValues = z.infer<typeof updateSessionsSchema>;



type EditCourseSessionProps = {
  data: CourseSessionType;
  refetchData: () => void;
};

const EditCourseSession = ({ data, refetchData }: EditCourseSessionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [updateCourseSession, { isLoading: isUpdating }] = useUpdateCourseSessionMutation();
  const { data: cohortsData } = useGetCohortsQuery({}, { refetchOnMountOrArgChange: true });
  const { data: coursesData } = useGetCoursesQuery({}, { refetchOnMountOrArgChange: true });


  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(updateSessionsSchema),
    defaultValues: {
     
      course: data.course.id,
      cohort: data.cohort.id,
      status: data.status,
      start_time: formatDateForInput(data.start_time),
      period: data.period,
    }
  });

  
  useEffect(() => {
    if (data) {
      reset({
       
        course: data.course.id,
        cohort: data.cohort.id,
        status: data.status,
        start_time: formatDateForInput(data.start_time),
        period: data.period,
      });
    }
  }, [data, reset]);

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
  
  const handleCohortChange = (selected: SelectOption | null) => {
    if (selected) {
      const cohortId = Number(selected.value);
      setValue("cohort", cohortId);
    }
  };
  
  const handleCourseChange = (selected: SelectOption | null) => {
    if (selected) {
      const courseId = Number(selected.value);
      setValue("course", courseId);
    }
  };
  
  const handleStatusChange = (selected: SelectOption | null) => {
    if (selected && selected.value) {
      setValue("status", String(selected.value));
    }
  };

  const onSubmit = async (formData: FormValues) => {
    console.log("submitting form data", formData);

    try {
      const response = await updateCourseSession({
        id:data.id,
        data: formData,
      
      }).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Course Session updated successfully!");
      setShowSuccessModal(true);
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to update Course Session: ${errorData.error}`);
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
      <button
        onClick={handleOpenModal}
        className="text-blue-600 hover:text-blue-800 hover:rounded-xl p-2 rounded-full hover:bg-blue-100"
      >
        <FiEdit className="text-sm" />
      </button>

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
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Edit Course Session
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
                  
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Course<span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={coursesData?.map((course: CourseType) => ({
                            value: course.id,
                            label: course.name,
                          }))}
                          defaultValue={{
                            value: data.course.id,
                            label: data.course.name
                          }}
                          menuPortalTarget={document.body}
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
                          onChange={handleCourseChange}
                        />

                        {errors.course && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.course.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Cohort<span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={cohortsData?.map((cohort: ProgrammeCohortType) => ({
                            value: cohort.id,
                            label: cohort.name,
                          }))}
                          defaultValue={{
                            value: data.cohort.id,
                            label: data.cohort.name
                          }}
                          menuPortalTarget={document.body}
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Start Time<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        defaultValue={formatDateForInput(data.start_time)}
                        {...register("start_time")}
                      />
                      {errors.start_time && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.start_time.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Period (hours)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        defaultValue={data.period}
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        {...register("period", {
                          valueAsNumber: true,
                        })}
                      />
                      {errors.period && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.period.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block space-x-1 text-sm font-medium mb-2">
                      Status<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={SessionStatusOptions}
                      defaultValue={SessionStatusOptions.find(option => option.value === data.status)}
                      menuPlacement="auto"
                      onChange={handleStatusChange}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        control: (base) => ({
                          ...base,
                          minHeight: "44px",
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

                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6 gap-4 md:justify-between items-center py-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                                       className="border border-red-500 bg-white shadow-sm text-red-500 py-2 text-sm px-4 rounded-lg w-full min-w-[100px] md:w-auto hover:bg-red-500 hover:text-white"
  >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUpdating}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isUpdating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Updating...</span>
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

export default EditCourseSession;