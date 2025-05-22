"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import ActionModal from "@/components/common/Modals/ActionModal";
import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { StudyYearType } from "@/definitions/curiculum";
import { PAGE_SIZE } from "@/lib/constants";
import { useDeleteAcademicYearMutation, useGetAcademicYearsQuery } from "@/store/services/curriculum/academicYearsService";
import { CustomDate } from "@/utils/date";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { toast } from "react-toastify";
import EditStudyYear from "./Edit";
import AddNewStudyYear from "./New";



const StudyYears = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudyYear, setSelectedStudyYear] = useState<number | null>(null);
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        year_name: searchParams.get("year_name") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["year_name"],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );

  const { data, isLoading, error, refetch } = useGetAcademicYearsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  
const [deletAcademicYear, {isLoading:isDeleting}] = useDeleteAcademicYearMutation();   
 
   const openDeleteModal = (id: number) => {
    setSelectedStudyYear(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedStudyYear(null);
  };
  
 const handleDeleteAcademicYear = async () => {
    try {
      await deletAcademicYear(selectedStudyYear).unwrap();
      toast.success("Study Year Deleted successfully!");
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        toast.error(errorData.error || "Error Deleting Study Year!.");
      } else {
        toast.error("Unexpected Error occured. Please try again.");
      }
    }
  };
  const columns: Column<StudyYearType>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (item: StudyYearType) => <span>{item.name}</span>,
    },
    {
      header: "Added On",
      accessor: "created_on",
      cell: (item: StudyYearType) => (
        <span className="text-sm font-normal">{CustomDate(item.created_on)}</span>
      ),
    },
    
    
   
 
    {
      header: "Actions",
      accessor: "id",
      cell: (item: StudyYearType) => (
        <div className="flex items-center  space-x-2">
          
                <div>
                  <EditStudyYear  data={item} refetchData={refetch} />
                </div>
          <div
                  onClick={()=>openDeleteModal(item.id)}
                  className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-blue-200 hover:text-red-700 cursor-pointer transition duration-200 shadow-sm"
            title="Edit Cohort"
                >
                  <FiTrash2 className="text-sm" />
                </div>

       
        </div>
      ),
    },
  ];
 
  console.log("data", data);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">All Study Years</h2>
          <div>
            <AddNewStudyYear refetchData={refetch} />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="year_name"
              onChange={handleFilterChange}
              placeholder="Search by study year name"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
         
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading Study Years. Please try again later.
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
              onDelete={handleDeleteAcademicYear}
              isDeleting={isDeleting}
              confirmationMessage="Are you sure you want to Delete this Study Year ?"
              deleteMessage="This action cannot be undone."
              title="Delete Study Year"
              actionText="Delete "
           />
      </div>
    </>
  );
};

export default StudyYears;
