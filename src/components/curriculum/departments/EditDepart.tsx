"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloseOutline } from "react-icons/io5";
import { z } from "zod";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import Select, { SingleValue } from "react-select";

import { DepartmentType, SchoolType } from "@/definitions/curiculum";
import { updateDepartmentSchema } from "@/schemas/curriculum/departments";
import { useUpdateDepartmentMutation } from "@/store/services/curriculum/departmentsService";
import { useGetSchoolsQuery } from "@/store/services/curriculum/schoolSService";
import { FiEdit } from "react-icons/fi";
const EditDepartment = ({
  department,
  refetchData,
}: {
  department: DepartmentType;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log("department", department);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isError, setIsError] = useState(false);

  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();
  const { data: schoolsData } = useGetSchoolsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  console.log("schoolsData", schoolsData);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(updateDepartmentSchema),
    defaultValues: {
      name: department?.name || "",
      school: department?.school?.id || undefined,
      office: department?.office || "",
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
  const handleSchoolChange = (
    selected: SingleValue<{ value: number | null; label: string }>
  ) => {
    if (selected) {
      setValue("school", Number(selected.value));
    } else {
      setValue("school", null);
    }
  };

  const onSubmit = async (formData: z.infer<typeof updateDepartmentSchema>) => {
    console.log("submitting form data");

    try {
      const response = await updateDepartment({
        id: department.id,
        data: formData,
      }).unwrap();
      console.log("response", response);

      setIsError(false);
      setSuccessMessage("Department Updated successfully!");
      setShowSuccessModal(true);

      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to update Department: ${errorData.error}`);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage("Failed to update Department. Please try again.");
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
        className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 cursor-pointer transition duration-200 shadow-sm"
        title="Edit Depart"
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
                    Edit Department
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
                      placeholder="e.g X Copmuter Science Department"
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
                      <label className="block mb-2 text-sm font-medium">School</label>
                      <Select
                        options={schoolsData?.map((school: SchoolType) => ({
                          value: school.id.toString(),
                          label: school.name,
                        }))}
                        menuPortalTarget={document.body}
                        defaultValue={{
                          value: department?.school?.id || null,
                          label: department?.school?.name || "",
                        }}
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: "25px",
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
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Office
                      </label>
                      <input
                        id="office"
                        type="text"
                        {...register("office")}
                        placeholder="e.g Greec Towers, 5th Floor"
                        className="w-full py-2 px-4 border placeholder:text-sm text-gray-500  rounded-md focus:outline-none "
                      />
                      {errors.office && (
                        <p className="text-red-500 text-sm">
                          {errors.office.message}
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
                      disabled={isSubmitting || isUpdating}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isUpdating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Editing...</span>
                        </span>
                      ) : (
                        <span>Edit</span>
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
export default EditDepartment;
