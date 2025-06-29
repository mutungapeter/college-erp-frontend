"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import FilterSelect from "@/components/common/Select";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { IntakeType } from "@/definitions/admissions";
import { StaffType } from "@/definitions/staff";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetDepartmentsQuery } from "@/store/services/curriculum/departmentsService";
import { useGetStaffListQuery, useToggleStaffStatusMutation } from "@/store/services/staff/staffService";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FiEye } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import CreateStaff from "./onboarding/NewStaff";
import { FaToggleOn, FaToggleOff } from "react-icons/fa6";
import { toast } from "react-toastify";

const Staff = () => {
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
const [toggleStaff, {isLoading:isToggling}] = useToggleStaffStatusMutation()
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
    data: staffData,
    isLoading,
    error,
    refetch,

  } = useGetStaffListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  console.log("staffData", staffData);

  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  console.log("departmentsData", departmentsData);
  const departmentOptions =
    departmentsData?.map((item: IntakeType) => ({
      value: item.id,
      label: `${item.name}`,
    })) || [];

  const handleIntakeChange = (selectedOption: LabelOptionsType | null) => {
    const departmentValue = selectedOption ? selectedOption.value : "";
    handleFilterChange({
      department: departmentValue,
    });
  };

  const columns: Column<StaffType>[] = [
    {
      header: "Name",
      accessor: "user",
      cell: (item: StaffType) => (
        <span>
          {item.user.first_name} {item.user.last_name}
        </span>
      ),
    },
    {
      header: "Staff Number",
      accessor: "staff_number",
      cell: (item: StaffType) => (
        <span className="text-sm font-normal">{item.staff_number}</span>
      ),
    },

    {
      header: "Position",
      accessor: "position",
      cell: (item: StaffType) => (
        <span>
          <span className="text-sm">{item.position.name}</span>
        </span>
      ),
    },

    {
      header: "Status",
      accessor: "status",
      cell: (item: StaffType) => (
        <div className="">
          <span
            className={`
    px-2 py-1 rounded-md font-medium text-xs  ${
      item.status === "Inactive"
        ? "bg-blue-100 text-blue-800"
        : item.status === "Terminated"
        ? "bg-red-100 text-red-800"
        : item.status === "On Probation"
        ? "bg-amber-100 text-amber-800"
        : item.status === "Active"
        ? "bg-green-100 text-green-600"
        : "bg-gray-100 text-gray-800"
    }`}
          >
            {item.status}
          </span>
        </div>
      ),
    },
    {
      header: "Onboarding Status",
      accessor: "onboarding_status",
      cell: (item: StaffType) => {
        const handleClick = () => {
          if (
            item.onboarding_status === "Not Started" ||
            item.onboarding_status === "In Progress" ||
            item.onboarding_status === "Completed"
          ) {
            router.push(`/dashboard/staff/onboarding/${item.onboarding_progress.id}`);
          } 
        };

        return (
          <div
            className="cursor-pointer"
            onClick={handleClick}
            title="Click to proceed"
          >
            <span
              className={`px-2 py-1 rounded-md font-medium text-xs ${
                item.onboarding_status === "Not Started"
                  ? "bg-blue-100 text-blue-800"
                  : item.onboarding_status === "In Progress"
                  ? "bg-amber-100 text-amber-800"
                  : item.onboarding_status === "Completed"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {item.onboarding_status}
            </span>
          </div>
        );
      },
    },

   {
  header: "Actions",
  accessor: "id",
  cell: (item: StaffType) => {
    const handleToggle = async () => {
      try {
        await toggleStaff(item.id).unwrap();
        toast.success(
          `Staff status updated to ${item.status === "Active" ? "Inactive" : "Active"}`
        );
        refetch(); 
      } catch (error) {
         if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        toast.error(errorData.error);
       
      }
      }
    };

    return (
      <div className="flex items-center justify-center space-x-2">
        {(item.status === "Active" || item.onboarding_status === "Completed") && (
          <Link
            href={`/dashboard/staff/${item.id}`}
            className="flex items-center justify-center p-2 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-500 hover:text-white transition duration-200 shadow-sm hover:shadow-md"
            title="View Staff Details"
          >
            <FiEye className="text-sm" />
          </Link>
        )}

       
         <button
          onClick={handleToggle}
          disabled={isToggling}
          title={`Set status to ${item.status === "Active" ? "Inactive" : "Active"}`}
          className="text-3xl p-1 rounded  disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Toggle staff status"
          type="button"
        >
          {item.status === "Active" ? (
            <FaToggleOn className="text-green-600" />
          ) : (
            <FaToggleOff className="text-gray-400" />
          )}
        </button>
      </div>
    );
  },
},

  ];

  console.log("staffData", staffData);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">All Staff</h2>
          <div>
            <CreateStaff 
              refetchData={refetch}
              />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="search"
              onChange={handleFilterChange}
              value={filters.search}
              placeholder="Search by  staff no or phone no"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
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
            Error loading Staff . Please try again later.
          </div>
        ) : staffData && staffData.results.length > 0 ? (
          <DataTable
            data={staffData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {staffData && staffData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={staffData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default Staff;
