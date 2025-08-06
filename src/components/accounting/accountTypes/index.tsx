"use client";

import Pagination from "@/components/common/Pagination";
import { Account_type } from "@/definitions/finance/accounts/main";
import { useFilters } from "@/hooks/useFilters";
import { PAGE_SIZE } from "@/lib/constants";
import {
    useDeleteFinAccountTypeMutation,
    useGetAccountTypesQuery
} from "@/store/services/finance/accounting";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import ActionModal from "@/components/common/Modals/ActionModal";
import { IoArchiveOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import UpdateFinanceAccountType from "./EditaccType";
import NewAccountType from "./NewaccType";

const AccountTypes = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedAcc, setSelectedAcc] = useState<number | null>(null);
  const [deleteFinAccountType, { isLoading: isDeleting }] =
    useDeleteFinAccountTypeMutation();
  const { filters, currentPage, handlePageChange } =
    useFilters({
      initialFilters: {
        search: searchParams.get("search") || "",
        account_type: searchParams.get("account_type") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["search"],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );
  console.log("queryParams", queryParams);

  const { data, isLoading, error, refetch } = useGetAccountTypesQuery(
    queryParams,
    { refetchOnMountOrArgChange: true }
  );
  const openDeleteModal = (id: number) => {
    setSelectedAcc(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedAcc(null);
  };

  const handleDeleteFinAccount = async () => {
    try {
      await deleteFinAccountType(selectedAcc).unwrap();
      toast.success("Account Type  successfully moved to archived folder!");
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        toast.error(
          errorData.error || "Error moving Account Type to archieved folder!."
        );
      } else {
        toast.error("Unexpected Error occured. Please try again.");
      }
    }
  };

  const columns: Column<Account_type>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (item: Account_type) => <span>{item.name}</span>,
    },
    {
      header: "Normal Balance",
      accessor: "normal_balance",
      cell: (item: Account_type) => (
        <span
          className={`
                ${
                  item.normal_balance === "debit"
                    ? "text-green-500"
                    : "text-red-500"
                }
                `}
        >
          {item.normal_balance}
        </span>
      ),
    },

    {
      header: "Actions",
      accessor: "id",
      cell: (item: Account_type) => (
        <div className="flex items-center  space-x-2">
          <UpdateFinanceAccountType refetchData={refetch} data={item} />
          <button
            title="Archive account type"
            className="group relative p-2 bg-red-100 text-red-500 rounded-md hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={() => openDeleteModal(item.id)}
          >
            <IoArchiveOutline className="w-4 h-4" />
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Archive account type
            </span>
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className=" w-full ">
      {/* Header */}
      <div className="mb-8 p-4 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Types
          </h1>
          <p className="text-gray-600">
            Manage and view all your accounting accounts types.
          </p>
        </div>
        <div className="flex justify-between items-center gap-3 md:gap-5">
          <div>
            <NewAccountType refetchData={refetch} />
          </div>
        </div>
      </div>
      <div className="w-full  p-1  font-nunito">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading account types . Please try again later.
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
          <div className="text-center text-gray-500 py-8">No data</div>
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
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteFinAccount}
        isDeleting={isDeleting}
        confirmationMessage="Are you sure you want to Archive this Account Type?"
        deleteMessage="This account Type will be archived and moved to archive section."
        title="Archive Account Type"
        actionText="Archive"
      />
    </div>
  );
};

export default AccountTypes;
