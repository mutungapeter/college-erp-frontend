"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import FilterSelect from "@/components/common/Select";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { DepartmentType } from "@/definitions/curiculum";
import { EntitlementType } from "@/definitions/leaves";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetDepartmentsQuery } from "@/store/services/curriculum/departmentsService";
import {
  useGetLeaveEntitlementsQuery
} from "@/store/services/staff/leaveService";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { GoSearch } from "react-icons/go";
import EditLeaveEntitlement from "./EditEntitlement";
import CreateBulkLeaveEntitlements from "./NewLeaveEntitlement";

const LeaveEntitlements = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        search: searchParams.get("search") || "",
        department: searchParams.get("department") || "",
        status: searchParams.get("status") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["search"],
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

  const {
    data: entitlementsData,
    isLoading,
    error,
    refetch,
  } = useGetLeaveEntitlementsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  console.log("entitlementsData", entitlementsData);

  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  console.log("departmentsData", departmentsData);
  const departmentOptions =
    departmentsData?.map((item: DepartmentType) => ({
      value: item.id,
      label: `${item.name}`,
    })) || [];

  const handleIntakeChange = (selectedOption: LabelOptionsType | null) => {
    const departmentValue = selectedOption ? selectedOption.value : "";
    handleFilterChange({
      department: departmentValue,
    });
  };

  const columns: Column<EntitlementType>[] = [
    {
      header: "Year",
      accessor: "year",
      cell: (item: EntitlementType) => (
        <span>
          {item.year}
        </span>
      ),
    },
    {
      header: "Name",
      accessor: "staff",
      cell: (item: EntitlementType) => (
        <span>
          {item.staff.user.first_name} {item.staff.user.last_name}
        </span>
      ),
    },
    {
      header: "Staff No",
      accessor: "staff",
      cell: (item: EntitlementType) => <span>{item.staff.staff_number}</span>,
    },

    {
      header: "Department",
      accessor: "staff",
      cell: (item: EntitlementType) => (
        <span className="text-sm whitespace-normal break-words">
          {item.staff.department.name}
        </span>
      ),
    },
    {
      header: "Entitlement P.a",
      accessor: "total_days",
      cell: (item: EntitlementType) => (
        <span>
          <span className="text-sm">{item.total_days} days</span>
        </span>
      ),
    },
    {
      header: "Used",
      accessor: "used_days",
      cell: (item: EntitlementType) => (
        <span>
          <span className="text-sm">{item.used_days} days</span>
        </span>
      ),
    },
    {
      header: "Remaining",
      accessor: "remaining_days",
      cell: (item: EntitlementType) => (
        <span>
          <span className="text-sm">{item.remaining_days} days</span>
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (item: EntitlementType) => (
        <div>
          <EditLeaveEntitlement refetchData={refetch} data={item} />
        </div>
      ),
    },
  ];

  console.log("entitlementsData", entitlementsData);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">
            Leave Entitlements/Policies
          </h2>
          <div>
            <CreateBulkLeaveEntitlements
              refetchData={refetch}
              buttonText="Add Staff Leave Entitlements"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row space-x-4  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="search"
              onChange={handleFilterChange}
              value={filters.search}
              placeholder="Search by  staff no or phone no"
              className="w-full md:w-auto  text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>

          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={departmentOptions}
              value={
                departmentOptions.find(
                  (option: LabelOptionsType) =>
                    option.value === filters.department
                ) || { value: "", label: "All Departments" }
              }
              onChange={handleIntakeChange}
              placeholder=""
              defaultLabel="All Departments"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading leaves . Please try again later.
          </div>
        ) : entitlementsData && entitlementsData.results.length > 0 ? (
          <DataTable
            data={entitlementsData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
            columnBgColor="bg-gray-100 "
            stripedRows={true}
            stripeColor="bg-slate-100"
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {entitlementsData && entitlementsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={entitlementsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default LeaveEntitlements;
