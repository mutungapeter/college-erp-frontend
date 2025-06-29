"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import FilterSelect from "@/components/common/Select";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";

import { PAGE_SIZE } from "@/lib/constants";
import { SemesterType } from "@/definitions/curiculum";

import { FeeStructure } from "@/definitions/finance/fees/feeStructure";
import { useGetSemestersQuery } from "@/store/services/curriculum/semestersService";
import { useGetFeeStructuresListQuery } from "@/store/services/finance/finaceServices";
import { formatCurrency } from "@/utils/currency";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  FiEye
} from "react-icons/fi";
import EditFeeStructure from "./EditFeeStructure";
import AddFeeStructure from "./NewFeeStructure";
import AddFeeStructureItem from "./NewFeeStructureItem";

const FeeStructuresList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        semester: searchParams.get("semester") || "",
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
    data: feeSstructreData,
    isLoading,
    error,
    refetch,
  } = useGetFeeStructuresListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log("feeSstructreData", feeSstructreData);

  const { data: semestersData } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  console.log("semestersData", semestersData);
  const semmestersOptions =
    semestersData?.map((item: SemesterType) => ({
      value: item.id,
      label: `${item.name} - ${item.academic_year}`,
    })) || [];

  const handleSemesterChange = (selectedOption: LabelOptionsType | null) => {
    const semesterId = selectedOption ? selectedOption.value : "";
    handleFilterChange({
      semester: semesterId,
    });
  };

  const columns: Column<FeeStructure>[] = [
    {
      header: "Programme",
      accessor: "programme",
      cell: (item: FeeStructure) => <span>{item.programme.name}</span>,
    },
    {
      header: "Year of Study",
      accessor: "year_of_study",
      cell: (item: FeeStructure) => (
        <span className="text-sm font-normal">{item.year_of_study.name}</span>
      ),
    },
    {
      header: "Semester",
      accessor: "semester",
      cell: (item: FeeStructure) => (
        <span>
          <span className="text-sm">
            {item.semester.name}({item.semester.academic_year})
          </span>
        </span>
      ),
    },

    {
      header: "Total",
      accessor: "total",
      cell: (item: FeeStructure) => (
        <span>
          <span className="text-sm font-bold">
            {formatCurrency(item.total)}
          </span>
        </span>
      ),
    },

    {
      header: "Actions",
      accessor: "id",
      cell: (item: FeeStructure) => (
        <div className="flex items-center justify-center space-x-2">
          
          <AddFeeStructureItem refetchData={refetch} data={item} />
          <EditFeeStructure refetchData={refetch} data={item} />
          <Link
            title="View Details"
            className="group relative p-2 bg-indigo-100 text-indigo-500 rounded-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
            href={`/dashboard/finance/fees/fee-structure/${item.id}`}
          >
            <FiEye className="w-4 h-4" />
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              View Details
            </span>
          </Link>

          
        </div>
      ),
    },
  ];

  console.log("feeSstructreData", feeSstructreData);
  return (
    <>
      <div className="bg-white w-full relative  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-4  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">Fee Structures</h2>
        <div>
          <AddFeeStructure refetchData={refetch} />
        </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-end lg:items-center lg:justify-end">
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={semmestersOptions}
              value={
                semmestersOptions.find(
                  (option: LabelOptionsType) =>
                    option.value === filters.semester
                ) || { value: "", label: "All Semesters" }
              }
              onChange={handleSemesterChange}
              placeholder=""
              defaultLabel="All Semesters"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading FeeStructure records . Please try again later.
          </div>
        ) : feeSstructreData && feeSstructreData.results.length > 0 ? (
          <DataTable
            data={feeSstructreData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {feeSstructreData && feeSstructreData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={feeSstructreData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default FeeStructuresList;
