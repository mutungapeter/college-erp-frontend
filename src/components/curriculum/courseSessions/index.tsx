'use client';

import Pagination from '@/components/common/Pagination';

import { useFilters } from '@/hooks/useFilters';

import ActionModal from '@/components/common/Modals/ActionModal';
import FilterSelect from '@/components/common/Select';
import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';
import {
  CourseSessionType,
  ProgrammeCohortType,
} from '@/definitions/curiculum';
import { PAGE_SIZE } from '@/lib/constants';
import { useGetCohortsQuery } from '@/store/services/curriculum/cohortsService';
import {
  useDeleteCourseSessionMutation,
  useGetCourseSessionsQuery,
} from '@/store/services/curriculum/courseSessionService';
import { CustomDate } from '@/utils/date';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { GoSearch } from 'react-icons/go';
import { toast } from 'react-toastify';
import EditCourseSession from './EditSession';
import AddCourseSession from './NewSession';

export type CohortOption = {
  value: string;
  label: string;
};

const CourseSessions = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        course_name: searchParams.get('course_name') || '',
        cohort: searchParams.get('cohort') || '',
        status: searchParams.get('status') || '',
      },
      initialPage: parseInt(searchParams.get('page') || '1', 10),
      router,
      debounceTime: 100,
      debouncedFields: ['course_name'],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters],
  );

  const { data, isLoading, error, refetch } = useGetCourseSessionsQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: cohorts } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const [deleteCourseSession, { isLoading: isDeleting }] =
    useDeleteCourseSessionMutation();
  console.log('cohorts', cohorts);
  const CohortOptions =
    cohorts?.map((cohort: ProgrammeCohortType) => ({
      value: cohort.id,
      label: cohort.name,
    })) || [];

  const openDeleteModal = (prog_id: number) => {
    setSelectedSession(prog_id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSession(null);
  };
  const handleCohortsChange = (selectedOption: CohortOption | null) => {
    handleFilterChange({
      cohort: selectedOption ? selectedOption.value : '',
    });
  };
  const handleDeleteCourseSession = async () => {
    try {
      await deleteCourseSession(selectedSession).unwrap();
      toast.success('Course Session Deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log('errorData', errorData);
        toast.error(errorData.error || 'Error Deleting Course Session!.');
      } else {
        toast.error('Unexpected Error occured. Please try again.');
      }
    }
  };
  const columns: Column<CourseSessionType>[] = [
    {
      header: 'Course',
      accessor: 'course',
      cell: (item: CourseSessionType) => <span>{item.course.name}</span>,
    },
    {
      header: 'Cohort',
      accessor: 'cohort',
      cell: (item: CourseSessionType) => (
        <span className="text-sm font-normal">{item.cohort.name}</span>
      ),
    },
    {
      header: 'Start Time',
      accessor: 'start_time',
      cell: (item: CourseSessionType) => (
        <span className="text-sm font-normal">
          {CustomDate(item.start_time)}
        </span>
      ),
    },
    {
      header: 'Period',
      accessor: 'period',
      cell: (item: CourseSessionType) => (
        <span>
          <span className="text-sm">{item.period}</span>
        </span>
      ),
    },

    {
      header: 'Status',
      accessor: 'status',
      cell: (cohort: CourseSessionType) => (
        <div className="flex items-center justify-center">
          <span
            className={`
            px-2 py-1 rounded-md font-normal text-xs  ${
              cohort.status === 'Active'
                ? 'bg-emerald-100 text-emerald-600'
                : cohort.status === 'Future'
                  ? 'bg-blue-100 text-blue-600'
                  : cohort.status === 'Past'
                    ? 'bg-indigo-600 text-white'
                    : cohort.status === 'Cancelled'
                      ? 'bg-red-100 text-red-600'
                      : cohort.status === 'Completed'
                        ? 'bg-green-100 text-green-600'
                        : cohort.status === 'Rescheduled'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-600'
            }`}
          >
            {cohort.status}
          </span>
        </div>
      ),
    },

    {
      header: 'Actions',
      accessor: 'id',
      cell: (item: CourseSessionType) => (
        <div className="flex items-center justify-center space-x-2">
          <EditCourseSession data={item} refetchData={refetch} />
          <div
            onClick={() => openDeleteModal(item.id)}
            className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-blue-200 hover:text-red-700 cursor-pointer transition duration-200 shadow-sm"
            title="Edit Cohort"
          >
            <FiTrash2 className="text-sm" />
          </div>
        </div>
      ),
    },
  ];

  console.log('data', data);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">
            All Courses Sessions
          </h2>
          <div>
            <AddCourseSession refetchData={refetch} />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="course_name"
              onChange={handleFilterChange}
              placeholder="Search by course name"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={CohortOptions}
              value={
                CohortOptions.find(
                  (option: CohortOption) => option.value === filters.cohort,
                ) || { value: '', label: 'All Cohorts' }
              }
              onChange={handleCohortsChange}
              placeholder=""
              defaultLabel="All Cohorts"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading Courses. Please try again later.
          </div>
        ) : data && data.results.length > 0 ? (
          <DataTable
            data={data?.results}
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

        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleDeleteCourseSession}
          isDeleting={isDeleting}
          confirmationMessage="Are you sure you want to Delete this Session ?"
          deleteMessage="This action cannot be undone."
          title="Delete Session"
          actionText="Delete Session"
        />
      </div>
    </>
  );
};

export default CourseSessions;
