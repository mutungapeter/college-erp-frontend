"use client";
import FilterSelect from "@/components/common/Select";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";

import { useFilters } from '@/hooks/useFilters';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { HiOutlineSparkles } from "react-icons/hi";
import { toast } from "react-toastify";
import FeeStatementHTMLView, {
  FeeStatementStudent,
} from "./FeeStatementHTMLView";
import { exportFeeStatementToPDF } from "./FeeStatementPDF";

import { ProgrammeCohortType } from "@/definitions/curiculum";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { handleApiResponseError } from "@/lib/ApiError";
import { RolePermission } from "@/store/definitions";
import { useAppSelector } from "@/store/hooks";
import { useGetAcademicYearsQuery } from "@/store/services/curriculum/academicYearsService";
import { useGetCohortsQuery } from "@/store/services/curriculum/cohortsService";
import { useGetFeeStamentsReportsQuery } from "@/store/services/finance/feesService";
import { RootState } from "@/store/store";
import { AcademicYearType } from "@/components/curriculum/acadmicyYears/types";
const FeeStatementsDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statementData, setStatementData] = useState<FeeStatementStudent[]>([]);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const { user } = useAppSelector((state: RootState) => state.auth);
  
    
  
    const permissions: RolePermission[] = useMemo(() => {
      return user?.role?.permissions ?? [];
    }, [user?.role?.permissions]);
  
  
  const { filters, handleFilterChange } = useFilters({
    initialFilters: {
      registration_number: searchParams.get("registration_number") || "",
      cohort: searchParams.get("cohort") || "",
      academic_year: searchParams.get("academic_year") || "",
      semester: searchParams.get("semester") || "",
    },
    router,
    debounceTime: 100,
    debouncedFields: ["registration_number"],
  });
  const canFetchData =
    shouldFetchData &&
    filters.academic_year &&
    ((filters.registration_number && filters.registration_number.trim() !== "") ||
      (filters.cohort && filters.cohort !== ""));

  const { data, isLoading, error } = useGetFeeStamentsReportsQuery(filters, {
    skip: !canFetchData,
    refetchOnMountOrArgChange: true,
  });

  // console.log("Fee statements data:", data);
  // console.log("error:", error);

  const { data: cohortsData } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: yearsData } = useGetAcademicYearsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (data && shouldFetchData) {
      let processedData: FeeStatementStudent[] = [];

      if (Array.isArray(data)) {
        processedData = data;
      } else if (data && typeof data === "object" && data.statements) {
        processedData = [data];
      }

      setStatementData(processedData);
    }
  }, [data, shouldFetchData]);
 const statementsPermissions = useMemo(() => {
    return permissions.find(
      (permission) => permission.module.code === "finance_fee_statements"
    );
  }, [permissions]);


  const canExport = statementsPermissions?.can_export ?? false;

  const handleGenerate = () => {
    console.log("Generate button clicked");
    console.log("Current filters:", filters);

    if (!filters.academic_year) {
      toast.error("Please select a year");
      return;
    }

    if (!filters.registration_number && !filters.cohort) {
      toast.error("Please enter admission number or select a class");
      return;
    }

    // Reset previous data and trigger fetch
    setStatementData([]);
    setShouldFetchData(true);

    console.log("Starting data fetch...");
  };

  const cohortsOptions =
    cohortsData?.map((item: ProgrammeCohortType) => ({
      value: item.id,
      label: `${item.name} ${item.current_semester.academic_year.name}`,
    })) || [];
  const yearOptions =
    yearsData?.map((item: AcademicYearType) => ({
      value: item.id,
      label: `${item.name}`,
    })) || [];

  const handleClassChange = (selectedOption: LabelOptionsType | null) => {
    handleFilterChange({
      cohort: selectedOption ? selectedOption.value : "",
    });
  };

  const handleClearFilters = () => {
    handleFilterChange({
      academic_year: "",
      cohort: "",
      registration_number: "",
    });
    setStatementData([]);
    setShouldFetchData(false);
  };

 
  const handleAcademicYearChange = (selected: LabelOptionsType | null) => {
    handleFilterChange({
      academic_year: selected ? selected.value : "",
    });
  };

  // const handleExportPDF = async () => {
  //   if (!data || data.length === 0) {
  //     toast.error("No fee statement data to export");
  //     return;
  //   }

  //   setIsExportingPDF(true);
  //   try {
  //     await exportFeeStatementToPDF(data);
  //     toast.success("Fee statement exported successfully!");
  //   } catch (error) {
  //     console.error("Error exporting PDF:", error);
  //     toast.error("Failed to export PDF");
  //   } finally {
  //     setIsExportingPDF(false);
  //   }
  // };
  const handleExportPDF = async () => {
    if (statementData.length === 0) return;

    setIsExportingPDF(true);
    try {
      await exportFeeStatementToPDF(statementData);
      toast.success("Fee statements exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <>
      <div className=" w-full p-1  rounded-lg font-nunito">
        <div className="p-3 flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">Fee Statement</h2>

          <div className="flex gap-2">
            <button
              onClick={handleClearFilters}
              className="w-full sm:w-auto px-4 py-2 bg-white rounded-md border border-gray-400 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <FiRefreshCw className="text-gray-600 text-sm" />
              <span className="text-xs font-medium">Reset Filters</span>
            </button>
            <button
              onClick={handleGenerate}
              className="w-full sm:w-auto 
              flex items-center space-x-2
               px-4 py-2 bg-yellow-600 hover:ring-2 
               hover:ring-yellow-700 font-medium 
               text-white text-xs rounded-md hover:bg-yellow-700 
               justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <SubmitSpinner />
              ) : (
                <HiOutlineSparkles className="text-sm" />
              )}
              <span>{isLoading ? "Generating..." : "Generate"}</span>
            </button>
            {canExport && statementData && statementData.length > 0 && (
              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                {isExportingPDF ? (
                  <SubmitSpinner />
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
                <span className="text-xs font-medium">
                  {isExportingPDF ? "Exporting..." : "Export PDF"}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row md:items-center p-2 md:justify-end lg:items-center lg:justify-end">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="registration_number"
              value={filters.registration_number}
              onChange={handleFilterChange}
              placeholder="Search by admission no"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%] text-sm px-2 py-2 bg-white outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>

          <div className="flex flex-col gap-3 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={cohortsOptions}
              value={
                cohortsOptions.find(
                  (option: LabelOptionsType) =>
                    option.value === filters.cohort
                ) || { value: "", label: "Cohort" }
              }
              onChange={handleClassChange}
              placeholder=""
              defaultLabel="Cohort"
            />
            <FilterSelect
              options={yearOptions}
             value={
                yearOptions.find(
                  (option: LabelOptionsType) =>
                    option.value === filters.academic_year
                ) || { value: "", label: "Academic Year" }
              }
              onChange={handleAcademicYearChange}
              placeholder=""
              defaultLabel="Academic Year"
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12 bg-white rounded-md shadow-md py-8">
          <ContentSpinner />
        </div>
      ) : error ? (
        <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12 items-center space-x-2 py-5 text-black">
          <p className="text-sm lg:text-lg md:text-lg font-bold text-black-600">
            {handleApiResponseError(error)}
          </p>
        </div>
      ) : data && data.length > 0 ? (
        <div className="bg-gray-100">
          <FeeStatementHTMLView data={statementData} />
        </div>
      ) : (
        <div className="text-center text-gray-600 bg-white rounded-md shadow-md py-8">
          <h2>No fee statement records found</h2>
        </div>
      )}
    </>
  );
};

export default FeeStatementsDetails;
