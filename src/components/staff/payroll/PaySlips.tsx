"use client";

import Pagination from "@/components/common/Pagination";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { useFilters } from "@/hooks/useFilters";


import FilterSelect from "@/components/common/Select";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { IntakeType } from "@/definitions/admissions";
import { PaySlipType } from "@/definitions/payroll";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetDepartmentsQuery } from "@/store/services/curriculum/departmentsService";
import { useGetPaySlipsQuery } from "@/store/services/staff/staffService";
import { formatCurrency } from "@/utils/currency";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { GoSearch } from "react-icons/go";
import { PaySlipDownloadButton } from "./PaySlipPdf";
import GeneratePaySlips from "./ProcessPaySlips";
import PayslipDetailsModal from "./PaySlipDetails";
import PayWages from "./PayWages";


const AllPaySlips = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        search: searchParams.get("search") || "",
        period_start: searchParams.get("period_start") || "",
        period_end: searchParams.get("period_end") || "",
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
    data: paySlips,
    isLoading,
    error,
    refetch
  } = useGetPaySlipsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  console.log("paySlips", paySlips);

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

  const columns: Column<PaySlipType>[] = [
    {
      header: "Name",
      accessor: "staff",
      cell: (item: PaySlipType) => (
        <span>
          {item.staff.user.first_name} {item.staff.user.last_name}({item.staff.staff_number})
        </span>
      ),
    },
   

    
   
    {
  header: "Month Ending",
  accessor: "payroll_period_end",
  cell: (item: PaySlipType) => (
    <span className="text-sm">
       {item.payroll_period_end}
    </span>
  ),
},
    {
      header: "B.S",
      accessor: "basic_salary",
      cell: (item: PaySlipType) => (
        <span>
          <span className="text-xs font-bold">{formatCurrency(item.basic_salary)}</span>
        </span>
      ),
    },
    {
      header: "Total A/W",
      accessor: "total_allowances",
      cell: (item: PaySlipType) => (
        <span>
          <span className="text-xs font-bold">{formatCurrency(item.total_allowances)}</span>
        </span>
      ),
    },
   
    {
      header: "Total Overtime",
      accessor: "total_overtime",
      cell: (item: PaySlipType) => (
        <span>
          <span className="text-xs font-bold">{formatCurrency(item.total_overtime)}</span>
        </span>
      ),
    },
    // {
    //   header: "Total Deductions",
    //   accessor: "total_deductions",
    //   cell: (item: PaySlipType) => (
    //     <span>
    //       <span className="text-xs font-bold">{formatCurrency(item.total_deductions)}</span>
    //     </span>
    //   ),
    // },
    {
      header: "Net Pay",
      accessor: "net_pay",
      cell: (item: PaySlipType) => (
        <span>
          <span className="text-xs font-bold">{formatCurrency(item.net_pay)}</span>
        </span>
      ),
    },
    {
      header: "Balance",
      accessor: "outstanding_balance",
      cell: (item: PaySlipType) => (
        <span>
          <span className="text-xs font-bold">{formatCurrency(item.outstanding_balance)}</span>
        </span>
      ),
    },
    {
      header: "Payment Status",
      accessor: "payment_status",
      cell: (item: PaySlipType) => (
        // <div>
         <span
  className={`
    text-[12px] justify-center flex px-2 whitespace-normal break-words py-1 rounded-md text-center
    ${item.payment_status === "paid"
      ? "text-green-500 bg-green-100"
      : item.payment_status === "pending"
      ? "text-yellow-500 bg-yellow-100"
      : item.payment_status === "failed"
      ? "text-red-500 bg-red-100"
      : item.payment_status === "processing"
      ? "text-orange-500 bg-orange-100"
      : item.payment_status === "reversed"
      ? "bg-indigo-500 text-white"
      : "text-white bg-gray-500"}
  `}
>
  {item.payment_status_label}
</span>

        // </div>
      ),
    },
   
    {
      header: "Actions",
      accessor: "id",
      cell: (item: PaySlipType) => (
        <div className="flex items-center justify-center space-x-2">
      <PayslipDetailsModal data={item} />
        {(item.payment_status === "pending" || item.payment_status === "partially_paid") && (
          <PayWages data={item} refetchData={refetch} />
        )}
      <PaySlipDownloadButton 
        payslip={item} 
        variant="button"
      />
        </div>
      ),
    },
  ];

  console.log("paySlips", paySlips);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">PaySlips</h2>
          <div>
       <GeneratePaySlips  refetchData={refetch} />

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
          <div className="flex md:flex-row flex-col gap-2 md:items-center">
            <input
              type="date"
              name="period_start"
              onChange={handleFilterChange}
              value={filters.period_start}
              placeholder="From"
              className="px-2 py-2 border cursor-pointer border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
            />
            <input
              type="date"
              name="period_end"
              onChange={handleFilterChange}
              part="To"
              value={filters.period_end}
              className="px-2 py-2 border cursor-pointer border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
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
        ) : paySlips && paySlips.results.length > 0 ? (
          <DataTable
            data={paySlips?.results}
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

        {paySlips && paySlips.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={paySlips.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
        {/* {showPDF && selectedPayslip &&  (
  <PaySlipPDFViewer
    payslip={selectedPayslip}
    onClose={() => {
      setShowPDF(false);
      setSelectedPayslip(null);
    }}
  />
)} */}

      </div>
    </>
  );
};

export default AllPaySlips;
