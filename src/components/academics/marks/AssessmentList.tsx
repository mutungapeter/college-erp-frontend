'use client';

import Pagination from '@/components/common/Pagination';

import { useFilters } from '@/hooks/useFilters';

import FilterSelect from '@/components/common/Select';
import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';
import {
  CourseType,
  ProgrammeCohortType,
  SemesterType,
} from '@/definitions/curiculum';
import { StudentDetailsType } from '@/definitions/students';
import { handleApiResponseError } from '@/lib/ApiError';
import { PAGE_SIZE } from '@/lib/constants';
import { useGetCohortsQuery } from '@/store/services/curriculum/cohortsService';
import { useGetCoursesQuery } from '@/store/services/curriculum/coursesService';
import { useGetSemestersQuery } from '@/store/services/curriculum/semestersService';
import { useGetAssessmentListQuery } from '@/store/services/students/studentsService';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { GoSearch } from 'react-icons/go';
import AddMarks from './AddMarks';

export type DepartmentOption = {
  value: string;
  label: string;
};

const ExamAssessmentList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        reg_no: searchParams.get('reg_no') || '',
        department: searchParams.get('department') || '',
        programme: searchParams.get('programme') || '',
        semester: searchParams.get('semeseter') || '',
        course: searchParams.get('course') || '',
        cohort: searchParams.get('cohort') || '',
      },
      initialPage: parseInt(searchParams.get('page') || '1', 10),
      router,
      debounceTime: 100,
      debouncedFields: ['reg_no'],
    });

  console.log('filters', filters);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters],
  );

  const {
    data: studentsData,
    isLoading,
    error,
    refetch,
  } = useGetAssessmentListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log('studentsData', studentsData);

  const { data: semesters } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: courses } = useGetCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: cohorts } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const semesterOptions =
    semesters?.map((item: SemesterType) => ({
      value: item.id,
      label: `${item.name}(${item.academic_year.name})`,
    })) || [];
  const coursesOptions =
    courses?.map((item: CourseType) => ({
      value: item.id,
      label: `${item.course_code} ${item.name} (${item.programme.level})`,
    })) || [];
  const cohortsOptions =
    cohorts?.map((item: ProgrammeCohortType) => ({
      value: item.id,
      label: `${item.name}(${item.current_year.name})`,
    })) || [];

  console.log('error', error);

  const handleSemsterChange = (selectedOption: DepartmentOption | null) => {
    handleFilterChange({
      semester: selectedOption ? selectedOption.value : '',
    });
  };

  const handleCourseChange = (selectedOption: DepartmentOption | null) => {
    handleFilterChange({
      course: selectedOption ? selectedOption.value : '',
    });
  };
  const handleCohortChange = (selectedOption: DepartmentOption | null) => {
    handleFilterChange({
      cohort: selectedOption ? selectedOption.value : '',
    });
  };

  const columns: Column<StudentDetailsType>[] = [
    {
      header: 'Name',
      accessor: 'user',
      cell: (item: StudentDetailsType) => (
        <span>
          {item.user.first_name} {item.user.last_name}
        </span>
      ),
    },
    {
      header: 'REG NO',
      accessor: 'registration_number',
      cell: (item: StudentDetailsType) => (
        <span className="text-sm font-normal">{item.registration_number}</span>
      ),
    },
    {
      header: 'Class',
      accessor: 'cohort',
      cell: (item: StudentDetailsType) => (
        <span>
          <span className="text-sm normal">
            {item?.cohort ? `${item?.cohort?.name}` : '-'}
          </span>
        </span>
      ),
    },

    {
      header: 'Course',
      accessor: 'programme',
      cell: (item: StudentDetailsType) => (
        <span>
          <span className="text-sm normal">{item.programme.name}</span>
        </span>
      ),
    },
    {
      header: 'Semester',
      accessor: 'cohort',
      cell: (item: StudentDetailsType) => (
        <span>
          <span className="text-sm ">
            {item?.cohort
              ? `${item?.cohort?.current_semester?.name}  ${item?.cohort?.current_semester?.academic_year?.name}`
              : '-'}
          </span>
        </span>
      ),
    },

    {
      header: 'Actions',
      accessor: 'id',
      cell: (student: StudentDetailsType) => {
        const course = courses?.find(
          (c: CourseType) => c.id === Number(filters.course),
        );
        const semester = semesters?.find(
          (s: SemesterType) => s.id === Number(filters.semester),
        );
        const cohort = cohorts?.find(
          (c: ProgrammeCohortType) => c.id === Number(filters.cohort),
        );
        return (
          <div className="flex items-center justify-center space-x-2">
            {course && semester && (
              <AddMarks
                refetchData={refetch}
                student={student}
                course={course}
                semester={semester}
                cohort={cohort}
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-inter">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">Assessment List</h2>
          <div className="grid grid-cols-2 gap-2">
            {/* <AdmitStudent refetchData={refetch} />
            <StudentUploadButton refetchData={refetch} /> */}
          </div>
        </div>

        <div className="flex items-center md:justify-end lg:justify-end px-5">
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center  md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={cohortsOptions}
              value={
                cohortsOptions.find(
                  (option: DepartmentOption) => option.value === filters.cohort,
                ) || { value: '', label: 'All classes' }
              }
              onChange={handleCohortChange}
              placeholder=""
              defaultLabel="All Classes"
            />
            <FilterSelect
              options={coursesOptions}
              value={
                coursesOptions.find(
                  (option: DepartmentOption) => option.value === filters.course,
                ) || { value: '', label: 'All Units' }
              }
              onChange={handleCourseChange}
              placeholder=""
              defaultLabel="All Units"
            />
            <FilterSelect
              options={semesterOptions}
              value={
                semesterOptions.find(
                  (option: DepartmentOption) =>
                    option.value === filters.semester,
                ) || { value: '', label: 'All Semesters' }
              }
              onChange={handleSemsterChange}
              placeholder=""
              defaultLabel="All Semesters"
            />
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
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className=" p-4 mt-6 mb-6 rounded-md md:w-auto text-red-800 text-center">
            {handleApiResponseError(error)}
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

export default ExamAssessmentList;
