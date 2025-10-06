'use client';

import Pagination from '@/components/common/Pagination';
import { useFilters } from '@/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import { FiTrash2 } from 'react-icons/fi';

import ButtonDropdown from '@/components/common/ActionsPopover';
import ActionModal from '@/components/common/Modals/ActionModal';
import { RolePermission } from '@/store/definitions';
import { useAppSelector } from '@/store/hooks';
import {
  useDeleteInvoiceTypeMutation,
  useGetInvoiceTypesQuery,
} from '@/store/services/finance/feesService';
import { RootState } from '@/store/store';
import { YearMonthCustomDate } from '@/utils/date';
import { getApiErrorMessage } from '@/utils/errorHandler';
import { toast } from 'react-toastify';
import { InvoiceType } from '../types';
import EditInvoiceType from './EditInvoiceType';
import NewInvoiceType from './NewInvoiceType';

const InvoiceTypes = () => {
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
      (permission) => permission.module.code === 'finance_fee_invoices',
    );
  }, [permissions]);

  // Permission checks
  const canCreate = accountsPermissions?.can_create ?? false;
  const canEdit = accountsPermissions?.can_edit ?? false;
  const canDelete = accountsPermissions?.can_delete ?? false;
  const hasActions = canEdit || canDelete;
  const {
    isLoading: loadingData,
    data: invoiceTypesData,
    refetch,
    error,
  } = useGetInvoiceTypesQuery(queryParams, { refetchOnMountOrArgChange: true });
  const [deleteInvoiceType, { isLoading: deleting }] =
    useDeleteInvoiceTypeMutation();
  const openDeleteModal = (id: number) => {
    setSelectedRole(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  console.log('invoiceTypesData', invoiceTypesData);
  const handleDelete = async () => {
    try {
      await deleteInvoiceType(selectedRole).unwrap();
      toast.success('Invoice type Deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  };
  const columns: Column<InvoiceType>[] = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (item: InvoiceType) => <span>{item.name}</span>,
    },

    {
      header: 'Status',
      accessor: 'is_active',
      cell: (item: InvoiceType) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
        ${
          item.is_active
            ? 'bg-green-100 text-green-600'
            : 'bg-red-100 text-red-600'
        }`}
        >
          {item.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },

    {
      header: 'Description',
      accessor: 'description',
      cell: (item: InvoiceType) => (
        <span>
          <span className="text-xs font-medium"> {item.description}</span>
        </span>
      ),
    },

    {
      header: 'Date Created',
      accessor: 'created_on',
      cell: (item: InvoiceType) => (
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
            cell: (item: InvoiceType) => (
              <>
                <ButtonDropdown>
                  {canEdit && (
                    <EditInvoiceType data={item} refetchData={refetch} />
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
        ] as Column<InvoiceType>[])
      : []),
  ];
  // console.log("invoiceTypesData", invoiceTypesData);
  return (
    <>
      <div className="bg-white w-full   rounded-lg font-inter">
        <div
          className=" p-3  flex flex-col md:flex-row 
        md:items-center lg:items-center md:gap-0
         lg:gap-0 gap-4 lg:justify-end md:justify-end"
        >
          {/* <h2 className="font-semibold text-black lg:text-xl md:text-lg text-sm ">
            Invoice Types
          </h2> */}
          {canCreate && (
            <div>
              <NewInvoiceType refetchData={refetch} />
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
        ) : invoiceTypesData && invoiceTypesData.results.length > 0 ? (
          <>
            <DataTable
              data={invoiceTypesData?.results}
              columns={columns}
              isLoading={loadingData}
              error={error}
              // columnBgColor="bg-gray-100 "
              stripedRows={true}
              stripeColor="bg-slate-100"
            />
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {invoiceTypesData && invoiceTypesData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={invoiceTypesData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleDelete}
          isDeleting={deleting}
          confirmationMessage="Are you sure you want to Delete this Invoice Type ?"
          deleteMessage="This action cannot be undone."
          title="Delete Invoice Type"
          actionText="Delete"
        />
      </div>
    </>
  );
};

export default InvoiceTypes;
