'use client';

import FilterSelect from '@/components/common/Select';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';
import { LabelOptionsType } from '@/definitions/Labels/labelOptionsType';
import {
  ProgrammeCohortType,
  ProgrammeDetailsType,
  SemesterType,
} from '@/definitions/curiculum';
import { TranscriptType } from '@/definitions/transcripts';
import { useFilters } from '@/hooks/useFilters';
import { handleApiResponseError } from '@/lib/ApiError';
import { PAGE_SIZE } from '@/lib/constants';
import { useGetTranscriptMarksQuery } from '@/store/services/academics/acadmicsService';
import { useGetCohortsQuery } from '@/store/services/curriculum/cohortsService';
import { useGetProgrammesQuery } from '@/store/services/curriculum/programmesService';
import { useGetSemestersQuery } from '@/store/services/curriculum/semestersService';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { GoSearch } from 'react-icons/go';
import TranscriptHTMLView from './TranscriptHTMLView';
import { exportTranscriptToPDF } from './TranscriptsPdf';
import { BsFileEarmarkPdf, BsStars } from 'react-icons/bs';
import SubmitSpinner from '@/components/common/spinners/submitSpinner';

const Transcripts = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [newData, setNewData] = useState<TranscriptType[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleGenerate = () => {
    setShouldFetchData(true);
  };

  const handleExportPDF = async () => {
    if (newData.length === 0) return;

    setIsExporting(true);
    try {
      await exportTranscriptToPDF(newData);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const { filters, currentPage, handleFilterChange } = useFilters({
    initialFilters: {
      reg_no: searchParams.get('reg_no') || '',
      programme: searchParams.get('programme') || '',
      cohort: searchParams.get('cohort') || '',
      semester: searchParams.get('semester') || '',
    },
    initialPage: parseInt(searchParams.get('page') || '1', 10),
    router,
    debounceTime: 100,
    debouncedFields: ['reg_no'],
  });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters],
  );

  const {
    data: marksData,
    isLoading,
    error,
  } = useGetTranscriptMarksQuery(queryParams, {
    refetchOnMountOrArgChange: true,
    skip: !shouldFetchData,
  });

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

  const { data: programmes } = useGetProgrammesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: cohortsData } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: semesters } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const cohortsOptions =
    cohortsData?.map((item: ProgrammeCohortType) => ({
      value: item.id,
      label: `${item.name}`,
    })) || [];

  const programmeOptions =
    programmes?.map((item: ProgrammeDetailsType) => ({
      value: item.id,
      label: `${item.name} (${item.level})`,
    })) || [];

  const semestersOptions =
    semesters?.map((item: SemesterType) => ({
      value: item.id,
      label: `${item.name} (${item.academic_year})`,
    })) || [];

  const handleProgrammeChange = (selectedOption: LabelOptionsType | null) => {
    const courseValue = selectedOption ? selectedOption.value : '';
    handleFilterChange({
      programme: courseValue,
    });
  };

  const handleCohortChange = (selectedOption: LabelOptionsType | null) => {
    const cohortValue = selectedOption ? selectedOption.value : '';
    handleFilterChange({
      cohort: cohortValue,
    });
  };

  const handleSemesterChange = (selectedOption: LabelOptionsType | null) => {
    const semesterValue = selectedOption ? selectedOption.value : '';
    handleFilterChange({
      semester: semesterValue,
    });
  };

  return (
    <>
      <div className="bg-white w-full p-1 shadow-md rounded-lg font-nunito">
        <div className="p-3 flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">
            Academic Transcripts
          </h2>

          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              className="w-full sm:w-auto px-4 py-2 bg-primary text-white 
              rounded-md hover:bg-primary-700 flex items-center space-x-2 justify-center"
              disabled={isLoading}
            >
              <BsStars className="text-white text-lg" />
              <span>{isLoading ? <SubmitSpinner /> : 'Generate'}</span>
            </button>

            {isDataLoaded && newData.length > 0 && (
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 border-2 border-primary text-primary bg-white 
      rounded-md hover:bg-primary hover:text-white flex items-center 
      space-x-2 transition-all duration-200 ease-in-out"
              >
                <BsFileEarmarkPdf className="text-lg" />
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="reg_no"
              onChange={handleFilterChange}
              value={filters.reg_no}
              placeholder="generate by student's reg no"
              className="w-full md:w-auto text-gray-900 md:min-w-[60%] text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={cohortsOptions}
              value={
                cohortsOptions.find(
                  (option: LabelOptionsType) => option.value === filters.cohort,
                ) || { value: '', label: 'All Classes' }
              }
              onChange={handleCohortChange}
              placeholder=""
              defaultLabel="All Classes"
            />
            <FilterSelect
              options={programmeOptions}
              value={
                programmeOptions.find(
                  (option: LabelOptionsType) =>
                    option.value === filters.programme,
                ) || { value: '', label: 'All Courses' }
              }
              onChange={handleProgrammeChange}
              placeholder=""
              defaultLabel="All Courses"
            />
            <FilterSelect
              options={semestersOptions}
              value={
                semestersOptions.find(
                  (option: LabelOptionsType) =>
                    option.value === filters.semester,
                ) || { value: '', label: 'All Semesters' }
              }
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
          <p className="text-sm lg:text-lg md:text-lg font-bold">
            {handleApiResponseError(error)}
          </p>
        </div>
      ) : isDataLoaded && newData.length > 0 ? (
        <div className="bg-gray-100 p-4">
          <TranscriptHTMLView transcriptData={newData} />
        </div>
      ) : (
        <div className="text-center text-gray-600 bg-white rounded-md shadow-md py-8">
          <h2>No data to show</h2>
        </div>
      )}
    </>
  );
};

export default Transcripts;
