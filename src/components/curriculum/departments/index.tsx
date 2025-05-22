"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import ActionModal from "@/components/common/Modals/ActionModal";
import FilterSelect from "@/components/common/Select";
import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { DepartmentType, SchoolType } from "@/definitions/curiculum";
import { PAGE_SIZE } from "@/lib/constants";
import { useDeleteDepartmentMutation, useGetDepartmentsQuery } from "@/store/services/curriculum/departmentsService";
import { useGetSchoolsQuery } from "@/store/services/curriculum/schoolSService";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { toast } from "react-toastify";
import EditDepartment from "./EditDepart";
import AddDepartment from "./NewDeprt";
export type SchoolOption = {
  value: string;
  label: string;
};
const Departments = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        department_name: searchParams.get("department_name") || "",
        school: searchParams.get("school") || "",
        status: searchParams.get("status") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["department_name"],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );

  const { data, isLoading, error, refetch } = useGetDepartmentsQuery(queryParams, {refetchOnMountOrArgChange: true,});
  const { data:schools} = useGetSchoolsQuery({}, {refetchOnMountOrArgChange: true,});
const [deletDepartment, {isLoading:isDeleting}] = useDeleteDepartmentMutation();   
console.log("schools",schools)
  const schoolOptions = schools?.map((school:SchoolType) => ({
  value: school.id, 
  label: school.name,
})) || [];
   const openDeleteModal = (depart_id: number) => {
    setSelectedDepartment(depart_id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDepartment(null);
  };
 const handleDeleteCampus = async () => {
    try {
      await deletDepartment(selectedDepartment).unwrap();
      toast.success("Department Deleted successfully!");
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        toast.error(errorData.error || "Error Deleting Department!.");
      } else {
        toast.error("Unexpected Error occured. Please try again.");
      }
    }
  };
  const columns: Column<DepartmentType>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (depart: DepartmentType) => <span>{depart.name}</span>,
    },
    {
      header: "School",
      accessor: "school",
      cell: (depart: DepartmentType) => (
        <span className="text-sm font-normal">{depart.school.name}</span>
      ),
    },
    {
      header: "Office",
      accessor: "office",
      cell: (depart: DepartmentType) => (
        <span className="text-sm font-normal">{depart.office}</span>
      ),
    },
   
   
   
   
    {
      header: "Actions",
      accessor: "id",
      cell: (depart: DepartmentType) => (
        <div className="flex items-center justify-center space-x-2">
         <div>
          <EditDepartment
            department={depart}
            refetchData={refetch}
          />
         </div>
          <div
                  onClick={()=>openDeleteModal(depart.id)}
                  className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-blue-200 hover:text-red-700 cursor-pointer transition duration-200 shadow-sm"
            title="Delete department"
                >
                  <FiTrash2 className="text-sm" />
                </div>

       
        </div>
      ),
    },
  ];
  const handleSchoolChange = (selectedOption: SchoolOption | null) => {
    handleFilterChange({
      school: selectedOption ? selectedOption.value : "",
    });
  };
  console.log("data", data);
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">All Departments</h2>
        <div>
          <AddDepartment refetchData={refetch} />
        </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="department_name"
              onChange={handleFilterChange}
              placeholder="Search by department name"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
             <FilterSelect
            options={schoolOptions}
            value={schoolOptions.find(
              (option:SchoolOption) => option.value === filters.school
            ) || { value: "", label: "All Schools" }}
            onChange={handleSchoolChange}
            placeholder=""
            defaultLabel="All Schools"
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
              onDelete={handleDeleteCampus}
              isDeleting={isDeleting}
              confirmationMessage="Are you sure you want to Delete this Department ?"
              deleteMessage="This action cannot be undone."
              title="Delete Department"
              actionText="Delete Department"
           />
      </div>
    </>
  );
};

export default Departments;
