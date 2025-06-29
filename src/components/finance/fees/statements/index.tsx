"use client";


import { useFilters } from "@/hooks/useFilters";

import FilterSelect from "@/components/common/Select";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { SemesterType } from "@/definitions/curiculum";
import { StudentDetailsType } from "@/definitions/students";
import { handleApiResponseError } from "@/lib/ApiError";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetSemestersQuery } from "@/store/services/curriculum/semestersService";
import { useGetFeeStamentsQuery } from "@/store/services/finance/feesService";
import { useGetStudentsQuery } from "@/store/services/students/studentsService";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";



const PDFFeeStatementViewer = dynamic(
  () => import("./StatementPdf").then((mod) => mod.PDFFeeStatementViewer),
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
const FeeStatement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
const [shouldFetch, setShouldFetch] = useState(false);

 
  const { filters, currentPage, handleFilterChange } =
    useFilters({
      initialFilters: {
        student: searchParams.get("student") || "",
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
  
  const { data:statementsData, isLoading, error } = useGetFeeStamentsQuery(
queryParams,
  {
      skip: !shouldFetch, 
    refetchOnMountOrArgChange: true,
  }
  );

useEffect(() => {
  if (statementsData) {
    setShouldFetch(false);
  }
}, [statementsData]);

  const handleGenerate = () => {
  if (!filters.student || !filters.semester) {
    alert("Please select both student and semester");
    return;
  }
  setShouldFetch(true);
}
  

  const { data:studentsData } = useGetStudentsQuery({}, {refetchOnMountOrArgChange: true,});
  const { data:semesters } = useGetSemestersQuery({}, {refetchOnMountOrArgChange: true,});
   
    
 
  const studentsOptions = studentsData?.map((item:StudentDetailsType) => ({
      value: item.id, 
      label: `${item.user.first_name} ${item.user.last_name} -${item.registration_number}`,
    })) || [];
 
  const semestersOptions = semesters?.map((item:SemesterType) => ({
      value: item.id, 
      label: `${item.name} (${item.academic_year})`,
    })) || [];
  
 const handleStudentChange = (selectedOption: LabelOptionsType | null) => {
  const studentId = selectedOption ? selectedOption.value : "";
      handleFilterChange({
      student: studentId,
    });
};
 const handleSemesterChange = (selectedOption: LabelOptionsType | null) => {
  const semId = selectedOption ? selectedOption.value : "";
      handleFilterChange({
      semester: semId,
    });
};
 console.log("statementsData", statementsData)

 
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">Fee Statement</h2>
     
        
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
             <FilterSelect
            options={studentsOptions}
            value={studentsOptions.find(
              (option:LabelOptionsType) => option.value === filters.student  
            ) || { value: "", label: "Select Student" }}
            onChange={handleStudentChange}
            placeholder=""
            defaultLabel="Select Student"
          />
             
             <FilterSelect
            options={semestersOptions}
            value={semestersOptions.find(
              (option:LabelOptionsType) => option.value === filters.semester  
            ) || { value: "", label: "Select Semester" }}
            onChange={handleSemesterChange}
            placeholder=""
            defaultLabel="Select Semester"
          />
          </div>
          <button
                  onClick={handleGenerate}
                  className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                  disabled={isLoading}
                >
                 
                  {isLoading ? 'Generating...' : 'Generate'}
                </button>
        </div>
      </div>
        
       {isLoading && !statementsData ? (
        <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12 bg-white rounded-md shadow-md py-8">
          <ContentSpinner />
        </div>
      ) : error ? (
        <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12 items-center space-x-2 py-5 text-black">
          <p className="text-sm lg:text-lg md:text-lg font-bold">{handleApiResponseError(error)}</p>
        </div>
      ) :  statementsData?.length >= 0 ? (
        <Suspense fallback={<ContentSpinner />}>
          <PDFFeeStatementViewer data={statementsData} />
        </Suspense>
      ) : (
        <div className="text-center text-gray-600">
          <h2>No data to show</h2>
        </div>
      )}  
    </>
  );
};

export default FeeStatement;

// import { useFilters } from "@/hooks/useFilters";
// import FilterSelect from "@/components/common/Select";
// import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
// import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
// import { SemesterType } from "@/definitions/curiculum";
// import { StudentDetailsType } from "@/definitions/students";
// import { handleApiResponseError } from "@/lib/ApiError";
// import { PAGE_SIZE } from "@/lib/constants";
// import { useGetSemestersQuery } from "@/store/services/curriculum/semestersService";
// import { useGetFeeStamentsQuery } from "@/store/services/finance/feesService";
// import { useGetStudentsQuery } from "@/store/services/students/studentsService";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useMemo, useState, useCallback } from "react";
// import { pdf } from '@react-pdf/renderer';
// import { saveAs } from 'file-saver';

// import FeeStatementPDF from "./StatementPdf";
// import FeeStatementHTML from "./Statement";

// const FeeStatement = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [shouldFetch, setShouldFetch] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);

//   const { filters, currentPage, handleFilterChange } = useFilters({
//     initialFilters: {
//       student: searchParams.get("student") || "",
//       semester: searchParams.get("semester") || "",
//     },
//     initialPage: parseInt(searchParams.get("page") || "1", 10),
//     router,
//     debounceTime: 100,
//     debouncedFields: ["reg_no"],
//   });

//   // Memoize query params to prevent unnecessary re-renders
//   const queryParams = useMemo(
//     () => ({
//       page: currentPage,
//       page_size: PAGE_SIZE,
//       ...filters,
//     }),
//     [currentPage, filters]
//   );

//   // Only fetch when shouldFetch is true AND we have both student and semester
//   const shouldSkipQuery = !shouldFetch || !filters.student || !filters.semester;

//   const { data: statementsData, isLoading, error } = useGetFeeStamentsQuery(
//     queryParams,
//     {
//       skip: shouldSkipQuery,
//       refetchOnMountOrArgChange: true,
//     }
//   );

//   // Fix the infinite loop by using useCallback and proper dependency array
//   const resetFetchFlag = useCallback(() => {
//     if (shouldFetch && statementsData) {
//       setShouldFetch(false);
//     }
//   }, [shouldFetch, statementsData]);

//   useEffect(() => {
//     resetFetchFlag();
//   }, [resetFetchFlag]);

//   const handleGenerate = useCallback(() => {
//     if (!filters.student || !filters.semester) {
//       alert("Please select both student and semester");
//       return;
//     }
//     setShouldFetch(true);
//   }, [filters.student, filters.semester]);

//   // Function to export PDF
//   const handleExportPDF = useCallback(async () => {
//     if (!statementsData || statementsData.length === 0) {
//       alert("No data to export");
//       return;
//     }

//     setIsExporting(true);
//     try {
//       // Generate PDF blob
//       const pdfBlob = await pdf(
//         <FeeStatementPDF data={statementsData} />
//       ).toBlob();
      
//       // Create filename
//       const student = statementsData[0]?.student;
//       const semester = statementsData[0]?.semester;
//       const fileName = `fee_statement_${student.registration_number}_${semester.name}_${semester.academic_year}.pdf`;
      
//       // Download the file
//       saveAs(pdfBlob, fileName);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       alert("Error generating PDF. Please try again.");
//     } finally {
//       setIsExporting(false);
//     }
//   }, [statementsData]);

//   const { data: studentsData } = useGetStudentsQuery(
//     {},
//     { refetchOnMountOrArgChange: true }
//   );
//   const { data: semesters } = useGetSemestersQuery(
//     {},
//     { refetchOnMountOrArgChange: true }
//   );

//   // Memoize options to prevent unnecessary re-renders
//   const studentsOptions = useMemo(() => 
//     studentsData?.map((item: StudentDetailsType) => ({
//       value: item.id,
//       label: `${item.user.first_name} ${item.user.last_name} -${item.registration_number}`,
//     })) || []
//   , [studentsData]);

//   const semestersOptions = useMemo(() =>
//     semesters?.map((item: SemesterType) => ({
//       value: item.id,
//       label: `${item.name} (${item.academic_year})`,
//     })) || []
//   , [semesters]);

//   const handleStudentChange = useCallback((selectedOption: LabelOptionsType | null) => {
//     const studentId = selectedOption ? selectedOption.value : "";
//     handleFilterChange({
//       student: studentId,
//     });
//   }, [handleFilterChange]);

//   const handleSemesterChange = useCallback((selectedOption: LabelOptionsType | null) => {
//     const semId = selectedOption ? selectedOption.value : "";
//     handleFilterChange({
//       semester: semId,
//     });
//   }, [handleFilterChange]);

//   // Memoize selected values to prevent unnecessary re-renders
//   const selectedStudent = useMemo(() => 
//     studentsOptions.find(
//       (option: LabelOptionsType) => option.value === filters.student
//     ) || { value: "", label: "Select Student" }
//   , [studentsOptions, filters.student]);

//   const selectedSemester = useMemo(() =>
//     semestersOptions.find(
//       (option: LabelOptionsType) => option.value === filters.semester
//     ) || { value: "", label: "Select Semester" }
//   , [semestersOptions, filters.semester]);

//   return (
//     <>
//       <div className="bg-white w-full p-1 shadow-md rounded-lg font-nunito">
//         <div className="p-3 flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
//           <h2 className="font-semibold text-black text-xl">Fee Statement</h2>
//         </div>

//         <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
//           <div className="flex flex-col gap-3 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
//             <FilterSelect
//               options={studentsOptions}
//               value={selectedStudent}
//               onChange={handleStudentChange}
//               placeholder=""
//               defaultLabel="Select Student"
//             />

//             <FilterSelect
//               options={semestersOptions}
//               value={selectedSemester}
//               onChange={handleSemesterChange}
//               placeholder=""
//               defaultLabel="Select Semester"
//             />
//           </div>
//           <button
//             onClick={handleGenerate}
//             className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
//             disabled={isLoading}
//           >
//             {isLoading ? "Generating..." : "Generate"}
//           </button>
//         </div>
//       </div>

//       {isLoading && !statementsData ? (
//         <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12 bg-white rounded-md shadow-md py-8">
//           <ContentSpinner />
//         </div>
//       ) : error ? (
//         <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12 items-center space-x-2 py-5 text-black">
//           <p className="text-sm lg:text-lg md:text-lg font-bold">
//             {handleApiResponseError(error)}
//           </p>
//         </div>
//       ) : statementsData && statementsData.length > 0 ? (
//         <FeeStatementHTML 
//           data={statementsData} 
//           onExportPDF={handleExportPDF}
//           isExporting={isExporting}
//         />
//       ) : (
//         <div className="text-center text-gray-600">
//           <h2>No data to show</h2>
//         </div>
//       )}
//     </>
//   );
// };

// export default FeeStatement;