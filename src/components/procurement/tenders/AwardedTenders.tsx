"use client";

import Pagination from "@/components/common/Pagination";
import { useFilters } from "@/hooks/useFilters";
import { PAGE_SIZE } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import NoData from "@/components/common/NoData";
import {
  useGetAwardedTendersQuery
} from "@/store/services/finance/procurementService";
import { formatCurrency } from "@/utils/currency";
import PayVendor from "./Payments/PayVendor";
import { AwardedTenderType } from "./types";

const AwardedTenders = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { filters, currentPage, handlePageChange } =
    useFilters({
      initialFilters: {
        reference: searchParams.get("reference") || "",
        account: searchParams.get("account") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["reference"],
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

  const { data, error, isLoading, refetch } = useGetAwardedTendersQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log("data", data);

 


 
  
  const columns: Column<AwardedTenderType>[] = [
    {
      header: "Tender",
      accessor: "tender",
      cell: (item: AwardedTenderType) => <span>{item.tender.title}</span>,
    },
    {
      header: "Vendor",
      accessor: "vendor",
      cell: (item: AwardedTenderType) => (
        <span className="text-sm whitespace-normal break-words">
          {item.vendor.name}
        </span>
      ),
    },
    {
      header: "Tender Cost",
      accessor: "award_amount",
      cell: (item: AwardedTenderType) => (
        <span>{formatCurrency(item.award_amount)}</span>
      ),
    },

    {
      header: "Amount Paid",
      accessor: "amount_paid",
      cell: (item: AwardedTenderType) => (
        <span>{formatCurrency(item.amount_paid)}</span>
      ),
    },
    {
      header: "Balance Due",
      accessor: "balance_due",
      cell: (item: AwardedTenderType) => (
        <span>{formatCurrency(item.balance_due)}</span>
      ),
    },
   
    {
      header: "Tender Status",
      accessor: "status",
      cell: (item: AwardedTenderType) => (
        <span
          className={`text-sm px-2 py-1 rounded-md border ${
            item?.status === "active"
              ? "bg-green-100 text-green-500 border-green-500"
              : item?.status === "completed"
              ? "bg-blue-100 text-blue-500 border-blue-500"
              : item?.status === "revoked"
              ? "bg-red-100 text-red-500 border-red-500"
              : item?.status === "terminated"
              ? "bg-yellow-100 text-yellow-500 border-yellow-500"
              : "bg-gray-100 text-gray-500 border-gray-500"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: "Payment Status",
      accessor: "payment_status",
      cell: (item: AwardedTenderType) => (
        <span
          className={`text-sm px-2 py-1 rounded-md border ${
            item?.payment_status === "Fully Paid"
              ? "bg-green-100 text-green-500 border-green-500"
              : item?.payment_status === "completed"
              ? "bg-blue-100 text-blue-500 border-blue-500"
              : item?.payment_status === "Unpaid"
              ? "bg-red-100 text-red-500 border-red-500"
              : item?.payment_status === "Partially Paid"
              ? "bg-yellow-100 text-yellow-500 border-yellow-500"
              : "bg-gray-100 text-gray-500 border-gray-500"
          }`}
        >
          {item.payment_status}
        </span>
      ),
    },
    
   
  ];
  return (
    <div className=" w-full ">
      {/* Header */}
      <div className="mb-8 md:p-4 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Awarded Tenders</h1>
          {/* <p className="text-gray-600">All awarded  Tenders</p> */}
        </div>
        <div className="flex justify-between items-center gap-3 md:gap-5">
          <PayVendor refetchData={refetch} />
        </div>
      </div>
      {/* <div className="flex items-center md:justify-end lg:justify-end px-5">
        <div className="  w-full md:w-auto md:min-w-[40%]  ">
          <FilterSelect
            options={accountsOptions}
            value={
              accountsOptions.find(
                (option: LabelOptionsType) => option.value === filters.account
              ) || { value: "", label: "All Accounts" }
            }
            onChange={handleCohortChange}
            placeholder=""
            defaultLabel="All Accounts"
          />
        </div>
      </div> */}

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

export default AwardedTenders;
