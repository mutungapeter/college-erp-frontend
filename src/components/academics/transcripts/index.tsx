"use client";


import { useFilters } from "@/hooks/useFilters";

import FilterSelect from "@/components/common/Select";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { ProgrammeCohortType, ProgrammeDetailsType, SemesterType } from "@/definitions/curiculum";
import { TranscriptType } from "@/definitions/transcripts";
import { handleApiResponseError } from "@/lib/ApiError";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetTranscriptMarksQuery } from "@/store/services/academics/acadmicsService";
import { useGetCohortsQuery } from "@/store/services/curriculum/cohortsService";
import { useGetProgrammesQuery } from "@/store/services/curriculum/programmesService";
import { useGetSemestersQuery } from "@/store/services/curriculum/semestersService";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { GoSearch } from "react-icons/go";



const PDFTranscriptViewer = dynamic(
  () => import("./TranscriptsPdf").then((mod) => mod.PDFTranscriptViewer),
  { 
    ssr: false,
    loading: () => (
     <div className="fixed inset-0 bg-black  bg-opacity-50 flex items-center justify-center z-50">
             <div className=" w-full md:max-w-c-500 p-6 rounded-lg shadow-lg">
             <ContentSpinner />
             </div>
             
           </div>
    )
  }
);
const Transcripts = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

 const [newData, setNewData] = useState<TranscriptType[]>([]);
 const [isDataLoaded, setIsDataLoaded] = useState(false);
 const [shouldFetchData, setShouldFetchData] = useState(false);
 
 const handleGenerate = () => {
    setShouldFetchData(true);
  };

  const { filters, currentPage, handleFilterChange } =
    useFilters({
      initialFilters: {
        reg_no: searchParams.get("reg_no") || "",
        programme: searchParams.get("programme") || "",
        cohort: searchParams.get("cohort") || "",
        semester: searchParams.get("semester") || "",
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
  
  const { data:marksData, isLoading, error } = useGetTranscriptMarksQuery(
queryParams,
  {
    refetchOnMountOrArgChange: true,
    skip: !shouldFetchData, 
  }
  );
  

console.log("marksData",marksData)
useEffect(() => {
    if (shouldFetchData && marksData && marksData.results) {
      setNewData(marksData.results);
      setIsDataLoaded(true);
      setShouldFetchData(false);
    } else if (shouldFetchData && marksData && !marksData.results) {
      setNewData([]);
      setIsDataLoaded(false);
      setShouldFetchData(false); 
    }
  }, [marksData, shouldFetchData]);

 
  useEffect(() => {
    setIsDataLoaded(false);
    setNewData([]);
    setShouldFetchData(false);
  }, [filters, currentPage]);
  
  const { data:programmes } = useGetProgrammesQuery({}, {refetchOnMountOrArgChange: true,});
  const { data:cohortsData } = useGetCohortsQuery({}, {refetchOnMountOrArgChange: true,});
  const { data:semesters } = useGetSemestersQuery({}, {refetchOnMountOrArgChange: true,});
   
    
 
  const cohortsOptions = cohortsData?.map((item:ProgrammeCohortType) => ({
      value: item.id, 
      label: `${item.name}`,
    })) || [];
  const programmeOptions = programmes?.map((item:ProgrammeDetailsType) => ({
      value: item.id, 
      label: `${item.name} (${item.level})`,
    })) || [];
  const semestersOptions = semesters?.map((item:SemesterType) => ({
      value: item.id, 
      label: `${item.name} (${item.academic_year})`,
    })) || [];
  
 const handleProgrammeChange = (selectedOption: LabelOptionsType | null) => {
  const courseValue = selectedOption ? selectedOption.value : "";
      handleFilterChange({
      programme: courseValue,
    });
    };
 const handleCohortChange = (selectedOption: LabelOptionsType | null) => {
  const cohortValue = selectedOption ? selectedOption.value : "";
      handleFilterChange({
      cohort: cohortValue,
    });
};
 const handleSemesterChange = (selectedOption: LabelOptionsType | null) => {
  const cohortValue = selectedOption ? selectedOption.value : "";
      handleFilterChange({
      semester: cohortValue,
    });
};
 
 console.log("newData", newData)
 
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">Academic Transcripts</h2>
     
        <button
                  onClick={handleGenerate}
                  className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {/* <FaRegHandPointRight className="mr-2" />  */}
                  {isLoading ? 'Generating...' : 'Generate'}
                </button>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="reg_no"
              onChange={handleFilterChange}
              value={filters.reg_no}
              placeholder="generate by student's reg no"
              className="w-full md:w-auto text-gray-900 md:min-w-[60%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
             <FilterSelect
            options={cohortsOptions}
            value={cohortsOptions.find(
              (option:LabelOptionsType) => option.value === filters.cohort  
            ) || { value: "", label: "All Classes" }}
            onChange={handleCohortChange}
            placeholder=""
            defaultLabel="All Classes"
          />
             <FilterSelect
            options={programmeOptions}
            value={programmeOptions.find(
              (option:LabelOptionsType) => option.value === filters.programme  
            ) || { value: "", label: "All Courses" }}
            onChange={handleProgrammeChange}
            placeholder=""
            defaultLabel="All Courses"
          />
             <FilterSelect
            options={semestersOptions}
            value={semestersOptions.find(
              (option:LabelOptionsType) => option.value === filters.semester  
            ) || { value: "", label: "All Semesters" }}
            onChange={handleSemesterChange}
            placeholder=""
            defaultLabel="All Semesters"
          />
          </div>
        </div>
      </div>
        
       {isLoading && !newData ? (
        <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12 bg-white rounded-md shadow-md py-8">
          <ContentSpinner />
        </div>
      ) : error ? (
        <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12 items-center space-x-2 py-5 text-black">
          <p className="text-sm lg:text-lg md:text-lg font-bold">{handleApiResponseError(error)}</p>
        </div>
      ) : isDataLoaded && newData.length > 0 ? (
        <Suspense fallback={<ContentSpinner />}>
          <PDFTranscriptViewer transcriptData={newData} />
        </Suspense>
      ) : (
        <div className="text-center text-gray-600">
          <h2>No data to show</h2>
        </div>
      )}  
    </>
  );
};

export default Transcripts;