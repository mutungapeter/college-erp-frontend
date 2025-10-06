'use client';

import Pagination from '@/components/common/Pagination';
import { useFilters } from '@/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import ButtonDropdown from '@/components/common/ActionsPopover';
import ActionModal from '@/components/common/Modals/ActionModal';
import NoData from '@/components/common/NoData';
import { RolePermission } from '@/store/definitions';
import { useAppSelector } from '@/store/hooks';
import {
  useDeleteRoleMutation,
  useGetUserRolesQuery,
} from '@/store/services/permissions/permissionsService';
import { RootState } from '@/store/store';
import { YearMonthCustomDate } from '@/utils/date';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import CreateRole from './CreateRole';
import EditRole from './EditRole';
import { RoleType } from './types';

const Roles = () => {
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
      (permission) => permission.module.code === 'settings_settings',
    );
  }, [permissions]);

  // Permission checks
  const canCreate = accountsPermissions?.can_create ?? false;
  const canEdit = accountsPermissions?.can_edit ?? false;
  const canDelete = accountsPermissions?.can_delete ?? false;
  const hasActions = canEdit || canDelete;
  const {
    isLoading: loadingData,
    data: rolesData,
    refetch,
    error,
  } = useGetUserRolesQuery(queryParams, { refetchOnMountOrArgChange: true });
  const [deleteRole, { isLoading: deleting }] = useDeleteRoleMutation();
  const openDeleteModal = (id: number) => {
    setSelectedRole(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  console.log('rolesData', rolesData);
  const handleDeleteProgram = async () => {
    try {
      await deleteRole(selectedRole).unwrap();
      toast.success('Role Deleted successfully!');
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
  const columns: Column<RoleType>[] = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (item: RoleType) => <span>{item.name}</span>,
    },

    {
      header: 'Description',
      accessor: 'description',
      cell: (item: RoleType) => (
        <span>
          <span className="text-xs font-medium"> {item.description}</span>
        </span>
      ),
    },

    {
      header: 'Date Created',
      accessor: 'created_on',
      cell: (item: RoleType) => (
        <span>
          <span className="text-xs font-medium">
            {' '}
            {YearMonthCustomDate(item.created_on)}
          </span>
        </span>
      ),
    },

    ...(hasActions
      ? ([
          {
            header: 'Actions',
            accessor: 'id',
            cell: (item: RoleType) => (
              <>
                <ButtonDropdown>
                  {canEdit && <EditRole data={item} refetchData={refetch} />}
                  {canEdit && (
                    <button
                      className="flex items-center space-x-2 "
                      onClick={() =>
                        router.push(`/dashboard/settings?role=${item.id}`)
                      }
                    >
                      <FiEye className="text-lg" />
                      <span>View Permissions</span>
                    </button>
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
        ] as Column<RoleType>[])
      : []),
  ];
  // console.log("rolesData", rolesData);
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
              <CreateRole refetchData={refetch} />
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
        ) : rolesData && rolesData.results.length > 0 ? (
          <>
            <DataTable
              data={rolesData?.results}
              columns={columns}
              isLoading={loadingData}
              error={error}
              // columnBgColor="bg-gray-100 "
              stripedRows={true}
              stripeColor="bg-slate-100"
            />
          </>
        ) : (
          <NoData message="No roles data found" />
        )}

        {rolesData && rolesData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={rolesData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleDeleteProgram}
          isDeleting={deleting}
          confirmationMessage="Are you sure you want to Delete this Role ?"
          deleteMessage="Staff who had the Deleted Role won't be able to access the system anymore unless you assign a new role to them.This action cannot be undone."
          title="Delete Role"
          actionText="Delete"
        />
      </div>
    </>
  );
};

export default Roles;
