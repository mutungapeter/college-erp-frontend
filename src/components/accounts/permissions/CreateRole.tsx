"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import { RoleFormData, roleSchema } from "@/schemas/accounts";
import {
  useCreateRoleMutation,
  useGetModulesQuery,
} from "@/store/services/permissions/permissionsService";
import { Module } from "./types";

interface Props {
  refetchData?: () => void;
}

const NewRoleWithPermissions = ({ refetchData }: Props) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const { data: modulesData = [], isLoading: isModulesLoading } =
    useGetModulesQuery({}, { refetchOnMountOrArgChange: true });
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      modules: [],
    },
  });

  const selectedModules = watch("modules");

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
  };

  const onSubmit = async (formData: RoleFormData) => {
    console.log("Submitting form data", formData);
    try {
      const response = await createRole(formData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Role created successfully");
      setShowSuccessModal(true);
      reset();
      refetchData?.();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      setShowSuccessModal(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);

        const msg = errorData.error || "Failed to create role.";
        setSuccessMessage(msg);
        setShowSuccessModal(true);
      } else {
        setSuccessMessage("Unexpected error occurred. Please try again.");
      }
    }
  };

  const toggleModuleSelection = (moduleId: number) => {
    const current = selectedModules || [];
    if (current.includes(moduleId)) {
      setValue(
        "modules",
        current.filter((id) => id !== moduleId)
      );
    } else {
      setValue("modules", [...current, moduleId]);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Role and Permissions
          </h1>
          <p className="text-gray-600 mt-2">Create New Role</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="mt-1 block w-full md:w-auto md:min-w-[50%]
    border border-gray-300 rounded-lg p-2 
    focus:outline-none focus:ring-0 focus:border-primary"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Modules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modules (Select to grant view access)
            </label>
            {isModulesLoading ? (
              <p>Loading modules...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {modulesData.map((module: Module) => (
                  <label
                    key={module.id}
                    className="flex items-center space-x-2 border rounded p-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(module.id)}
                      onChange={() => toggleModuleSelection(module.id)}
                    />
                    <span>{module.name}</span>
                  </label>
                ))}
              </div>
            )}
            {errors.modules && (
              <p className="text-red-500 text-sm mt-1">
                {errors.modules.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isCreating}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Role"}
            </button>
          </div>
        </form>

        {showSuccessModal && (
          <SuccessFailModal
            message={successMessage}
            onClose={handleCloseSuccessModal}
            isError={isError}
          />
        )}
      </div>
    </div>
  );
};

export default NewRoleWithPermissions;
