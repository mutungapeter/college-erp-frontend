"use client";

import Pagination from "@/components/common/Pagination";
import { useFilters } from "@/hooks/useFilters";
import { PAGE_SIZE } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import ActionModal from "@/components/common/Modals/ActionModal";
import NoData from "@/components/common/NoData";
import {
  useGetTendersQuery,
  useReopenApplicationMutation
} from "@/store/services/finance/procurementService";
import { formatCurrency } from "@/utils/currency";
import { YearMonthCustomDate } from "@/utils/date";
import { FiRepeat } from "react-icons/fi";
import { toast } from "react-toastify";
import CreateTender from "./NewTender";
import TenderApplication from "./TenderApplication";
import { TenderType } from "./types";

const Tenders = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const [reopenApplication, { isLoading: isUpdating }] =
    useReopenApplicationMutation();
  const { filters, currentPage, handlePageChange } =
    useFilters({
      initialFilters: {
        reference: searchParams.get("reference") || "",
        account: searchParams.get("account") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["reference"],
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

  const { data, error, isLoading, refetch } = useGetTendersQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log("data", data);

  const openActionModal = (id: number) => {
    setSelectedItem(id);
    setIsModalOpen(true);
  };

  const closeActionModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

 
  const handleReopenTender = async () => {
    try {
      await reopenApplication(selectedItem).unwrap();
      toast.success("Tender Reopened successfully deleted!");
      closeActionModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        toast.error(errorData.error || "Error Reopening Tender.");
      } else {
        toast.error("Unexpected Error occurred. Please try again.");
      }
    }
  };
  const columns: Column<TenderType>[] = [
    {
      header: "Title",
      accessor: "title",
      cell: (item: TenderType) => <span>{item.title}</span>,
    },
    {
      header: "Description",
      accessor: "description",
      cell: (item: TenderType) => (
        <span className="text-sm whitespace-normal break-words">
          {item.description}
        </span>
      ),
    },
    {
      header: "Tender Cost",
      accessor: "projected_amount",
      cell: (item: TenderType) => (
        <span>{formatCurrency(item.projected_amount)}</span>
      ),
    },

    {
      header: "Document",
      accessor: "tender_document",
      cell: (item: TenderType) =>
        item.tender_document ? (
          <a
            href={item.tender_document}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="text-blue-600 underline hover:text-blue-800 text-sm"
          >
            Download
          </a>
        ) : (
          <span className="text-gray-400 text-sm">No document</span>
        ),
    },

    {
      header: "Application Deadline",
      accessor: "deadline",
      cell: (item: TenderType) => (
        <span>{YearMonthCustomDate(item.deadline)}</span>
      ),
    },
    {
      header: "Duration",
      accessor: "start_date",
      cell: (item: TenderType) => (
        <span>
          {YearMonthCustomDate(item.start_date)} -{" "}
          {YearMonthCustomDate(item.end_date)}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (item: TenderType) => (
        <span
          className={`text-sm px-2 py-1 rounded-md border ${
            item?.status === "open"
              ? "bg-green-100 text-green-500 border-green-500"
              : item?.status === "awarded"
              ? "bg-blue-100 text-blue-500 border-blue-500"
              : item?.status === "closed"
              ? "bg-red-100 text-red-500 border-red-500"
              : item?.status === "pending"
              ? "bg-yellow-100 text-yellow-500 border-yellow-500"
              : "bg-gray-100 text-gray-500 border-gray-500"
          }`}
        >
          {item.status === "awarded"
            ? "Awarded"
            : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      ),
    },
    {
      header: "Awarded To",
      accessor: "award",
      cell: (item: TenderType) => (
        <span>{item?.award?.status === "awarded" ? item?.award?.vendor.name : "-"}</span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (item: TenderType) => (
        <div className="flex items-center space-x-2">
          {item.status === "open" ? (
            <TenderApplication refetchData={refetch} data={item} />
          ) : (
            <button
              onClick={() => openActionModal(item.id)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            >
              <FiRepeat className="text-lg" />
              Reopen
            </button>
          )}
        </div>
      ),
    },
  ];
  return (
    <div className=" w-full ">
      {/* Header */}
      <div className="mb-8 md:p-4 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tenders</h1>
          <p className="text-gray-600">All Tenders</p>
        </div>
        <div className="flex justify-between items-center gap-3 md:gap-5">
          <CreateTender refetchData={refetch} />
        </div>
      </div>
      {/* <div className="flex items-center md:justify-end lg:justify-end px-5">
        <div className="  w-full md:w-auto md:min-w-[40%]  ">
          <FilterSelect
            options={accountsOptions}
            value={
              accountsOptions.find(
                (option: LabelOptionsType) => option.value === filters.account
              ) || { value: "", label: "All Accounts" }
            }
            onChange={handleCohortChange}
            placeholder=""
            defaultLabel="All Accounts"
          />
        </div>
      </div> */}

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
        onDelete={handleReopenTender}
        isDeleting={isUpdating}
        confirmationMessage="Are you sure you want to Reopen this Tender?"
        deleteMessage="The Tender  will be revoked from the current vendor and reopened for new applications."
        title="Reopen Tender For applications"
        actionText="Reopen"
      />
    </div>
  );
};

export default Tenders;
