"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { z } from "zod";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import Select from "react-select";

import { DepartmentType, SchoolType } from "@/definitions/curiculum";
import { ProgrammeLevelOptions } from "@/lib/constants";
import { programmeSchema } from "@/schemas/curriculum/programme";
import { useGetDepartmentsQuery } from "@/store/services/curriculum/departmentsService";
import { useCreateProgrammeMutation } from "@/store/services/curriculum/programmesService";
import { useGetSchoolsQuery } from "@/store/services/curriculum/schoolSService";
type SchoolOption = {
  value: string;
  label: string;
};
type FormValues = z.infer<typeof programmeSchema>;

const AddProgramme = ({ refetchData }: { refetchData: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isError, setIsError] = useState(false);

  const [createProgramme, { isLoading: isCreating }] =
    useCreateProgrammeMutation();
  const { data: schoolsData } = useGetSchoolsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(programmeSchema),
    defaultValues: {
      name: "",
      code: "",
      level: "",
      school: undefined,
      department: undefined,
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
  const handleSchoolChange = (selected: SchoolOption | null) => {
    if (selected) {
      setValue("school", Number(selected.value));
    }
  };
  const handleDepartmentChange = (selected: SchoolOption | null) => {
    if (selected) {
      setValue("department", Number(selected.value));
    }
  };
  const handleLevelChange = (
    selected: { value: string; label: string } | null
  ) => {
    if (selected) {
      setValue("level", selected.value);
    }
  };
  const onSubmit = async (formData: FormValues) => {
    console.log("submitting form data");

    try {
      const response = await createProgramme(formData).unwrap();
      console.log("response", response);

      setIsError(false);
      setSuccessMessage("Programme added successfully!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to add Programme: ${errorData.error}`);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage("Failed to add Programme. Please try again.");
        setShowSuccessModal(true);
      }
    }
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto"
      >
        <div
          className="bg-blue-600 inline-flex cursor-pointer w-max 
         items-center space-x-2 text-white px-2 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          <FiPlus className="text-lg" />
          <span className="text-xs font-medium">New Programme</span>
        </div>
      </div>

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
            className="fixed inset-0 min-h-full   z-100 w-screen flex flex-col text-center md:items-center
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-md  bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-3 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Add New Programme/Course
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={20}
                      onClick={handleCloseModal}
                      className="text-gray-500  "
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2  p-4 md:p-4 lg:p-4 "
                >
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      placeholder="e.g X Copmuter Science"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                    <div>
                      <label>School</label>
                      <Select
                        options={schoolsData?.map((school: SchoolType) => ({
                          value: school.id,
                          label: school.name,
                        }))}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
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
                        onChange={handleSchoolChange}
                      />

                      {errors.school && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.school.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Department</label>
                      <Select
                        options={departmentsData?.map(
                          (depart: DepartmentType) => ({
                            value: depart.id,
                            label: depart.name,
                          })
                        )}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
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
                        onChange={handleDepartmentChange}
                      />

                      {errors.school && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.school.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Programme Code
                      </label>
                      <input
                        id="code"
                        type="text"
                        {...register("code")}
                        placeholder="e.g BIT"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.code && (
                        <p className="text-red-500 text-sm">
                          {errors.code.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Level
                      </label>
                      <Select
                        options={ProgrammeLevelOptions}
                        onChange={handleLevelChange}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
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
                        <p className="text-red-500 text-sm">
                          {errors.level.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6  gap-4 md:justify-between items-center py-3 ">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                                          className="border border-red-500 bg-white shadow-sm text-red-500 py-2 text-sm px-4 rounded-lg w-full min-w-[100px] md:w-auto hover:bg-red-500 hover:text-white"
   >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isCreating}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isCreating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Adding...</span>
                        </span>
                      ) : (
                        <span>Add</span>
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
export default AddProgramme;
