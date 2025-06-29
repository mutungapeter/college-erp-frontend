"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import FilterSelect from "@/components/common/Select";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { IntakeType } from "@/definitions/admissions";
import { PayrollType } from "@/definitions/payroll";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetDepartmentsQuery } from "@/store/services/curriculum/departmentsService";
import { useGetPayrollsQuery } from "@/store/services/staff/staffService";
import { formatCurrency } from "@/utils/currency";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { GoSearch } from "react-icons/go";
import UpdateStaffPayroll from "./EditPayroll";
import PayrollDetailsModal from "./PayrollDetails";

const PayRoll = () => {
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
    data: payrollsData,
    isLoading,
    error,
    refetch
  } = useGetPayrollsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  console.log("payrollsData", payrollsData);

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

  const columns: Column<PayrollType>[] = [
    {
      header: "Name",
      accessor: "staff",
      cell: (item: PayrollType) => (
        <span>
          {item.staff.user.first_name} {item.staff.user.last_name}({item.staff.staff_number})
        </span>
      ),
    },
   

    
   
    {
      header: "Bank A/C",
      accessor: "bank_account_number",
      cell: (item: PayrollType) => (
        <span>
          <span className="text-sm">{item.bank_account_number}</span>
        </span>
      ),
    },
    
    {
      header: "Mpesa No",
      accessor: "mpesa_number",
      cell: (item: PayrollType) => (
        <span>
          <span className="text-sm">{item.mpesa_number}</span>
        </span>
      ),
    },
    {
      header: "B.S",
      accessor: "basic_salary",
      cell: (item: PayrollType) => (
        <span>
          <span className="text-sm">{formatCurrency(item.basic_salary)}</span>
        </span>
      ),
    },
    {
      header: "House A/W",
      accessor: "house_allowance",
      cell: (item: PayrollType) => (
        <span>
          <span className="text-sm">{formatCurrency(item.house_allowance)}</span>
        </span>
      ),
    },
    {
      header: "Transport A/W",
      accessor: "transport_allowance",
      cell: (item: PayrollType) => (
        <span>
          <span className="text-sm">{formatCurrency(item.transport_allowance)}</span>
        </span>
      ),
    },
    {
      header: "Other A/W",
      accessor: "other_allowances",
      cell: (item: PayrollType) => (
        <span>
          <span className="text-sm">{formatCurrency(item.other_allowances)}</span>
        </span>
      ),
    },
   

    {
      header: "Status",
      accessor: "staff",
      cell: (item: PayrollType) => (
        <div className="">
          <span
            className={`
    px-2 py-1 rounded-md font-medium text-xs  ${
      item.staff.status === "Inactive"
        ? "bg-blue-100 text-blue-800"
        : item.staff.status === "Terminated"
        ? "bg-red-100 text-red-800"
        : item.staff.status === "On Probation"
        ? "bg-amber-100 text-amber-800"
        : item.staff.status === "Active"
        ? "bg-green-100 text-green-600"
        : "bg-gray-100 text-gray-800"
    }`}
          >
            {item.staff.status}
          </span>
        </div>
      ),
    },
    

    {
      header: "Actions",
      accessor: "id",
      cell: (item: PayrollType) => (
        <div className="flex items-center justify-center space-x-2">
          {item.staff.status === "Active" && (
            <>
            <PayrollDetailsModal data={item} />
            
            </>
          )}
          <UpdateStaffPayroll refetchData={refetch} data={item} />
        </div>
      ),
    },
  ];

  console.log("payrollsData", payrollsData);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">Payroll List</h2>
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
            Error loading payroll . Please try again later.
          </div>
        ) : payrollsData && payrollsData.results.length > 0 ? (
          <DataTable
            data={payrollsData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {payrollsData && payrollsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={payrollsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default PayRoll;
