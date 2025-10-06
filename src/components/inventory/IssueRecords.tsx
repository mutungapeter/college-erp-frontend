'use client';

import Pagination from '@/components/common/Pagination';
import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';
import { useFilters } from '@/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import NoData from '@/components/common/NoData';

import { LabelOptionsType } from '@/definitions/Labels/labelOptionsType';
import { DepartmentType } from '@/definitions/curiculum';
import { useGetDepartmentsQuery } from '@/store/services/curriculum/departmentsService';
import { useGetInventoryIssueRecordsQuery } from '@/store/services/finance/inventoryService';
import { CustomDate } from '@/utils/date';
import { GoSearch } from 'react-icons/go';
import FilterSelect from '../common/Select';
import IssueInventoryItem from './issueInventory';
import { IssueRecord } from './types';
const IssueRecords = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        search: searchParams.get('search') || '',
        department: searchParams.get('department') || '',
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

  const { data, error, isLoading, refetch } = useGetInventoryIssueRecordsQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  console.log('departmentsData', departmentsData);

  const handleDepartmentChange = (selectedOption: LabelOptionsType | null) => {
    handleFilterChange({
      department: selectedOption ? selectedOption.value : '',
    });
  };
  const columns: Column<IssueRecord>[] = [
    {
      header: 'Item Name',
      accessor: 'inventory_item',
      cell: (item: IssueRecord) => (
        <span className="text-sm whitespace-normal break-words">
          {item.inventory_item.name}
        </span>
      ),
    },

    {
      header: 'Quantity',
      accessor: 'quantity',
      cell: (item: IssueRecord) => <span>{item.quantity}</span>,
    },
    {
      header: 'Issued To',
      accessor: 'issued_to',
      cell: (item: IssueRecord) => (
        <span>
          {item.issued_to.name} {item.issued_to.office}
        </span>
      ),
    },
    {
      header: 'Issued By',
      accessor: 'issued_by',
      cell: (item: IssueRecord) => (
        <span>
          {item.issued_by.first_name} {item.issued_by.last_name}{' '}
          {item?.issued_by?.role?.name}
        </span>
      ),
    },
    {
      header: 'Remarks',
      accessor: 'remarks',
      cell: (item: IssueRecord) => (
        <span className="whitespace-normal break-words">{item?.remarks}</span>
      ),
    },
    {
      header: 'Issued On',
      accessor: 'issued_on',
      cell: (item: IssueRecord) => (
        <span className="text-xs whitespace-normal break-words">
          {CustomDate(item.issued_on)}
        </span>
      ),
    },
  ];
  return (
    <div className=" w-full ">
      {/* Header */}
      <div className="mb-8 md:p-5 flex md:flex-row flex-col gap-4  md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invetory Issue Records
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <div>
            <IssueInventoryItem refetchData={refetch} />
          </div>
        </div>
      </div>

      <div className="flex items-center md:justify-end lg:justify-end px-5">
        <div className="relative w-full md:w-auto md:min-w-[60%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
          <GoSearch size={20} className="" />
          <input
            type="text"
            name="search"
            onChange={handleFilterChange}
            value={filters.search}
            placeholder="Search by inventory item name, category name"
            className="w-full md:w-auto text-gray-900 md:min-w-[60%]  text-sm px-2 py-2 bg-transparent
                     outline-none border-b border-gray-300 focus:border-blue-600 bg-white focus:bg-white"
          />
        </div>
        <div className="  w-full md:w-auto md:min-w-[40%]  ">
          <FilterSelect
            options={
              departmentsData
                ? departmentsData.map((dept: DepartmentType) => ({
                    value: dept.id.toString(),
                    label: `${dept.name} (${dept.office})`,
                  }))
                : []
            }
            value={
              departmentsData
                ? departmentsData
                    .map((dept: DepartmentType) => ({
                      value: dept.id.toString(),
                      label: `${dept.name} (${dept.office})`,
                    }))
                    .find(
                      (option: LabelOptionsType) =>
                        option.value === filters.department,
                    ) || { value: '', label: 'All Departments' }
                : { value: '', label: 'All Departments' }
            }
            onChange={handleDepartmentChange}
            placeholder=""
            defaultLabel="All Departments"
          />
        </div>
      </div>
      <div className="w-full  p-1  font-nunito">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading data . Please try again later.
          </div>
        ) : data && data.results.length > 0 ? (
          <DataTable
            data={data?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
            columnBgColor="bg-gray-100 "
            stripedRows={true}
            stripeColor="bg-slate-100"
          />
        ) : (
          <NoData />
        )}

        {data && data.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={data.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      {/* <ActionModal
        isOpen={isModalOpen}
        onClose={closeActionModal}
        onDelete={handleDeleteIssueRecord}
        isDeleting={isDeleting}
        confirmationMessage="Are you sure you want to delete this inventory item?"
        deleteMessage="The inventory item will be permanently deleted."
        title="Delete Inventory Item"
        actionText="Delete"
      /> */}
    </div>
  );
};

export default IssueRecords;
