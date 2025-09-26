"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import ActionModal from "@/components/common/Modals/ActionModal";
import FilterSelect from "@/components/common/Select";
import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { ProgrammeCohortType } from "@/definitions/curiculum";
import { CohortStatusOptions, PAGE_SIZE } from "@/lib/constants";
import {
  useDeleteCohortMutation,
  useGetCohortsQuery,
} from "@/store/services/curriculum/cohortsService";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { toast } from "react-toastify";
import UpdateCohort from "./EditCohort";
import AddCohort from "./NewCohort";
import PromoteCohort from "@/components/reporting/reportSemester";
export type ProgramOption = {
  value: string;
  label: string;
};
const Cohorts = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<number | null>(null);
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        name: searchParams.get("name") || "",
        status: searchParams.get("status") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["name"],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );

  const { data, isLoading, error, refetch } = useGetCohortsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteCohort, { isLoading: isDeleting }] = useDeleteCohortMutation();

  const openDeleteModal = (id: number) => {
    setSelectedCohort(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCohort(null);
  };
  const handleDeleteCohort = async () => {
    try {
      await deleteCohort(selectedCohort).unwrap();
      toast.success("Cohort Delete successfully!");
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        toast.error(errorData.error || "Error Deleting Cohort!.");
      } else {
        toast.error("Unexpected Error occured. Please try again.");
      }
    }
  };
  const columns: Column<ProgrammeCohortType>[] = [
    {
      header: "Cohort",
      accessor: "name",
      cell: (cohort: ProgrammeCohortType) => <span>{cohort.name} </span>,
    },
     {
      header: "Intake",
      accessor: "intake",
      cell: (cohort: ProgrammeCohortType) => (
        <span className="text-sm font-normal">{cohort?.intake?.name} ({new Date(cohort?.intake?.start_date).getFullYear()})</span>
      ),
    },
    {
      header: "programme",
      accessor: "programme",
      cell: (cohort: ProgrammeCohortType) => (
        <span className="text-sm font-normal whitespace-normal break-words">{cohort.programme.name}</span>
      ),
    },
    {
      header: "Current_year",
      accessor: "current_year",
      cell: (cohort: ProgrammeCohortType) => (
        <span className="text-sm font-normal">{cohort.current_year}</span>
      ),
    },
    {
      header: "Current semester",
      accessor: "current_semester",
      cell: (cohort: ProgrammeCohortType) => (
        <div className="flex items-center space-x-2">
          <span className="text-xs font-normal">
            {cohort.current_semester.name}
          </span>
          <span
            className={`text-xs font-normal px-2 ] rounded-full
    ${
      cohort.current_semester.status === "Active"
        ? "bg-green-100 text-green-600"
        : cohort.current_semester.status === "Closed"
        ? "bg-red-100 text-red-600"
        : "bg-yellow-100 text-yellow-600"
    }
  `}
          >
            {cohort.current_semester.status}
          </span>
        </div>
      ),
    },

    {
      header: "Status",
      accessor: "status",
      cell: (cohort: ProgrammeCohortType) => (
        <div className="flex items-center justify-center">
          <span
            className={`
            px-2 py-1 rounded-md font-normal text-xs  ${
              cohort.status === "Active"
                ? "bg-emerald-100 text-emerald-600"
                : cohort.status === "Graduated"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {cohort.status}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (cohort: ProgrammeCohortType) => (
        <div className="flex items-center justify-center space-x-2">
          <div>
            <UpdateCohort data={cohort} refetchData={refetch} />
          </div>
          <div
            onClick={() => openDeleteModal(cohort.id)}
            className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-blue-200 hover:text-red-700 cursor-pointer transition duration-200 shadow-sm"
            title="Edit Cohort"
          >
            <FiTrash2 className="text-sm" />
          </div>
          
        </div>
      ),
    },
  ];
  const handleStatusChange = (selectedOption: ProgramOption | null) => {
    handleFilterChange({
      status: selectedOption ? selectedOption.value : "",
    });
  };
  console.log("data", data);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">
            All Cohorts/Classes
          </h2>
          <div>
            <AddCohort refetchData={refetch} />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="name"
              onChange={handleFilterChange}
              placeholder="Search by cohort name"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={CohortStatusOptions}
              value={
                CohortStatusOptions.find(
                  (option) => option.value === filters.status
                ) || { value: "", label: "Filter by Status" }
              }
              onChange={handleStatusChange}
              placeholder="Filter by Status"
              defaultLabel="All"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading cohorts. Please try again later.
          </div>
        ) : data && data.results.length > 0 ? (
          <DataTable
            data={data?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
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

        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleDeleteCohort}
          isDeleting={isDeleting}
          confirmationMessage="Are you sure you want to Delete this Cohort ?"
          deleteMessage="This action cannot be undone."
          title="Delete Cohort"
          actionText="Delete Cohort"
        />
      </div>
    </>
  );
};

export default Cohorts;
