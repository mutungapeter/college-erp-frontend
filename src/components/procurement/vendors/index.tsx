'use client';

import Pagination from '@/components/common/Pagination';
import { useFilters } from '@/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import NoData from '@/components/common/NoData';
import { useGetVendorsQuery } from '@/store/services/finance/procurementService';
import { CustomDate } from '@/utils/date';
import Link from 'next/link';
import { FiEye } from 'react-icons/fi';
import { GoSearch } from 'react-icons/go';
import { VendorInterface } from './types';

const Vendors = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        vendor_no: searchParams.get('vendor_no') || '',
      },
      initialPage: parseInt(searchParams.get('page') || '1', 10),
      router,
      debounceTime: 100,
      debouncedFields: ['vendor_no'],
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

  const { data, error, isLoading } = useGetVendorsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log('data', data);

  const columns: Column<VendorInterface>[] = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (item: VendorInterface) => <span>{item.name}</span>,
    },
    {
      header: 'Vendor No',
      accessor: 'vendor_no',
      cell: (item: VendorInterface) => <span>{item.vendor_no}</span>,
    },
    {
      header: 'Tel',
      accessor: 'phone',
      cell: (item: VendorInterface) => <span>{item.phone}</span>,
    },
    {
      header: 'Email',
      accessor: 'email',
      cell: (item: VendorInterface) => <span>{item.email}</span>,
    },

    {
      header: 'Address',
      accessor: 'address',
      cell: (item: VendorInterface) => <span>{item.address}</span>,
    },
    {
      header: 'Approved On',
      accessor: 'created_on',
      cell: (item: VendorInterface) => (
        <span>{CustomDate(item.created_on)}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (item: VendorInterface) => {
        return (
          <div className="flex items-center justify-center space-x-2">
            <Link
              title="View Details"
              className="group relative px-2 py-2 bg-indigo-100 text-indigo-500 rounded-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
              href={`/dashboard/procurement/vendors/details?id=${item.id}`}
            >
              <FiEye className="text-sm" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                View Details
              </span>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div className=" w-full ">
      {/* Header */}
      <div className="mb-8 p-3 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendors</h1>
          <p className="text-gray-600">All vendors</p>
        </div>
        <div className="flex justify-between items-center gap-3 md:gap-5"></div>
      </div>

      <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
        <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
          <GoSearch size={20} className="" />
          <input
            type="text"
            name="vendor_no"
            onChange={handleFilterChange}
            value={filters.vendor_no}
            placeholder="Search by vendor no"
            className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent
             outline-none border-b border-gray-300 focus:border-blue-600 focus:bg-white"
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
    </div>
  );
};

export default Vendors;
