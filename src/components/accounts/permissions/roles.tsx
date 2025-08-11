"use client";

import Pagination from "@/components/common/Pagination";
import { useFilters } from "@/hooks/useFilters";
import { PAGE_SIZE } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import NoData from "@/components/common/NoData";
import { useGetUserRolesQuery } from "@/store/services/permissions/permissionsService";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { RoleType } from "./types";

const Roles = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

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
  console.log("queryParams", queryParams);

  const { data, error, isLoading } = useGetUserRolesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log("data", data);

  const columns: Column<RoleType>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (item: RoleType) => <span>{item.name}</span>,
    },

    {
      header: "Actions",
      accessor: "id",
      cell: (item: RoleType) => {
        return (
          <div className="flex items-center space-x-2">
            <Link
              title="View Details"
              className="group relative px-2 py-2 bg-indigo-100 text-indigo-500 rounded-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
              href={`/dashboard/permissions/roles/details?id=${item.id}`}
            >
              <FiEye className="text-sm" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                View Details
              </span>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div className=" w-full ">
      {/* Header */}
      <div className="mb-8 p-3 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Roles & Permissions
          </h1>
          {/* <p className="text-gray-600">All roles</p> */}
        </div>
        <div className="">
          <Link
            href="/dashboard/permissions/roles/new-role"
            className="bg-green-600 text-white flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
          >
            <GrUserAdmin className="text-sm text-white" />
            <span>Create New Role</span>
          </Link>
        </div>
      </div>

      <div className="w-full  p-1  font-nunito">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading data . Please try again later.
          </div>
        ) : data && data.results.length > 0 ? (
          <DataTable
            data={data?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
            columnBgColor="bg-gray-100 "
            stripedRows={true}
            stripeColor="bg-slate-100"
          />
        ) : (
          <NoData />
        )}

        {data && data.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={data.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Roles;
