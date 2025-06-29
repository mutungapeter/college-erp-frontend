"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import { Feeitem } from "@/definitions/finance/fees/feeStructure";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetFeeStructureItemsQuery } from "@/store/services/finance/finaceServices";
import { formatCurrency } from "@/utils/currency";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import EditFeeStructureItem from "./EditFeeStructureItem";
import AddFeeStructureItem from "./NewFeeStructureItem";
import { IoArrowBackOutline } from "react-icons/io5";
import Link from "next/link";
interface Props {
  structure_id: string;
}

const FeeStructureItems = ({ structure_id }: Props) => {
  const { data, isLoading, error, refetch } = useGetFeeStructureItemsQuery({
    fee_structure_id: structure_id,
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handlePageChange } = useFilters({
    initialFilters: {
      semester: searchParams.get("semester") || "",
    },
    initialPage: parseInt(searchParams.get("page") || "1", 10),
    router,
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
  console.log("data", data);

  const columns: Column<Feeitem>[] = [
    {
      header: "Description",
      accessor: "description",
      cell: (item: Feeitem) => <span>{item.description}</span>,
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (item: Feeitem) => (
        <span className="text-sm font-normal">
          {formatCurrency(item.amount)}
        </span>
      ),
    },

    {
      header: "Actions",
      accessor: "id",
      cell: (item: Feeitem) => (
        <div className="flex items-center  space-x-2">
          <EditFeeStructureItem data={item} refetchData={refetch} />
        </div>
      ),
    },
  ];

  return (
    <>
    <Link 
    href={"/dashboard/finance/fees/fee-structure"}
    className="flex items-center space-x-2 hover:text-blue-500 mb-3 p-3 text-gray-600"
    >
    <IoArrowBackOutline size={18}/>
    <span>Back to Fee Structures</span>
    </Link>
      <div
        className="bg-white w-full relative font-nunito
       p-1 shadow-md rounded-lg "
      >
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-col   gap-3 sm:gap-8">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Programme
                    </span>
                    <span className="text-sm sm:text-lg font-bold text-gray-900 break-words">
                      {data?.fee_structure.programme.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Code
                    </span>
                    <span className="text-sm sm:text-base font-bold text-gray-800 font-mono bg-white px-2 sm:px-3 py-1 rounded-md border border-gray-200 shadow-sm">
                      {data?.fee_structure.programme.code}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-auto sm:self-end">
                <div className="w-full sm:w-auto">
                  <AddFeeStructureItem
                    data={data?.fee_structure}
                    refetchData={refetch}
                    buttonText="Add Fee Structure Item"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-7 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Fee Structure Items
              </h3>
            </div>
            {data && data.count > 0 && (
              <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                {data.count} {data.count === 1 ? "item" : "items"}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading FeeStructure components . Please try again later.
          </div>
        ) : data && data.results.length > 0 ? (
          <DataTable
            data={data?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}
        <div className="py-5 border-blue-500 bg-blue-100 px-4 border-t-2  pt-4 flex items-center mt-6 justify-between">
          <h2>Total</h2>
          <h2 className="text-xl font-bold">
            {formatCurrency(data?.total_amount)}
          </h2>
        </div>
        {data && data.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={data.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};
export default FeeStructureItems;
