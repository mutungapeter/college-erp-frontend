'use client';

import Pagination from '@/components/common/Pagination';
import { AccountInterface } from '@/definitions/finance/accounts/main';
import { useFilters } from '@/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import {
  useGetAccountsQuery,
  useGetTransactionsQuery,
} from '@/store/services/finance/accounting';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import NoData from '@/components/common/NoData';
import FilterSelect from '@/components/common/Select';
import { LabelOptionsType } from '@/definitions/Labels/labelOptionsType';
import { TransactionType } from '@/definitions/finance/accounts/transactions';
import { formatCurrency } from '@/utils/currency';
import { CustomDate } from '@/utils/date';
import { GoSearch } from 'react-icons/go';

const Transactions = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
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

  const { data, error, isLoading } = useGetTransactionsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const { data: accounts } = useGetAccountsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const accountsOptions =
    accounts?.map((item: AccountInterface) => ({
      value: item.id,
      label: `${item.name}-${item.account_code}(${item.account_type.normal_balance})`,
    })) || [];
  const handleCohortChange = (selectedOption: LabelOptionsType | null) => {
    handleFilterChange({
      account: selectedOption ? selectedOption.value : '',
    });
  };
  const columns: Column<TransactionType>[] = [
    {
      header: 'Account Name',
      accessor: 'account',
      cell: (item: TransactionType) => <span>{item.account.name}</span>,
    },
    {
      header: 'Account Code',
      accessor: 'account',
      cell: (item: TransactionType) => <span>{item.account.account_code}</span>,
    },
    {
      header: 'Amount',
      accessor: 'account',
      cell: (item: TransactionType) => (
        <span>{formatCurrency(item.amount)}</span>
      ),
    },

    {
      header: 'Reference',
      accessor: 'journal_info',
      cell: (item: TransactionType) => (
        <span className="text-sm">{item.journal_info.reference}</span>
      ),
    },
    {
      header: 'Transacation desc',
      accessor: 'journal_info',
      cell: (item: TransactionType) => (
        <span className="text-sm">{item.journal_info.description}</span>
      ),
    },
    {
      header: 'Transacation desc',
      accessor: 'journal_info',
      cell: (item: TransactionType) => (
        <span className="text-sm">{CustomDate(item.journal_info.date)}</span>
      ),
    },
    {
      header: 'Normal Balance',
      accessor: 'is_debit',
      cell: (item: TransactionType) => (
        <span>
          <span
            className={`
                ${item.is_debit === true ? 'text-green-500' : 'text-red-500'}
                `}
          >
            {item.is_debit ? 'Debit' : 'Credit'}
          </span>
        </span>
      ),
    },
  ];
  return (
    <div className=" w-full ">
      {/* Header */}
      <div className="mb-8 flex md:flex-row p-4 flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transactions
          </h1>
          <p className="text-gray-600">All transactions</p>
        </div>
        <div className="flex justify-between items-center gap-3 md:gap-5"></div>
      </div>
      <div className="flex items-center md:justify-end lg:justify-end px-5">
        <div className="  w-full md:w-auto md:min-w-[40%]  ">
          <FilterSelect
            options={accountsOptions}
            value={
              accountsOptions.find(
                (option: LabelOptionsType) => option.value === filters.account,
              ) || { value: '', label: 'All Accounts' }
            }
            onChange={handleCohortChange}
            placeholder=""
            defaultLabel="All Accounts"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
        <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
          <GoSearch size={20} className="" />
          <input
            type="text"
            name="reference"
            onChange={handleFilterChange}
            value={filters.reference}
            placeholder="Search by transaction reference no"
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

export default Transactions;
