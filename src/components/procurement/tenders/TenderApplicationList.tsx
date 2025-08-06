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
  useGetTenderApplicationsQuery
} from "@/store/services/finance/procurementService";
import { YearMonthCustomDate } from "@/utils/date";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { TenderApplicationType } from "./types";

const TendersApplications = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { filters, currentPage, handlePageChange } = useFilters({
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

  const { data, error, isLoading } = useGetTenderApplicationsQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  console.log("data", data);

  const columns: Column<TenderApplicationType>[] = [
    {
      header: "Tender",
      accessor: "tender",
      cell: (item: TenderApplicationType) => <span>{item.tender.title}</span>,
    },
    {
      header: "Company",
      accessor: "company_name",
      cell: (item: TenderApplicationType) => (
        <span className="text-sm whitespace-normal break-words">
          {item.company_name}
        </span>
      ),
    },

    {
      header: "Business Type",
      accessor: "business_type",
      cell: (item: TenderApplicationType) => (
        <span className="text-sm whitespace-normal break-words">
          {item.business_type}
        </span>
      ),
    },
    {
      header: "Submitted On",
      accessor: "created_on",
      cell: (item: TenderApplicationType) => (
        <span className="text-sm whitespace-normal break-words">
          {YearMonthCustomDate(item.created_on)}
        </span>
      ),
    },
    {
      header: "Reviewed On",
      accessor: "reviewed_on",
      cell: (item: TenderApplicationType) => (
        <span className="text-sm whitespace-normal break-words">
          {YearMonthCustomDate(item?.reviewed_on ?? "")}
        </span>
      ),
    },

    {
      header: "Status",
      accessor: "status",
      cell: (item: TenderApplicationType) => (
        <span
          className={`text-sm px-2 py-1 rounded-md border ${
            item.status === "approved"
              ? "bg-green-100 text-green-500 border-green-500"
              : item.status === "rejected"
              ? "bg-red-100 text-red-500 border-red-500"
              : item.status === "pending"
              ? "bg-yellow-100 text-yellow-500 border-yellow-500"
              : "bg-gray-100 text-gray-500 border-gray-500"
          }`}
        >
          {item.status}
        </span>
      ),
    },

    {
      header: "Actions",
      accessor: "id",
      cell: (item: TenderApplicationType) => {
      
        return (
          <div className="flex items-center justify-center space-x-2">
            <Link
              title="View Details"
              className="group relative px-2 py-2 bg-indigo-100 text-indigo-500 rounded-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
              href={`/dashboard/procurement/tenders/applications/details?id=${item.id}`}
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
      <div className="mb-8 md:p-4 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tender Applications
          </h1>
          <p className="text-gray-600">All tender applications</p>
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

export default TendersApplications;
