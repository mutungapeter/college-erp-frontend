'use client';

import Pagination from '@/components/common/Pagination';

import { useFilters } from '@/hooks/useFilters';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import { Position } from '@/definitions/staff';
import { PAGE_SIZE } from '@/lib/constants';
import {
  useDeletePositionMutation,
  useGetPositionsQuery,
} from '@/store/services/staff/staffService';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import ButtonDropdown from '@/components/common/ActionsPopover';
import ActionModal from '@/components/common/Modals/ActionModal';
import { RolePermission } from '@/store/definitions';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { getApiErrorMessage } from '@/utils/errorHandler';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import EditPosition from './Edit';
import CreatePosition from './New';
const Positions = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
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
  });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters],
  );
  const {
    data: positionsData,
    isLoading,
    error,
    refetch,
  } = useGetPositionsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [deletePosition, { isLoading: deleting }] = useDeletePositionMutation();

  console.log('positionsData', positionsData);
  const accountsPermissions = useMemo(() => {
    return permissions.find(
      (permission) => permission.module.code === 'staff_hr_positions',
    );
  }, [permissions]);

  // Permission checks
  const canCreate = accountsPermissions?.can_create ?? false;
  const canEdit = accountsPermissions?.can_edit ?? false;
  const canDelete = accountsPermissions?.can_delete ?? false;
  const hasActions = canEdit || canDelete;
  const openDeleteModal = (id: number) => {
    setSelectedItem(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    try {
      await deletePosition(selectedItem).unwrap();
      toast.success('Position  Deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<Position>[] = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (item: Position) => <span>{item.name}</span>,
    },

    ...(hasActions
      ? ([
          {
            header: 'Actions',
            accessor: 'id',
            cell: (item: Position) => (
              <>
                <ButtonDropdown>
                  {canEdit && (
                    <EditPosition data={item} refetchData={refetch} />
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
        ] as Column<Position>[])
      : []),
  ];

  console.log('positionsData', positionsData);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">All Positions</h2>
          <div>{canCreate && <CreatePosition refetchData={refetch} />}</div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading data . Please try again later.
          </div>
        ) : positionsData && positionsData.results.length > 0 ? (
          <DataTable
            data={positionsData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {positionsData && positionsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={positionsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleDelete}
          isDeleting={deleting}
          confirmationMessage="Are you sure you want to Delete this Position ?"
          deleteMessage="This action cannot be undone."
          title="Delete Position"
          actionText="Delete"
        />
      </div>
    </>
  );
};

export default Positions;
