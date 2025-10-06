'use client';

import Pagination from '@/components/common/Pagination';
import { useFilters } from '@/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import NoData from '@/components/common/NoData';
import { useGetVendorPaymentsQuery } from '@/store/services/finance/procurementService';
import { formatCurrency } from '@/utils/currency';
import { CustomDate } from '@/utils/date';
import { VendorPaymentInterface } from '../../vendors/types';
import PayVendor from './PayVendor';

const VendorPayments = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handlePageChange } = useFilters({
    initialFilters: {
      reference: searchParams.get('reference') || '',
      account: searchParams.get('account') || '',
    },
    initialPage: parseInt(searchParams.get('page') || '1', 10),
    router,
    debounceTime: 100,
    debouncedFields: ['reference'],
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

  const { data, error, isLoading, refetch } = useGetVendorPaymentsQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  console.log('data', data);

  const columns: Column<VendorPaymentInterface>[] = [
    {
      header: 'Tender',
      accessor: 'tender_award',
      cell: (item: VendorPaymentInterface) => (
        <span>{item.tender_award.tender.title}</span>
      ),
    },
    {
      header: 'Vendor',
      accessor: 'vendor',
      cell: (item: VendorPaymentInterface) => (
        <span className="text-sm whitespace-normal break-words">
          {item.vendor.name}
        </span>
      ),
    },
    {
      header: 'Payment Method',
      accessor: 'payment_method',
      cell: (item: VendorPaymentInterface) => (
        <span>{item.payment_method}</span>
      ),
    },

    {
      header: 'Amount',
      accessor: 'amount',
      cell: (item: VendorPaymentInterface) => (
        <span>{formatCurrency(item.amount)}</span>
      ),
    },
    {
      header: 'Ref No',
      accessor: 'reference',
      cell: (item: VendorPaymentInterface) => <span>{item.reference}</span>,
    },
    {
      header: 'Paid On',
      accessor: 'created_on',
      cell: (item: VendorPaymentInterface) => (
        <span>{CustomDate(item.created_on)}</span>
      ),
    },
    {
      header: 'Paid By',
      accessor: 'paid_by',
      cell: (item: VendorPaymentInterface) => (
        <span>
          {item.paid_by.first_name} {item.paid_by.last_name} - (
          {item.paid_by.role.name})
        </span>
      ),
    },
  ];
  return (
    <div className=" w-full ">
      {/* Header */}
      <div className="mb-8 md:p-4 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vendor Payments
          </h1>
          {/* <p className="text-gray-600">All Tenders</p> */}
        </div>
        <div className="">
          <PayVendor refetchData={refetch} />
        </div>
      </div>
      {/* <div className="flex items-center md:justify-end lg:justify-end px-5">
        <div className="  w-full md:w-auto md:min-w-[40%]  ">
          <FilterSelect
            options={accountsOptions}
            value={
              accountsOptions.find(
                (option: LabelOptionsType) => option.value === filters.account
              ) || { value: "", label: "All Accounts" }
            }
            onChange={handleCohortChange}
            placeholder=""
            defaultLabel="All Accounts"
          />
        </div>
      </div> */}

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

export default VendorPayments;
