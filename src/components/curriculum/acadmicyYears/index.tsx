'use client';

import Pagination from '@/components/common/Pagination';
import { useFilters } from '@/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import NoData from '@/components/common/NoData';
import { FiTrash2 } from 'react-icons/fi';

import ButtonDropdown from '@/components/common/ActionsPopover';
import ActionModal from '@/components/common/Modals/ActionModal';
import { RolePermission } from '@/store/definitions';
import { useAppSelector } from '@/store/hooks';
import {
  useDeleteAcademicYearMutation,
  useGetAcademicYearsQuery,
} from '@/store/services/curriculum/academicYearsService';
import { RootState } from '@/store/store';
import { YearMonthCustomDate } from '@/utils/date';
import { toast } from 'react-toastify';
import EditAcadmicYear from './EditAcademicYear';
import NewAcadmicYear from './NewAcademicYear';
import { AcademicYearType } from './types';

const AcademicYears = () => {
  const searchParams = useSearchParams();

  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const permissions: RolePermission[] = useMemo(() => {
    return user?.role?.permissions ?? [];
  }, [user?.role?.permissions]);
  console.log('permissions', permissions);
  const { filters, currentPage, handlePageChange } = useFilters({
    initialFilters: {},
    initialPage: parseInt(searchParams.get('page') || '1', 10),
    router,
    debounceTime: 100,
    debouncedFields: [''],
  });
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters],
  );
  const accountsPermissions = useMemo(() => {
    return permissions.find(
      (permission) => permission.module.code === 'academics_academic_years',
    );
  }, [permissions]);

  // Permission checks
  const canCreate = accountsPermissions?.can_create ?? false;
  const canEdit = accountsPermissions?.can_edit ?? false;
  const canDelete = accountsPermissions?.can_delete ?? false;
  const hasActions = canEdit || canDelete;
  const {
    isLoading: loadingData,
    data: academicYearsData,
    refetch,
    error,
  } = useGetAcademicYearsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteAcadmicYear, { isLoading: deleting }] =
    useDeleteAcademicYearMutation();
  const openDeleteModal = (id: number) => {
    setSelectedRole(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  console.log('academicYearsData', academicYearsData);
  const handleDeleteProgram = async () => {
    try {
      await deleteAcadmicYear(selectedRole).unwrap();
      toast.success('Academic year Deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      // console.log("error", error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        // console.log("errorData", errorData);
        toast.error(errorData.error || 'Error Deleting Role!.');
      } else {
        toast.error('Unexpected Error occured. Please try again.');
      }
    }
  };
  const columns: Column<AcademicYearType>[] = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (item: AcademicYearType) => <span>{item.name}</span>,
    },

    {
      header: 'Start Date',
      accessor: 'start_date',
      cell: (item: AcademicYearType) => (
        <span>
          <span className="text-xs font-medium">
            {' '}
            {YearMonthCustomDate(item.start_date)}
          </span>
        </span>
      ),
    },
    {
      header: 'End Date',
      accessor: 'end_date',
      cell: (item: AcademicYearType) => (
        <span>
          <span className="text-xs font-medium">
            {' '}
            {YearMonthCustomDate(item.end_date)}
          </span>
        </span>
      ),
    },

    ...(hasActions
      ? ([
          {
            header: 'Actions',
            accessor: 'id',
            cell: (item: AcademicYearType) => (
              <>
                <ButtonDropdown>
                  {canEdit && (
                    <EditAcadmicYear data={item} refetchData={refetch} />
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
        ] as Column<AcademicYearType>[])
      : []),
  ];
  // console.log("academicYearsData", academicYearsData);
  return (
    <>
      <div
        className="bg-white w-full  
      rounded-lg font-inter"
      >
        <div
          className=" p-3  
        flex flex-col md:flex-row md:items-center 
        lg:items-center md:gap-0 lg:gap-0 gap-4 
        lg:justify-end md:justify-end"
        >
          {/* <h2 className="font-semibold text-black lg:text-xl md:text-lg text-sm ">
            Roles
          </h2> */}
          {canCreate && (
            <div>
              <NewAcadmicYear refetchData={refetch} />
            </div>
          )}
        </div>

        {loadingData ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            {'status' in error &&
            typeof error.data === 'object' &&
            error.data !== null &&
            'error' in error.data
              ? (error.data as { error: string }).error
              : 'An error occurred while fetching classes.'}
          </div>
        ) : academicYearsData && academicYearsData.results.length > 0 ? (
          <>
            <DataTable
              data={academicYearsData?.results}
              columns={columns}
              isLoading={loadingData}
              error={error}
              // columnBgColor="bg-gray-100 "
              stripedRows={true}
              stripeColor="bg-slate-100"
            />
          </>
        ) : (
          <NoData message="No academic years data found" />
        )}

        {academicYearsData && academicYearsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={academicYearsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleDeleteProgram}
          isDeleting={deleting}
          confirmationMessage="Are you sure you want to Delete this Academic year ?"
          deleteMessage="This action cannot be undone."
          title="Delete Academic Year"
          actionText="Delete"
        />
      </div>
    </>
  );
};

export default AcademicYears;
