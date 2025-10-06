'use client';

import Pagination from '@/components/common/Pagination';

import { useFilters } from '@/hooks/useFilters';

import ButtonDropdown from '@/components/common/ActionsPopover';
import ActionModal from '@/components/common/Modals/ActionModal';
import NoData from '@/components/common/NoData';
import FilterSelect from '@/components/common/Select';
import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';
import { SemesterType } from '@/definitions/curiculum';
import { PAGE_SIZE, SemesterStatusOptions } from '@/lib/constants';
import { RolePermission } from '@/store/definitions';
import { useAppSelector } from '@/store/hooks';
import {
  useDeleteSemesterMutation,
  useGetSemestersQuery,
} from '@/store/services/curriculum/semestersService';
import { RootState } from '@/store/store';
import { YearMonthCustomDate } from '@/utils/date';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { GoSearch } from 'react-icons/go';
import { toast } from 'react-toastify';
import EditSemester from './EditSem';
import AddSemester from './NewSemester';
export type StatusOption = {
  value: string;
  label: string;
};

const Semesters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemeseter] = useState<number | null>(
    null,
  );
  const { user } = useAppSelector((state: RootState) => state.auth);

  const permissions: RolePermission[] = useMemo(() => {
    return user?.role?.permissions ?? [];
  }, [user?.role?.permissions]);
  console.log('permissions', permissions);
  const accountsPermissions = useMemo(() => {
    return permissions.find(
      (permission) => permission.module.code === 'academics_semesters',
    );
  }, [permissions]);
  const canCreate = accountsPermissions?.can_create ?? false;
  const canEdit = accountsPermissions?.can_edit ?? false;
  const canDelete = accountsPermissions?.can_delete ?? false;
  const hasActions = canEdit || canDelete;
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        status: searchParams.get('status') || '',
        semester_name: searchParams.get('semester_name') || '',
      },
      initialPage: parseInt(searchParams.get('page') || '1', 10),
      router,
      debounceTime: 100,
      debouncedFields: ['semester_name'],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters],
  );

  const { data, isLoading, error, refetch } = useGetSemestersQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [deleteSemester, { isLoading: isDeleting }] =
    useDeleteSemesterMutation();

  const openDeleteModal = (id: number) => {
    setSelectedSemeseter(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSemeseter(null);
  };
  const handleCohortsChange = (selectedOption: StatusOption | null) => {
    handleFilterChange({
      status: selectedOption ? selectedOption.value : '',
    });
  };
  const handleDeleteSemester = async () => {
    try {
      await deleteSemester(selectedSemester).unwrap();
      toast.success('Semester Deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log('errorData', errorData);
        toast.error(errorData.error || 'Error Deleting Semester!.');
      } else {
        toast.error('Unexpected Error occured. Please try again.');
      }
    }
  };
  const columns: Column<SemesterType>[] = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (item: SemesterType) => <span>{item.name}</span>,
    },
    {
      header: 'Academic Year',
      accessor: 'academic_year',
      cell: (item: SemesterType) => (
        <span className="text-sm font-normal">{item.academic_year.name}</span>
      ),
    },
    {
      header: 'Start Date',
      accessor: 'start_date',
      cell: (item: SemesterType) => (
        <span className="text-sm font-normal">
          {YearMonthCustomDate(item.start_date)}
        </span>
      ),
    },
    {
      header: 'End Date',
      accessor: 'end_date',
      cell: (item: SemesterType) => (
        <span>
          <span className="text-sm">{YearMonthCustomDate(item.end_date)}</span>
        </span>
      ),
    },

    {
      header: 'Status',
      accessor: 'status',
      cell: (cohort: SemesterType) => (
        <div className="flex items-center justify-center">
          <span
            className={`
            px-2 py-1 rounded-md font-normal text-xs  ${
              cohort.status === 'Active'
                ? 'bg-emerald-100 text-emerald-600'
                : cohort.status === 'Closed'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600'
            }`}
          >
            {cohort.status}
          </span>
        </div>
      ),
    },

    ...(hasActions
      ? ([
          {
            header: 'Actions',
            accessor: 'id',
            cell: (item: SemesterType) => (
              <>
                <ButtonDropdown>
                  {canEdit && (
                    <EditSemester data={item} refetchData={refetch} />
                  )}

                  {canDelete && (
                    <button
                      onClick={() => openDeleteModal(item.id)}
                      className="flex items-center space-x-2"
                    >
                      <FiTrash2 className="text-lg" />
                      <span className="text-red-600">Delete</span>
                    </button>
                  )}
                </ButtonDropdown>
              </>
            ),
          },
        ] as Column<SemesterType>[])
      : []),
  ];

  console.log('data', data);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">All Semesters</h2>
          <div>{canCreate && <AddSemester refetchData={refetch} />}</div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="semester_name"
              onChange={handleFilterChange}
              placeholder="Search by semester name"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={SemesterStatusOptions}
              value={
                SemesterStatusOptions.find(
                  (option: StatusOption) => option.value === filters.status,
                ) || { value: '', label: 'All' }
              }
              onChange={handleCohortsChange}
              placeholder=""
              defaultLabel="Filter by Status"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading Semesters. Please try again later.
          </div>
        ) : data && data.results.length > 0 ? (
          <DataTable
            data={data?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <NoData message="No semesters data found" />
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
          onDelete={handleDeleteSemester}
          isDeleting={isDeleting}
          confirmationMessage="Are you sure you want to Delete this Semester ?"
          deleteMessage="This action cannot be undone."
          title="Delete Semester"
          actionText="Delete Semester"
        />
      </div>
    </>
  );
};

export default Semesters;
