'use client';

import Pagination from '@/components/common/Pagination';

import { useFilters } from '@/hooks/useFilters';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import { MemberType } from '@/definitions/library';
import { PAGE_SIZE } from '@/lib/constants';
import { useGetMembersQuery } from '@/store/services/library/libraryService';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { GoSearch } from 'react-icons/go';
import ActivateLibraryMember from './ActivateMember';
import NewMember from './CreateMember';
import DeactivateLibraryMember from './DeactivateMember';

const Members = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        phone_no: searchParams.get('phone_no') || '',
      },
      initialPage: parseInt(searchParams.get('page') || '1', 10),
      router,
      debounceTime: 100,
      debouncedFields: ['phone_no'],
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
    data: booksData,
    isLoading,
    error,
    refetch,
  } = useGetMembersQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log('booksData', booksData);

  const columns: Column<MemberType>[] = [
    {
      header: 'Name',
      accessor: 'user',
      cell: (item: MemberType) => (
        <span className="font-semibold text-sm">
          {item.user.first_name}
          {item.user.last_name}
        </span>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      cell: (item: MemberType) => (
        <span className="text-xs font-normal">{item.role}</span>
      ),
    },

    {
      header: 'Gender',
      accessor: 'user',
      cell: (item: MemberType) => (
        <span>
          <span className="text-xs font-nunito ">{item.user.gender}</span>
        </span>
      ),
    },
    {
      header: 'Gender',
      accessor: 'user',
      cell: (item: MemberType) => (
        <span>
          <span className="text-xs font-nunito ">{item.user.phone_number}</span>
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'active',
      cell: (item: MemberType) => (
        <span
          className={`text-sm px-2 py-1 font-semibold rounded-lg ${
            item.active
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {item.active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (item: MemberType) => (
        <div className="flex items-center justify-center space-x-2">
          {item.active ? (
            <DeactivateLibraryMember refetchData={refetch} data={item} />
          ) : (
            <ActivateLibraryMember refetchData={refetch} data={item} />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">
            All Library Registered Members
          </h2>

          <div>
            <NewMember refetchData={refetch} />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="phone_no"
              onChange={handleFilterChange}
              value={filters.phone_no}
              placeholder="Search by  member's phone number"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            {/* <FilterSelect
            options={intakeOptions}
            value={intakeOptions.find(
              (option:LabelOptionsType) => option.value === filters.intake  
            ) || { value: "", label: "All Intakes" }}
            onChange={handleIntakeChange}
            placeholder=""
            defaultLabel="All Intakes"
          /> */}
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading Members . Please try again later.
          </div>
        ) : booksData && booksData.results.length > 0 ? (
          <DataTable
            data={booksData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {booksData && booksData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={booksData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default Members;
