'use client';

import Pagination from '@/components/common/Pagination';
import { useFilters } from '@/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import NoData from '@/components/common/NoData';
import { useGetPurchaseOrdersQuery } from '@/store/services/finance/procurementService';
import { formatCurrency } from '@/utils/currency';
import { CustomDate } from '@/utils/date';
import Link from 'next/link';
import { GoSearch } from 'react-icons/go';
import { SlBasket } from 'react-icons/sl';
import ReceiveOrder from './RecivedOrder';
import { PurchaseOrderType } from './types';
const OrdersList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        order_no: searchParams.get('order_no') || '',
        account: searchParams.get('account') || '',
      },
      initialPage: parseInt(searchParams.get('page') || '1', 10),
      router,
      debounceTime: 100,
      debouncedFields: ['order_no'],
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

  const { data, error, isLoading, refetch } = useGetPurchaseOrdersQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  console.log('data', data);

  const columns: Column<PurchaseOrderType>[] = [
    {
      header: 'Order No',
      accessor: 'order_no',
      cell: (item: PurchaseOrderType) => (
        <span className="text-sm whitespace-normal break-words">
          {item?.order_no}
        </span>
      ),
    },
    {
      header: 'Total Amount',
      accessor: 'total_amount',
      cell: (item: PurchaseOrderType) => (
        <span>{formatCurrency(item.total_amount)}</span>
      ),
    },
    {
      header: 'Ordered On',
      accessor: 'created_on',
      cell: (item: PurchaseOrderType) => (
        <span>{CustomDate(item.created_on)}</span>
      ),
    },
    {
      header: 'Ordered By',
      accessor: 'created_by',
      cell: (item: PurchaseOrderType) => (
        <span>
          {item.created_by.first_name} {item.created_by.last_name}
        </span>
      ),
    },

    {
      header: 'Status',
      accessor: 'status',
      cell: (item: PurchaseOrderType) => (
        <span
          className={`text-sm px-2 py-1 rounded-md border ${
            item?.status === 'received'
              ? 'bg-green-100 text-green-500 border-green-500'
              : item?.status === 'approved'
                ? 'bg-blue-100 text-blue-500 border-blue-500'
                : item?.status === 'closed'
                  ? 'bg-red-100 text-red-500 border-red-500'
                  : item?.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-500 border-yellow-500'
                    : 'bg-gray-100 text-gray-500 border-gray-500'
          }`}
        >
          {item.status}
        </span>
      ),
    },

    {
      header: 'Actions',
      accessor: 'id',
      cell: (item: PurchaseOrderType) => (
        <div className="flex items-center space-x-2">
          {item.status === 'pending' && (
            <ReceiveOrder data={item} refetchData={refetch} />
          )}
        </div>
      ),
    },
  ];
  return (
    <div className=" w-full ">
      {/* Header */}
      <div className="mb-8 md:p-4 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Orders</h1>
        </div>
        <div className="">
          <Link
            href="/dashboard/procurement/orders/new-order"
            className="bg-green-600 text-white flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
          >
            <SlBasket className="text-sm text-white" />
            <span>Make New Order</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
        <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
          <GoSearch size={20} className="" />
          <input
            type="text"
            name="order_no"
            onChange={handleFilterChange}
            value={filters.order_no}
            placeholder="Search by order no"
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

export default OrdersList;
