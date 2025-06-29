"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { z } from "zod";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";

import { SemesterType } from "@/definitions/curiculum";
import { SemesterNameOptions, SemesterStatusOptions } from "@/lib/constants";
import { updateSemesterSchema } from "@/schemas/curriculum/semesters";
import { useUpdateSemesterMutation } from "@/store/services/curriculum/semestersService";


type SelectOption = {
  value: string | number;
  label: string;
};

type FormValues = z.infer<typeof updateSemesterSchema>;

type EditSemesterProps = {
  data: SemesterType;
  refetchData: () => void;
};

const EditSemester = ({ data, refetchData }: EditSemesterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [updateSemester, { isLoading: isUpdating }] = useUpdateSemesterMutation();

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; 
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(updateSemesterSchema),
    defaultValues: {
      name: data.name,
      start_date: formatDateForInput(data.start_date),
      end_date: formatDateForInput(data.end_date),
      status: data.status,
    }
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        start_date: formatDateForInput(data.start_date),
        end_date: formatDateForInput(data.end_date),
        status: data.status,
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
  
  const handleSemesterNameChange = (selected: SelectOption | null) => {
    if (selected) {
      setValue("name", String(selected.value));
    }
  };
  
  const handleStatusChange = (selected: SelectOption | null) => {
    if (selected) {
      setValue("status", String(selected.value));
    }
  };

  const onSubmit = async (formData: FormValues) => {
    console.log("submitting form data", formData);

    try {
      const response = await updateSemester({
        id: data.id,
        data: formData,
      }).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Semester updated successfully!");
      setShowSuccessModal(true);
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to update Semester: ${errorData.error}`);
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
        className="text-blue-600 p-2 hover:text-blue-800 hover:rounded-xl rounded-full hover:bg-blue-100"
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
                    Edit Semester
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={30}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

               <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2 p-4 md:p-4 lg:p-4 "
                >
                 
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Semester<span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={SemesterNameOptions}
                          defaultValue={SemesterNameOptions.find(option => option.value === data.name)}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                            control: (base) => ({
                              ...base,
                              minHeight: "20px",
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
                          onChange={handleSemesterNameChange}
                        />

                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    </div>
                  
                  
                  
               
                        <div>

                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Start Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        defaultValue={formatDateForInput(data.start_date)}
                        {...register("start_date")}
                      />
                      {errors.start_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.start_date.message}
                        </p>
                      )}
                        </div>
                        <div>

                      <label className="block space-x-1 text-sm font-medium mb-2">
                        End Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full  py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        defaultValue={formatDateForInput(data.end_date)}
                        {...register("end_date")}
                      />
                      {errors.end_date && (
                        <p className="flex flex-col text-red-500 text-sm mt-1">
                          {errors.end_date.message}
                        </p>
                      )}
                        </div>
                    
                
                  
                  <div>
                    <label className="block space-x-1 text-sm font-medium mb-2">
                      Status<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={SemesterStatusOptions}
                      defaultValue={SemesterStatusOptions.find(option => option.value === data.status)}
                      onChange={handleStatusChange}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        control: (base) => ({
                          ...base,
                          minHeight: "22px",
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

export default EditSemester;