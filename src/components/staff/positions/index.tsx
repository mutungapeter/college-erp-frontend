"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import { Position } from "@/definitions/staff";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetPositionsQuery } from "@/store/services/staff/staffService";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import EditPosition from "./Edit";
import CreatePosition from "./New";

const Positions = () => {
  const router = useRouter();
    const searchParams = useSearchParams();
  
    const { filters, currentPage, handlePageChange } =
      useFilters({
       initialFilters:{},
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
  const {
    data: positionsData,
    isLoading,
    error,
    refetch,

  } = useGetPositionsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  console.log("positionsData", positionsData);

 

  const columns: Column<Position>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (item: Position) => (
        <span>
          {item.name} 
        </span>
      ),
    },
   

   {
  header: "Actions",
  accessor: "id",
  cell: (item: Position) => {
   

    return (
      <div className="flex items-center space-x-2">
       
       <EditPosition data={item} refetchData={refetch} />
      </div>
    );
  },
},

  ];

  console.log("positionsData", positionsData);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">All Positions</h2>
          <div>
            <CreatePosition 
              refetchData={refetch}
              />
          </div>
        </div>

        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading data . Please try again later.
          </div>
        ) : positionsData && positionsData.results.length > 0 ? (
          <DataTable
            data={positionsData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {positionsData && positionsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={positionsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default Positions;
