"use client";

import Pagination from "@/components/common/Pagination";
import FilterSelect from "@/components/common/Select";
import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { IntakeType } from "@/definitions/admissions";
import { useFilters } from "@/hooks/useFilters";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetIntakesQuery } from "@/store/services/admissions/admissionsService";
import { CustomDate } from "@/utils/date";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import AddIntake from "./NewIntake";
import EditIntake from "./EditIntake";

export type StatusOption = {
  value: string;
  label: string;
};

export const StatusOptions: StatusOption[] = [
  { label: "All", value: "" },
  { label: "Open", value: "false" },
  { label: "Closed", value: "true" },
];

const Intakes = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
 
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        closed: searchParams.get("closed") ?? "",
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

  const { data, isLoading, error, refetch } = useGetIntakesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

   const handleStatusChange = (selectedOption: StatusOption | null) => {
    handleFilterChange({ closed: selectedOption?.value ?? "" });
  };

  const columns: Column<IntakeType>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (item: IntakeType) => <span>{item.name}</span>,
    },
    {
      header: "Start Date",
      accessor: "start_date",
      cell: (item: IntakeType) => (
        <span className="text-sm font-normal">
          {CustomDate(item.start_date)}
        </span>
      ),
    },
    {
      header: "End Date",
      accessor: "end_date",
      cell: (item: IntakeType) => (
        <span className="text-sm">{CustomDate(item.end_date)}</span>
      ),
    },
    {
      header: "Status",
      accessor: "closed",
      cell: (item: IntakeType) => (
        <div className="flex items-center justify-center">
          <span
            className={`px-2 py-1 rounded-md font-normal text-xs ${
              item.closed === true
                ? "bg-red-100 text-red-600"
                : item.closed === false
                ? "bg-emerald-100 text-emerald-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {item.closed === true
              ? "Closed"
              : item.closed === false
              ? "Open"
              : "Unknown"}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (item: IntakeType) => (
        <div className="flex items-center justify-center space-x-2">
          <EditIntake data={item} refetchData={refetch} />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white w-full p-1 shadow-md rounded-lg font-nunito">
        <div className="p-3 flex flex-col md:flex-row md:items-center gap-4 lg:justify-between">
          <h2 className="font-semibold text-black text-xl">All Intakes</h2>
          <AddIntake refetchData={refetch} />
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:flex-row md:items-center p-2 justify-end">
         

          <div className="flex flex-col gap-3 lg:flex-row md:flex-row md:items-center md:space-x-2">
            <FilterSelect
              options={StatusOptions}
              value={
                StatusOptions.find(
                  (option: StatusOption) =>
                    option.value === String(filters.closed)
                ) || { value: "", label: "All" }
              }
              onChange={handleStatusChange}
              defaultLabel="Filter by Status"
              placeholder=""
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading Intakes. Please try again later.
          </div>
        ) : data && data.results.length > 0 ? (
          <DataTable
            data={data.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
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
    </>
  );
};

export default Intakes;
