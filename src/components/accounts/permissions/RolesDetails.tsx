"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import { roleSchema, RoleFormData } from "@/schemas/accounts";
import {
  useGetModulesQuery,
  useGetRoleWithPermissionsDetailsQuery,
  useUpdateRoleMutation,
} from "@/store/services/permissions/permissionsService";
import { Module, Permission } from "./types";

interface Props {
  id: string | number | null;
}

const RoleWithPermissionsDetails = ({ id }: Props) => {
  const { data: role, isLoading, error } = useGetRoleWithPermissionsDetailsQuery(id, { skip: !id });
  const { data: modulesData = [] } = useGetModulesQuery({});
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

console.log("Role:", role);
const {
  register,
  handleSubmit,
  watch,
  setValue,
  formState: { errors },
} = useForm<RoleFormData>({
  resolver: zodResolver(roleSchema),
  defaultValues: {
    name: role?.name || "",
    modules: [],
  },
});

  const selectedModules = watch("modules");

useEffect(() => {
  if (role) {
    setValue("name", role.name || "");
    setValue("modules", role.permissions?.map((p: Permission) => p.module) || []);
  }
}, [role, setValue]);

  const toggleModuleSelection = (moduleId: number) => {
    const current = selectedModules || [];
    if (current.includes(moduleId)) {
      setValue("modules", current.filter((id) => id !== moduleId));
    } else {
      setValue("modules", [...current, moduleId]);
    }
  };

  const onSubmit = async (formData: RoleFormData) => {
    try {
      await updateRole({ id: Number(id), data: formData }).unwrap();
      setIsError(false);
      setSuccessMessage("Role updated successfully");
      setShowSuccessModal(true);
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      setShowSuccessModal(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);

        const msg = errorData.error || "Failed to update role.";
        setSuccessMessage(msg);
        setShowSuccessModal(true);
      } else {
        setSuccessMessage("Unexpected error occurred. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <ContentSpinner />
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading data
          </h2>
          <p className="text-gray-600">
            An error occurred while loading permissions data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <Link href={`/dashboard/permissions/roles`} className="flex items-center space-x-2 mb-6">
        <FiArrowLeft className="text-xl" />
        <span>Back To Roles & Permissions</span>
      </Link>

      <h1 className="text-2xl font-bold mb-4">Edit Role</h1>

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
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Modules */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modules (Select to grant view access)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {modulesData.map((module: Module) => (
              <label key={module.id} className="flex items-center space-x-2 border rounded p-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedModules.includes(module.id)}
                  onChange={() => toggleModuleSelection(module.id)}
                />
                <span>{module.name}</span>
              </label>
            ))}
          </div>
          {errors.modules && <p className="text-red-500 text-sm">{errors.modules.message}</p>}
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Role"}
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <SuccessFailModal
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
          isError={isError}
        />
      )}
    </div>
  );
};

export default RoleWithPermissionsDetails;
