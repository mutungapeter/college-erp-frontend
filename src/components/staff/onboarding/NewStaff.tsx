"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import Select from "react-select";
import { useGetUserRolesQuery } from "@/store/services/permissions/permissionsService";

import {
  DepartmentType
} from "@/definitions/curiculum";
import { Position } from "@/definitions/staff";
import { GenderOptions } from "@/lib/constants";
import { createStaffSchema, CreateStaffType } from "@/schemas/staff/main";
// import { useGetRolesQuery } from "@/store/services/curriculum/campusService";
import { useGetDepartmentsQuery } from "@/store/services/curriculum/departmentsService";
import { useCreateStaffMutation, useGetPositionsQuery } from "@/store/services/staff/staffService";
import { RoleType } from "@/components/accounts/permissions/types";

type SelectOption = {
  value: string | number;
  label: string;
};



const CreateStaff = ({ refetchData }: { refetchData: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: positionsData } = useGetPositionsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: rolesData } = useGetUserRolesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
console.log("rolesData", rolesData);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<CreateStaffType>({
    resolver: zodResolver(createStaffSchema),
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

  const handleGenderChange = (selected: SelectOption | null) => {
    if (selected && selected.value) {
      setValue("gender", String(selected.value));
    }
  };
  const handlePositionChange = (selected: SelectOption | null) => {
    if (selected) {
      const positionId = Number(selected.value);
      setValue("position", positionId);
    }
  };
  const handleDepartmentChange = (selected: SelectOption | null) => {
    if (selected) {
      const departId = Number(selected.value);
      setValue("department", departId);
    }
  };
  const handleRoleChange = (selected: SelectOption | null) => {
    if (selected) {
      const roleId = Number(selected.value);
      setValue("role", roleId);
    }
  };
  
 
  const onSubmit = async (formData: CreateStaffType) => {
    console.log("submitting form data", formData);

    try {
      const response = await createStaff(formData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Staff Created successfully!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to create staff: ${errorData.error}`);
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
      <div
        onClick={handleOpenModal}
        className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto"
      >
        <div
          className="bg-primary-600 inline-flex cursor-pointer w-max 
         items-center space-x-2 text-white px-4 py-2 rounded-md hover:bg-primary-700 
         shadow-md transition duration-300"
        >
          <FiPlus className="text-sm" />
          <span className="text-xs font-medium">Add Staff</span>
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
            className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center
           justify-start overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-600 md:max-w-600 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Add New Staff 
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
                  className="space-y-4 mt-2 p-4 md:p-4 lg:p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          First Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. John"
                          {...register("first_name")}
                        />
                        {errors.first_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.first_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Last Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. Kamusukuti"
                          {...register("last_name")}
                        />
                        {errors.last_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.last_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Phone<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. 07xxxxxxxxx"
                          {...register("phone_number")}
                        />
                        {errors.phone_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone_number.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Email<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g user@example.com"
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Date of birth<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        {...register("date_of_birth")}
                      />
                      {errors.date_of_birth && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.date_of_birth.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Gender<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={GenderOptions}
                        onChange={handleGenderChange}
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
                      {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Address<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. 123 Main St"
                          {...register("address")}
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.address.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Home town<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. 123 Main St"
                          {...register("city")}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                    </div>
                   <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Position<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={positionsData?.map(
                          (item: Position) => ({
                            value: item.id,
                            label: `${item.name}`,
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
                        onChange={handlePositionChange}
                      />

                      {errors.position && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.position.message}
                        </p>
                      )}
                    </div>
                  
                
                    <div>
                      <div className="relative">
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Department<span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={departmentsData?.map(
                            (item: DepartmentType) => ({
                              value: item.id,
                              label: `${item.name}`,
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
                          onChange={handleDepartmentChange}
                        />

                        {errors.department && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.department.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Role<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={rolesData?.map(
                          (item: RoleType) => ({
                            value: item.id,
                            label: `${item.name}`,
                          })
                        )}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
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
                        onChange={handleRoleChange}
                      />

                      {errors.role && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                  
                  <div className="sticky bottom-0 bg-white z-40 flex  space-x-3 gap-4 md:justify-end items-center py-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-gray-300 bg-white shadow-sm text-gray-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isCreating}
                      className="bg-primary-600 text-white py-2 hover:bg-primary-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isCreating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Admitting...</span>
                        </span>
                      ) : (
                        <span>Admit</span>
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

export default CreateStaff;
