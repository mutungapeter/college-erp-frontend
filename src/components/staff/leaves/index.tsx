'use client';

import Pagination from '@/components/common/Pagination';

import { useFilters } from '@/hooks/useFilters';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import FilterSelect from '@/components/common/Select';
import { LabelOptionsType } from '@/definitions/Labels/labelOptionsType';
import { DepartmentType } from '@/definitions/curiculum';
import { LeaveType } from '@/definitions/leaves';
import { PAGE_SIZE } from '@/lib/constants';
import { useGetDepartmentsQuery } from '@/store/services/curriculum/departmentsService';
import { useGetLeavesQuery } from '@/store/services/staff/leaveService';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { GoSearch } from 'react-icons/go';

const Leaves = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        search: searchParams.get('search') || '',
        department: searchParams.get('department') || '',
        status: searchParams.get('status') || '',
      },
      initialPage: parseInt(searchParams.get('page') || '1', 10),
      router,
      debounceTime: 100,
      debouncedFields: ['search'],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters],
  );
  console.log('queryParams', queryParams);

  const {
    data: leavesData,
    isLoading,
    error,
  } = useGetLeavesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  console.log('leavesData', leavesData);

  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  console.log('departmentsData', departmentsData);
  const departmentOptions =
    departmentsData?.map((item: DepartmentType) => ({
      value: item.id,
      label: `${item.name}`,
    })) || [];

  const handleIntakeChange = (selectedOption: LabelOptionsType | null) => {
    const departmentValue = selectedOption ? selectedOption.value : '';
    handleFilterChange({
      department: departmentValue,
    });
  };

  const columns: Column<LeaveType>[] = [
    {
      header: 'Name',
      accessor: 'application',
      cell: (item: LeaveType) => (
        <span>
          {item.application.staff.user.first_name}{' '}
          {item.application.staff.user.last_name}(
          {item.application.staff.staff_number})
        </span>
      ),
    },

    {
      header: 'Type',
      accessor: 'application',
      cell: (item: LeaveType) => (
        <span className="text-sm">{item.application.leave_type}</span>
      ),
    },
    {
      header: 'Reason',
      accessor: 'application',
      cell: (item: LeaveType) => (
        <span>
          <span className="text-sm whitespace-normal break-words">
            {item.application.reason}
          </span>
        </span>
      ),
    },
    {
      header: 'Duration',
      accessor: 'application',
      cell: (item: LeaveType) => (
        <span>
          <span className="text-sm">
            {item.application.leave_days_applied_for}(days)
          </span>
        </span>
      ),
    },

    {
      header: 'Application Status',
      accessor: 'status',
      cell: (item: LeaveType) => (
        <div className="text-center">
          <span
            className={`
          "text-sm font-semibold justify-center w-fit flex px-2 py-1 rounded-md text-center"
            ${
              item.status === 'Active'
                ? 'text-green-500 bg-green-100'
                : item.status === 'Pending'
                  ? 'text-yellow-500 bg-yellow-100'
                  : item.status === 'Cancelled'
                    ? 'text-red-500 bg-red-100'
                    : 'text-white bg-gray-500'
            }
            `}
          >
            {item.status}
          </span>
        </div>
      ),
    },
  ];

  console.log('leavesData', leavesData);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">Approved Leaves</h2>
          <div></div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row space-x-4  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="search"
              onChange={handleFilterChange}
              value={filters.search}
              placeholder="Search by  staff no or phone no"
              className="w-full md:w-auto  text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>

          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={departmentOptions}
              value={
                departmentOptions.find(
                  (option: LabelOptionsType) =>
                    option.value === filters.department,
                ) || { value: '', label: 'All Departments' }
              }
              onChange={handleIntakeChange}
              placeholder=""
              defaultLabel="All Departments"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading leaves . Please try again later.
          </div>
        ) : leavesData && leavesData.results.length > 0 ? (
          <DataTable
            data={leavesData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
            columnBgColor="bg-gray-100 "
            stripedRows={true}
            stripeColor="bg-slate-100"
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {leavesData && leavesData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={leavesData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default Leaves;
