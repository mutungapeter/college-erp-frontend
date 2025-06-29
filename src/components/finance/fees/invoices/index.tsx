"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import FilterSelect from "@/components/common/Select";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { IntakeType } from "@/definitions/admissions";

import { PAGE_SIZE } from "@/lib/constants";
import { useGetDepartmentsQuery } from "@/store/services/curriculum/departmentsService";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FiSend } from "react-icons/fi";
import { GoSearch } from "react-icons/go";


import { ProgrammeCohortType } from "@/definitions/curiculum";
import { InvoiceType } from "@/definitions/finance/fees/invoices";
import { useGetCohortsQuery } from "@/store/services/curriculum/cohortsService";
import { useGetFeesInvoicesQuery } from "@/store/services/finance/feesService";
import { formatCurrency } from "@/utils/currency";
import { YearMonthCustomDate } from "@/utils/date";
import PayFees from "../payments/pay";

const FeesInvoicesList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        search: searchParams.get("search") || "",
        department: searchParams.get("department") || "",
        cohort: searchParams.get("cohort") || "",
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
    data: invoicesData,
    isLoading,
    error,
    refetch,
  } = useGetFeesInvoicesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  console.log("invoicesData", invoicesData);

  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: cohortsData } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  console.log("departmentsData", departmentsData);
  const departmentOptions =
    departmentsData?.map((item: IntakeType) => ({
      value: item.id,
      label: `${item.name}`,
    })) || [];
  const cohorthOptions =
    cohortsData?.map((item: ProgrammeCohortType) => ({
      value: item.id,
      label: `${item.name}-${item.current_year}`,
    })) || [];

  const handleDepartmentChange = (selectedOption: LabelOptionsType | null) => {
    const departmentValue = selectedOption ? selectedOption.value : "";
    handleFilterChange({
      department: departmentValue,
    });
  };
  const handleCohortChange = (selectedOption: LabelOptionsType | null) => {
    const cohortValue = selectedOption ? selectedOption.value : "";
    handleFilterChange({
      cohort: cohortValue,
    });
  };

  const columns: Column<InvoiceType>[] = [
    {
      header: "Name",
      accessor: "student_name",
      cell: (item: InvoiceType) => <span>{item.student_name}</span>,
    },
   

    {
      header: "Semester",
      accessor: "semester",
      cell: (item: InvoiceType) => (
        <span>
          <span className="text-sm">{item.semester.name}</span>
        </span>
      ),
    },
    {
      header: "Academic Year",
      accessor: "semester",
      cell: (item: InvoiceType) => (
        <span>
          <span className="text-sm">{item.semester.academic_year}</span>
        </span>
      ),
    },
    {
      header: "Invoice Date",
      accessor: "created_on",
      cell: (item: InvoiceType) => (
        <span>
          <span className="text-sm">
            {YearMonthCustomDate(item.created_on)}
          </span>
        </span>
      ),
    },
    {
      header: "Invoice Amount",
      accessor: "amount",
      cell: (item: InvoiceType) => (
        <span>
          <span className="text-sm">{formatCurrency(item.amount)}</span>
        </span>
      ),
    },
    {
      header: "Amount Paid",
      accessor: "amount_paid",
      cell: (item: InvoiceType) => (
        <span>
          <span className="text-sm">{formatCurrency(item.amount_paid)}</span>
        </span>
      ),
    },

    {
      header: "Status",
      accessor: "status",
      cell: (item: InvoiceType) => (
        <span>
          <span
            className={`text-sm font-normal px-2 py-1 rounded-md inline-flex items-center justify-center
          ${
            item.status === "Pending"
              ? "text-red-500 bg-red-100"
              : item.status === "Paid"
              ? "text-green-500 bg-green-100"
              : item.status === "Partially Paid"
              ? "text-yellow-500 bg-yellow-100"
              : ""
          } 
         
          } 
            `}
          >
            {item.status}
          </span>
        </span>
      ),
    },

    {
      header: "Actions",
      accessor: "id",
      cell: (item: InvoiceType) => {
        // const sendReminder = async () => {
        //   try {

        //   } catch (error) {
        //      if (error && typeof error === "object" && "data" in error && error.data) {
        //     const errorData = (error as { data: { error: string } }).data;
        //     toast.error(errorData.error);

        //   }
        //   }
        // };

        return (
          <div className="flex items-center justify-center space-x-2 relative">
            
              {(item.status === "Pending" ||
              item.status === "Partially Paid") && (
                <div>
              <PayFees refetchData={refetch} data={item} />
            </div>
              )}
            {(item.status === "Pending" ||
              item.status === "Partially Paid") && (
              <div className="relative flex items-center justify-center space-x-2  group">
                
                <div
                  // onClick={sendReminder}
                  className="flex items-center justify-center cursor-pointer p-2 
      rounded-md bg-white text-indigo-600 hover:bg-indigo-500 hover:text-white border
       border-indigo-500 transition duration-200 shadow-sm hover:shadow-md"
                >
                  <FiSend className="text-sm" />
                </div>

                <div
                  className="absolute bottom-full  transform
     -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md 
     opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
      whitespace-nowrap z-[9999]"
                >
                  Send Reminder
                  <div
                    className="absolute top-full  transform -translate-x-1/2 w-0 h-0 border-l-4 
      border-r-4 border-t-4 border-transparent border-t-gray-800"
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  console.log("invoicesData", invoicesData);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-4  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">
            Fees Invoice Records
          </h2>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[50%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="search"
              onChange={handleFilterChange}
              value={filters.search}
              placeholder="Search by  reg no or phone no"
              className="w-full md:w-auto text-gray-900 md:min-w-[50%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
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
              onChange={handleDepartmentChange}
              placeholder=""
              defaultLabel="All Departments"
            />
            <FilterSelect
              options={cohorthOptions}
              value={
                cohorthOptions.find(
                  (option: LabelOptionsType) => option.value === filters.cohort
                ) || { value: "", label: "All Cohorts/Classes" }
              }
              onChange={handleCohortChange}
              placeholder=""
              defaultLabel="All Cohorts/Classes"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading reporting records . Please try again later.
          </div>
        ) : invoicesData && invoicesData.results.length > 0 ? (
          <DataTable
            data={invoicesData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {invoicesData && invoicesData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={invoicesData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default FeesInvoicesList;
