"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import FilterSelect from "@/components/common/Select";
import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { ProgrammeType } from "@/definitions/curiculum";
import { StudentType } from "@/definitions/students";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetProgrammesQuery } from "@/store/services/curriculum/programmesService";
import { useGetStudentsQuery } from "@/store/services/students/studentsService";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FiEye } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import AdmitStudent from "./NewStudent";
import StudentUploadButton from "./UploadStudents";

export type DepartmentOption = {
  value: string;
  label: string;
};

const Students = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        reg_no: searchParams.get("reg_no") || "",
        department: searchParams.get("department") || "",
        programme: searchParams.get("programme") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["reg_no"],
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
    data: studentsData,
    isLoading,
    error,
    refetch,
  } = useGetStudentsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log("studentsData", studentsData);
  const { data: programmes } = useGetProgrammesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  console.log("programmes", programmes);
  const programmeOptions =
    programmes?.map((item: ProgrammeType) => ({
      value: item.id,
      label: `${item.name}(${item.level})`,
    })) || [];

  const handleDepartmentChange = (selectedOption: DepartmentOption | null) => {
    handleFilterChange({
      // department: selectedOption ? selectedOption.value : "",
      programme: selectedOption ? selectedOption.value : "",
    });
  };

  const columns: Column<StudentType>[] = [
    {
      header: "Name",
      accessor: "user",
      cell: (item: StudentType) => (
        <span>
          {item.user.first_name} {item.user.last_name}
        </span>
      ),
    },
    {
      header: "REG NO",
      accessor: "registration_number",
      cell: (item: StudentType) => (
        <span className="text-sm font-normal">{item.registration_number}</span>
      ),
    },
    {
      header: "Phone",
      accessor: "user",
      cell: (item: StudentType) => (
        <span className="text-sm font-normal">{item.user.phone_number}</span>
      ),
    },
    {
      header: "Gender",
      accessor: "user",
      cell: (item: StudentType) => (
        <span>
          <span className="text-sm">{item.user.gender}</span>
        </span>
      ),
    },
    {
      header: "Programme",
      accessor: "programme_name",
      cell: (item: StudentType) => (
        <span>
          <span className="text-sm normal">{item.programme_name}</span>
        </span>
      ),
    },

    {
      header: "Actions",
      accessor: "id",
      cell: (prog: StudentType) => (
        <div className="flex items-center justify-center space-x-2">
          <Link
            href={`/dashboard/students/${prog.id}`}
            className="flex items-center justify-center p-2 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-500 hover:text-white transition duration-200 shadow-sm hover:shadow-md"
            title="View Event Details"
          >
            <FiEye className="text-sm" />
          </Link>
        </div>
      ),
    },
  ];

  console.log("data", studentsData);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">All Students</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <AdmitStudent refetchData={refetch} />
            </div>
            <div>
              <StudentUploadButton refetchData={refetch} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="reg_no"
              onChange={handleFilterChange}
              value={filters.reg_no}
              placeholder="Search by reg no"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={programmeOptions}
              value={
                programmeOptions.find(
                  (option: DepartmentOption) =>
                    option.value === filters.programme
                ) || { value: "", label: "All Programmes" }
              }
              onChange={handleDepartmentChange}
              placeholder=""
              defaultLabel="All Programmes"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading Students . Please try again later.
          </div>
        ) : studentsData && studentsData.results.length > 0 ? (
          <DataTable
            data={studentsData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {studentsData && studentsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={studentsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default Students;
