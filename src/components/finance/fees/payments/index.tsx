'use client';

import Pagination from '@/components/common/Pagination';

import { useFilters } from '@/hooks/useFilters';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import FilterSelect from '@/components/common/Select';
import { LabelOptionsType } from '@/definitions/Labels/labelOptionsType';
import { IntakeType } from '@/definitions/admissions';

import { ProgrammeCohortType } from '@/definitions/curiculum';
import { PaymentType } from '@/definitions/finance/fees/payments';
import { PAGE_SIZE } from '@/lib/constants';
import { useGetCohortsQuery } from '@/store/services/curriculum/cohortsService';
import { useGetDepartmentsQuery } from '@/store/services/curriculum/departmentsService';
import { useGetFeePaymentsQuery } from '@/store/services/finance/feesService';
import { formatCurrency } from '@/utils/currency';
import { CustomDate } from '@/utils/date';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { GoSearch } from 'react-icons/go';
import PayFees from './pay';

const FeesPayments = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        search: searchParams.get('search') || '',
        department: searchParams.get('department') || '',
        cohort: searchParams.get('cohort') || '',
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
    data: payementsData,
    isLoading,
    error,
    refetch,
  } = useGetFeePaymentsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log('payementsData', payementsData);

  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data: cohortsData } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  console.log('departmentsData', departmentsData);
  const departmentOptions =
    departmentsData?.map((item: IntakeType) => ({
      value: item.id,
      label: `${item.name}`,
    })) || [];
  const cohorthOptions =
    cohortsData?.map((item: ProgrammeCohortType) => ({
      value: item.id,
      label: `${item.name} ${item.current_year.name}`,
    })) || [];

  const handleDepartmentChange = (selectedOption: LabelOptionsType | null) => {
    const departmentValue = selectedOption ? selectedOption.value : '';
    handleFilterChange({
      department: departmentValue,
    });
  };
  const handleCohortChange = (selectedOption: LabelOptionsType | null) => {
    const cohortValue = selectedOption ? selectedOption.value : '';
    handleFilterChange({
      cohort: cohortValue,
    });
  };

  const columns: Column<PaymentType>[] = [
    {
      header: 'Name',
      accessor: 'student_name',
      cell: (item: PaymentType) => <span>{item.student_name}</span>,
    },
    {
      header: 'Reg No',
      accessor: 'student_reg_no',
      cell: (item: PaymentType) => (
        <span className="text-sm font-normal">{item.student_reg_no}</span>
      ),
    },
    {
      header: 'Payment Date',
      accessor: 'payment_date',
      cell: (item: PaymentType) => (
        <span>
          <span className="text-sm">{CustomDate(item.payment_date)}</span>
        </span>
      ),
    },

    {
      header: 'Amount Paid',
      accessor: 'amount',
      cell: (item: PaymentType) => (
        <span>
          <span className="text-sm">{formatCurrency(item.amount)}</span>
        </span>
      ),
    },

    {
      header: 'Payment Method',
      accessor: 'payment_method',
      cell: (item: PaymentType) => (
        <span>
          <span
            className={`text-xs font-normal px-2 py-1 rounded-md inline-flex items-center justify-center
          ${
            item.payment_method === 'Mpesa'
              ? 'bg-green-700 text-white'
              : item.payment_method === 'Cash'
                ? 'bg-gray-600 text-white'
                : item.payment_method === 'Bank   Transfer'
                  ? 'bg-blue-900 text-white'
                  : ''
          } 
         
          } 
            `}
          >
            {item.payment_method}
          </span>
        </span>
      ),
    },
  ];

  console.log('payementsData', payementsData);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-4  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">Payments</h2>
          <PayFees refetchData={refetch} />
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[50%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="search"
              onChange={handleFilterChange}
              value={filters.search}
              placeholder="Search by  reg no or phone no"
              className="w-full md:w-auto text-gray-900 md:min-w-[50%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
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
              onChange={handleDepartmentChange}
              placeholder=""
              defaultLabel="All Departments"
            />
            <FilterSelect
              options={cohorthOptions}
              value={
                cohorthOptions.find(
                  (option: LabelOptionsType) => option.value === filters.cohort,
                ) || { value: '', label: 'All Cohorts/Classes' }
              }
              onChange={handleCohortChange}
              placeholder=""
              defaultLabel="All Cohorts/Classes"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading payments records . Please try again later.
          </div>
        ) : payementsData && payementsData.results.length > 0 ? (
          <DataTable
            data={payementsData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {payementsData && payementsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={payementsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default FeesPayments;
