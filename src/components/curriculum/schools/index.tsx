"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import ActionModal from "@/components/common/Modals/ActionModal";
import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { SchoolType } from "@/definitions/curiculum";
import { PAGE_SIZE } from "@/lib/constants";
import { useDeleteSchoolMutation, useGetSchoolsQuery } from "@/store/services/curriculum/schoolSService";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { toast } from "react-toastify";
import EditSchool from "./EditSchool";
import AddSchool from "./NewSchool";
export type SchoolOption = {
  value: string;
  label: string;
};
const Schools = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        school_name: searchParams.get("school_name") || "",
        
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["school_name"],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );

  const { data, isLoading, error, refetch } = useGetSchoolsQuery(queryParams, {refetchOnMountOrArgChange: true,});
 
const [deletSchool, {isLoading:isDeleting}] = useDeleteSchoolMutation();   

 
   const openDeleteModal = (school_id: number) => {
    setSelectedSchool(school_id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSchool(null);
  };
 const handleDeleteSchool = async () => {
    try {
      await deletSchool(selectedSchool).unwrap();
      toast.success("School Deleted successfully!");
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        toast.error(errorData.error || "Error Deleting School!.");
      } else {
        toast.error("Unexpected Error occured. Please try again.");
      }
    }
  };
  const columns: Column<SchoolType>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (school: SchoolType) => <span>{school.name}</span>,
    },
    {
      header: "Email",
      accessor: "email",
      cell: (school: SchoolType) => (
        <span className="text-sm font-normal">{school.email}</span>
      ),
    },
    {
      header: "Phone",
      accessor: "phone",
      cell: (school: SchoolType) => (
        <span className="text-sm font-normal">{school.phone}</span>
      ),
    },
    {
      header: "Location",
      accessor: "location",
      cell: (school: SchoolType) => (
        <span className="text-sm font-normal">{school.location}</span>
      ),
    },
   
   
   
   
    {
      header: "Actions",
      accessor: "id",
      cell: (school: SchoolType) => (
        <div className="flex items-center justify-center space-x-2">
         <div>
          <EditSchool
            school={school}
            refetchData={refetch}
          />
         </div>
          <div
                  onClick={()=>openDeleteModal(school.id)}
                  className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-blue-200 hover:text-red-700 cursor-pointer transition duration-200 shadow-sm"
            title="Delete department"
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
          <h2 className="font-semibold text-black text-xl">All Schools</h2>
          <div>

            <AddSchool refetchData={refetch} />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="school_name"
              onChange={handleFilterChange}
              placeholder="Search by school name"
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
            Error loading departments. Please try again later.
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
              onDelete={handleDeleteSchool}
              isDeleting={isDeleting}
              confirmationMessage="Are you sure you want to Delete this Schoool ?"
              deleteMessage="This action cannot be undone."
              title="Delete School"
              actionText="Delete School"
           />
      </div>
    </>
  );
};

export default Schools;
