"use client";

import Pagination from "@/components/common/Pagination";
import { useFilters } from "@/hooks/useFilters";
import { PAGE_SIZE } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import NoData from "@/components/common/NoData";
import { useDeleteRoleMutation, useGetUserRolesQuery } from "@/store/services/permissions/permissionsService";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { RoleType } from "./types";
import { useAppSelector } from "@/store/hooks";
import { RolePermission } from "@/store/definitions";
import { RootState } from "@/store/store";
import { LuArchiveX } from "react-icons/lu";
import { toast } from "react-toastify";
import ActionModal from "@/components/common/Modals/ActionModal";
import { CustomDate } from "@/utils/date";

const Roles = () => {
  const searchParams = useSearchParams();

  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const permissions: RolePermission[] = useMemo(() => {
    return user?.role?.permissions ?? [];
  }, [user?.role?.permissions]);
console.log("permissions", permissions)
  const { filters, currentPage, handlePageChange } = useFilters({
    initialFilters: {},
    initialPage: parseInt(searchParams.get("page") || "1", 10),
    router,
    debounceTime: 100,
    debouncedFields: [""],
  });
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );
  const accountsPermissions = useMemo(() => {
    return permissions.find(
      (permission) => permission.module.code === "settings_settings"
    );
  }, [permissions]);

  // Permission checks
  const canCreate = accountsPermissions?.can_create ?? false;
  const canEdit = accountsPermissions?.can_edit ?? false;
  const canDelete = accountsPermissions?.can_delete ?? false;
  const hasActions = canEdit || canDelete;
  const {
    isLoading: loadingData,
    data: rolesData,
    refetch,
    error,
  } = useGetUserRolesQuery(queryParams, { refetchOnMountOrArgChange: true });
  const [deleteRole, { isLoading: deleting }] = useDeleteRoleMutation();
  const openDeleteModal = (id: number) => {
    setSelectedRole(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };
console.log("rolesData", rolesData)
  const handleDeleteProgram = async () => {
    try {
      await deleteRole(selectedRole).unwrap();
      toast.success("Role Deleted successfully!");
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      // console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        // console.log("errorData", errorData);
        toast.error(errorData.error || "Error Deleting Role!.");
      } else {
        toast.error("Unexpected Error occured. Please try again.");
      }
    }
  };
  const columns: Column<RoleType>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (item: RoleType) => <span>{item.name}</span>,
    },

    {
      header: "Description",
      accessor: "description",
      cell: (item: RoleType) => (
        <span>
          <span className="text-xs font-medium"> {item.description}</span>
        </span>
      ),
    },
    
    {
      header: "Date Created",
      accessor: "created_on",
      cell: (item: RoleType) => (
        <span>
          <span className="text-xs font-medium">
            {" "}
            {CustomDate(item.created_on)}
          </span>
        </span>
      ),
    },

    ...(hasActions
      ? ([
          {
            header: "Actions",
            accessor: "id",
            cell: (item: RoleType) => (
              <div className="flex items-center space-x-2">
                {canEdit && (
                  <Link
                    title="View Details"
                    className="group relative px-2 py-2 bg-indigo-100 text-indigo-500 rounded-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
                    href={`/dashboard/permissions/${item.id}`}
                  >
                    <FiEye className="text-sm" />
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      View Details
                    </span>
                  </Link>
                )}
                {canEdit && (
                  <div>
                    {/* <EditRole refetchData={refetch} data={item} /> */}
                  </div>
                )}
                {canDelete && (
                  <div
                    onClick={() => openDeleteModal(item.id)}
                    className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer transition duration-200 shadow-sm"
                    title="Delete"
                  >
                    <LuArchiveX className="text-sm" />
                  </div>
                )}
              </div>
            ),
          },
        ] as Column<RoleType>[])
      : []),
  ];
  // console.log("rolesData", rolesData);
  return (
    <>
      <div className="bg-white w-full   shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black lg:text-xl md:text-lg text-sm ">
            Roles
          </h2>
          {canCreate && (
            <div>
              {/* <CreateRole refetchData={refetch} /> */}
            </div>
          )}
        </div>

        {loadingData ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            {"status" in error &&
            typeof error.data === "object" &&
            error.data !== null &&
            "error" in error.data
              ? (error.data as { error: string }).error
              : "An error occurred while fetching classes."}
          </div>
        ) : rolesData && rolesData.results.length > 0 ? (
          <>
            <DataTable
              data={rolesData?.results}
              columns={columns}
              isLoading={loadingData}
              error={error}
              // columnBgColor="bg-gray-100 "
              stripedRows={true}
              stripeColor="bg-slate-100"
            />
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {rolesData && rolesData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={rolesData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleDeleteProgram}
          isDeleting={deleting}
          confirmationMessage="Are you sure you want to Delete this Role ?"
          deleteMessage="Staff who had the Deleted Role won't be able to access the system anymore unless you assign a new role to them.This action cannot be undone."
          title="Delete Role"
          actionText="Delete"
        />
      </div>
    </>
  );
};

export default Roles;
