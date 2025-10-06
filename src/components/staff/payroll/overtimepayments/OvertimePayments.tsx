'use client';

import { useFilters } from '@/hooks/useFilters';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import ActionModal from '@/components/common/Modals/ActionModal';
import FilterSelect from '@/components/common/Select';
import { LabelOptionsType } from '@/definitions/Labels/labelOptionsType';
import { IntakeType } from '@/definitions/admissions';
import { OvertimePaymentType } from '@/definitions/payroll';
import { PAGE_SIZE } from '@/lib/constants';
import { useGetDepartmentsQuery } from '@/store/services/curriculum/departmentsService';
import {
  useApproveOvertimePaymentMutation,
  useGetOvertimePaymentsQuery,
} from '@/store/services/staff/staffService';
import { formatCurrency } from '@/utils/currency';
import { YearMonthCustomDate } from '@/utils/date';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { GoSearch } from 'react-icons/go';
import { toast } from 'react-toastify';
import UpdateOvertimePayment from './EditOvertimePayment';
import CreateOvertimePayment from './NewOvertimePayment';
import Pagination from '@/components/common/Pagination';

const OvertimePayments = () => {
  const [modalType, setModalType] = useState<'submit' | 'accept' | 'update'>(
    'submit',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [overtimeId, setOvertimeId] = useState<number | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        search: searchParams.get('search') || '',
        period_start: searchParams.get('period_start') || '',
        period_end: searchParams.get('period_end') || '',
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

  const [approveOvertimePayment, { isLoading: isUpdating }] =
    useApproveOvertimePaymentMutation();
  const {
    data: overtimePayments,
    isLoading,
    error,
    refetch,
  } = useGetOvertimePaymentsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const openApproveModal = (id: number) => {
    setModalType('accept');
    setOvertimeId(id);
    setIsModalOpen(true);
  };

  const openDisapproveModal = (id: number) => {
    setModalType('submit');
    setOvertimeId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleApiError = (error: unknown, action: string) => {
    console.log('error', error);
    if (error && typeof error === 'object' && 'data' in error && error.data) {
      const errorData = (error as { data: { error: string } }).data;
      toast.error(errorData.error || `Error ${action} overtime payment!`);
    } else {
      toast.error('Unexpected error occurred. Please try again.');
    }
  };

  const handleApproveOvertimePayments = async () => {
    const data = {
      approved: true,
    };
    try {
      await approveOvertimePayment({ id: overtimeId, data }).unwrap();
      toast.success('Approved overtime payments successfully!');
      closeModal();
      refetch();
    } catch (error: unknown) {
      handleApiError(error, 'approving');
    }
  };

  const handleDisapproveOvertimePayments = async () => {
    const data = {
      approved: false,
    };
    try {
      await approveOvertimePayment({ id: overtimeId, data }).unwrap();
      toast.success(
        'Updated the overtime payment status to pending successfully!',
      );
      closeModal();
      refetch();
    } catch (error: unknown) {
      handleApiError(error, 'updating');
    }
  };

  const departmentOptions =
    departmentsData?.map((item: IntakeType) => ({
      value: item.id,
      label: `${item.name}`,
    })) || [];

  const handleIntakeChange = (selectedOption: LabelOptionsType | null) => {
    const departmentValue = selectedOption ? selectedOption.value : '';
    handleFilterChange({
      department: departmentValue,
    });
  };

  const columns: Column<OvertimePaymentType>[] = [
    {
      header: 'Name',
      accessor: 'staff',
      cell: (item: OvertimePaymentType) => (
        <span className="text-sm whitespace-normal break-words">
          {item.staff.user.first_name} {item.staff.user.last_name} (
          {item.staff.staff_number})
        </span>
      ),
    },
    {
      header: 'Rate Per Hour',
      accessor: 'rate_per_hour',
      cell: (item: OvertimePaymentType) => (
        <span className="text-xs font-semibold">
          {formatCurrency(item.rate_per_hour)} per hour
        </span>
      ),
    },
    {
      header: 'Hours',
      accessor: 'hours',
      cell: (item: OvertimePaymentType) => (
        <span>
          <span className="text-xs font-bold">{item.hours} hrs</span>
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
      cell: (item: OvertimePaymentType) => (
        <span>
          <span className="text-xs font-bold">
            {YearMonthCustomDate(item.date)}
          </span>
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'approved',
      cell: (item: OvertimePaymentType) => (
        <div className="flex items-center space-x-2">
          <span
            className={`
          text-xs border font-medium w-fit flex px-2 py-1 rounded-md 
          ${
            item.approved === true
              ? 'text-green-500 border-green-500 bg-green-100'
              : item.approved === false
                ? 'text-yellow-500 border-yellow-500 bg-yellow-100'
                : 'text-white bg-gray-500'
          }
        `}
          >
            {item.approved === true
              ? 'Approved'
              : item.approved === false
                ? 'Pending'
                : 'Unknown'}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (item: OvertimePaymentType) => (
        <div className="flex items-center space-x-2">
          <UpdateOvertimePayment refetchData={refetch} data={item} />
          {item.approved === true ? (
            <button
              onClick={() => openDisapproveModal(item.id)}
              className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Disapprove
            </button>
          ) : item.approved === false ? (
            <button
              onClick={() => openApproveModal(item.id)}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Approve
            </button>
          ) : (
            <div className="text-xs text-gray-500">No actions available</div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white w-full p-1 shadow-md rounded-lg font-nunito">
        <div className="p-3 flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">
            Overtime Payments
          </h2>
          <div>
            <CreateOvertimePayment refetchData={refetch} />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row space-x-4 md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[60%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="search"
              onChange={handleFilterChange}
              value={filters.search}
              placeholder="Search by staff no or phone no"
              className="w-full md:w-auto text-gray-900 md:min-w-[60%] text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>

          <div className="flex flex-col gap-3 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
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
            Error loading overtime records. Please try again later.
          </div>
        ) : overtimePayments && overtimePayments.results.length > 0 ? (
          <DataTable
            data={overtimePayments?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
            columnBgColor="bg-gray-100"
            stripedRows={true}
            stripeColor="bg-slate-100"
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}
        {overtimePayments && overtimePayments.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={overtimePayments.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {isModalOpen && (
        <ActionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onDelete={
            modalType === 'accept'
              ? handleApproveOvertimePayments
              : modalType === 'submit'
                ? handleDisapproveOvertimePayments
                : () => {}
          }
          isDeleting={isUpdating}
          title={
            modalType === 'accept'
              ? 'Approve Overtime Payment'
              : modalType === 'submit'
                ? 'Disapprove Payment'
                : 'Update Payment'
          }
          confirmationMessage={
            modalType === 'accept'
              ? 'Are you sure you want to approve this overtime payment?'
              : modalType === 'submit'
                ? 'Are you sure you want to set this overtime payment status to pending?'
                : 'Are you sure you want to update this payment?'
          }
          deleteMessage={
            modalType === 'accept'
              ? 'This will approve the overtime payment for processing.'
              : modalType === 'submit'
                ? 'This will change the payment status from approved to pending.'
                : 'This action will modify the payment details.'
          }
          actionText={
            modalType === 'accept'
              ? 'Approve Payment'
              : modalType === 'submit'
                ? 'Disapprove Payment'
                : 'Update Payment'
          }
          actionType={modalType === 'submit' ? 'update' : 'submit'}
        />
      )}
    </>
  );
};

export default OvertimePayments;
