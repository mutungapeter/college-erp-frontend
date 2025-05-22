"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import FilterSelect from "@/components/common/Select";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { MarksType } from "@/definitions/academics";
import { CourseType } from "@/definitions/curiculum";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetMarksQuery } from "@/store/services/academics/acadmicsService";
import { useGetCoursesQuery } from "@/store/services/curriculum/coursesService";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FaRegHandPointRight } from "react-icons/fa6";
import { GoSearch } from "react-icons/go";
import EditMarks from "./EditMarks";
import UploadMarks from "./UploadMarks";


const Marks = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        reg_no: searchParams.get("reg_no") || "",
        course: searchParams.get("course") || "",
        cohort: searchParams.get("cohort") || "",
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
console.log("queryParams",queryParams)
  
  const { data:marksData, isLoading, error, refetch } = useGetMarksQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

console.log("marksData",marksData)

  const { data:coursesData } = useGetCoursesQuery({}, {refetchOnMountOrArgChange: true,});

   
     console.log("coursesData", coursesData)
  const coursesOptions = coursesData?.map((item:CourseType) => ({
      value: item.id, 
      label: `${item.name}`,
    })) || [];

 const handleCourseChange = (selectedOption: LabelOptionsType | null) => {
  const courseValue = selectedOption ? selectedOption.value : "";
      handleFilterChange({
      course: courseValue,
    });
    };

 
 
  const columns: Column<MarksType>[] = [
    {
      header: "Name",
      accessor: "student",
      cell: (item: MarksType) => <span>{item.student.user.first_name} {item.student.user.last_name}</span>,
    },
   
    
    {
      header: "Semester",
      accessor: "semester",
      cell: (item: MarksType) => (
        <span>
          <span className="text-sm">{item.semester.name}-({item.semester.academic_year})</span>
        </span>
      ),
    },
    {
      header: "Unit",
      accessor: "course",
      cell: (item: MarksType) => (
        <span>
          <span className="text-sm normal">{item.course.course_code} {item.course.name}</span>
        </span>
      ),
    },
    {
      header: "Cat One",
      accessor: "cat_one",
      cell: (item: MarksType) => (
        <span>
          <span className="text-sm normal">{item.cat_one}</span>
        </span>
      ),
    },
    
   
    {
      header: "Cat Two",
      accessor: "cat_two",
      cell: (item: MarksType) => (
         <span>
          <span className="text-sm normal">{item.cat_two}</span>
        </span>
      ),
    },
    {
      header: "Exam",
      accessor: "exam_marks",
      cell: (item: MarksType) => (
         <span>
          <span className="text-sm normal">{item.exam_marks}</span>
        </span>
      ),
    },
    {
      header: "Total",
      accessor: "total_marks",
      cell: (item: MarksType) => (
         <span>
          <span className="text-sm normal">{item.total_marks}</span>
        </span>
      ),
    },
    {
      header: "Grade",
      accessor: "grade",
      cell: (item: MarksType) => (
         <span>
          <span className="text-sm normal">{item.grade}</span>
        </span>
      ),
    },
 
   
    {
      header: "Actions",
      accessor: "id",
      cell: (item: MarksType) => (
        <div className="flex items-center justify-center space-x-2"> 
          <EditMarks data={item} refetchData={refetch} />
        </div>
      ),
    },
  ];
 

  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">All Marks </h2>
     
         <div className="flex md:items-center md:flex-row flex-col gap-4">
          <UploadMarks refetchData={refetch} />
          <Link href="/dashboard/academics/marks/assessment-list" className="flex space-x-3 items-center bg-success-600 hover:bg-success-700 rounded-xl px-3 py-2"> 
            <FaRegHandPointRight   className=" text-lg text-white"/>
            <span className="text-white">Adding Single Mark</span>
          </Link>
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
              placeholder="Search by  student's reg no"
              className="w-full md:w-auto text-gray-900 md:min-w-[60%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
             {/* <FilterSelect
            options={cohortsOptions}
            value={cohortsOptions.find(
              (option:LabelOptionsType) => option.value === filters.cohort  
            ) || { value: "", label: "All Classes" }}
            onChange={handleCohortChange}
            placeholder=""
            defaultLabel="All Classes"
          /> */}
             <FilterSelect
            options={coursesOptions}
            value={coursesOptions.find(
              (option:LabelOptionsType) => option.value === filters.course  
            ) || { value: "", label: "All Units" }}
            onChange={handleCourseChange}
            placeholder=""
            defaultLabel="All Units"
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
        ) : marksData && marksData.results.length > 0 ? (
          <DataTable
            data={marksData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {marksData && marksData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={marksData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}

     
      </div>
    </>
  );
};

export default Marks;
