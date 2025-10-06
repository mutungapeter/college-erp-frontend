'use client';

import Pagination from '@/components/common/Pagination';
import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';
import { useFilters } from '@/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import ActionModal from '@/components/common/Modals/ActionModal';
import NoData from '@/components/common/NoData';
import { toast } from 'react-toastify';

import {
  useDeleteCategoryUnitMutation,
  useGetCategoriesQuery,
} from '@/store/services/finance/inventoryService';
import Link from 'next/link';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import EditCategory from './EditCategory';
import NewCategory from './NewCategory';
import { CategoryType } from './types';
const Categories = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const [deleteCategoryUnit, { isLoading: isDeleting }] =
    useDeleteCategoryUnitMutation();
  const { filters, currentPage, handlePageChange } = useFilters({
    initialFilters: {
      category_type: searchParams.get('category_type') || '',
      category: searchParams.get('category') || '',
    },
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
  console.log('queryParams', queryParams);

  const { data, error, isLoading, refetch } = useGetCategoriesQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  console.log('data', data);

  const openActionModal = (id: number) => {
    setSelectedItem(id);
    setIsModalOpen(true);
  };

  const closeActionModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategoryUnit(selectedItem).unwrap();
      toast.success('Category successfully deleted!');
      closeActionModal();
      refetch();
    } catch (error: unknown) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log('errorData', errorData);
        toast.error(errorData.error || 'Error Deleting Category.');
      } else {
        toast.error('Unexpected Error occurred. Please try again.');
      }
    }
  };
  const columns: Column<CategoryType>[] = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (item: CategoryType) => (
        <span className="text-sm whitespace-normal break-words">
          {item.name}
        </span>
      ),
    },
    {
      header: 'Category Type',
      accessor: 'category_type_label',
      cell: (item: CategoryType) => <span>{item.category_type_label}</span>,
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (item: CategoryType) => <span>{item.description}</span>,
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (item: CategoryType) => (
        <span className="flex items-center space-x-2">
          <div>
            <EditCategory refetchData={refetch} data={item} />
          </div>
          <button
            title="Delete Category"
            className="group relative p-2 bg-red-100 text-red-500 rounded-md hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={() => openActionModal(item.id)}
          >
            <FiTrash2 className="w-4 h-4" />
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Delete Category
            </span>
          </button>
        </span>
      ),
    },
  ];
  return (
    <div className=" w-full ">
      {/* Header */}
      <Link
        href="/dashboard/inventory"
        className="flex items-center space-x-2 mb-7 text-sm text-gray-500 hover:text-blue-700"
      >
        <FiArrowLeft className="text-sm" />
        <span>Back To Inventory</span>
      </Link>
      <div className="mb-8 md:p-4 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
        </div>
        <div className="">
          <NewCategory refetchData={refetch} />
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
      <ActionModal
        isOpen={isModalOpen}
        onClose={closeActionModal}
        onDelete={handleDeleteCategory}
        isDeleting={isDeleting}
        confirmationMessage="Are you sure you want to delete this category?"
        deleteMessage="The category will be permanently deleted."
        title="Delete Category"
        actionText="Delete"
      />
    </div>
  );
};

export default Categories;
