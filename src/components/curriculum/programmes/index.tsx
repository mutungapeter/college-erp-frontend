"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import ActionModal from "@/components/common/Modals/ActionModal";
import FilterSelect from "@/components/common/Select";
import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { DepartmentType, ProgrammeType } from "@/definitions/curiculum";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetDepartmentsQuery } from "@/store/services/curriculum/departmentsService";
import { useDeleteProgrammeMutation, useGetProgrammesQuery } from "@/store/services/curriculum/programmesService";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { toast } from "react-toastify";
import EditProgramme from "./EditProgram";
import AddProgramme from "./NewProgram";
import Link from "next/link";

export type DepartmentOption = {
  value: string;
  label: string;
};

const Programmes = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProgramme, setSelectedProgramme] = useState<number | null>(null);
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        programme_name: searchParams.get("programme_name") || "",
        department: searchParams.get("department") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["programme_name"],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );

  const { data, isLoading, error, refetch } = useGetProgrammesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const { data:departments } = useGetDepartmentsQuery({}, {refetchOnMountOrArgChange: true,});
const [deleteProgramme, {isLoading:isDeleting}] = useDeleteProgrammeMutation();   
   console.log("departments", departments)
const departmentOptions = departments?.map((depart:DepartmentType) => ({
    value: depart.id, 
    label: depart.name,
  })) || [];

   const openDeleteModal = (prog_id: number) => {
    setSelectedProgramme(prog_id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProgramme(null);
  };
  const handleDepartmentChange = (selectedOption: DepartmentOption | null) => {
      handleFilterChange({
        department: selectedOption ? selectedOption.value : "",
      });
    };
 const handleDeleteProgram = async () => {
    try {
      await deleteProgramme(selectedProgramme).unwrap();
      toast.success("Programme Deleted successfully!");
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        toast.error(errorData.error || "Error Deleting Programme!.");
      } else {
        toast.error("Unexpected Error occured. Please try again.");
      }
    }
  };
  const columns: Column<ProgrammeType>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (prog: ProgrammeType) => <span>{prog.name}</span>,
    },
    {
      header: "Code",
      accessor: "code",
      cell: (prog: ProgrammeType) => (
        <span className="text-sm font-normal">{prog.code}</span>
      ),
    },
    {
      header: "School",
      accessor: "school",
      cell: (prog: ProgrammeType) => (
        <span className="text-sm font-normal">{prog.school.name}</span>
      ),
    },
    {
      header: "Department",
      accessor: "department",
      cell: (prog: ProgrammeType) => (
        <span>
          <span className="text-sm">{prog.department.name}</span>
        </span>
      ),
    },
    {
      header: "Level",
      accessor: "level",
      cell: (prog: ProgrammeType) => (
        <span>
          <span className="text-sm normal">{prog.level}</span>
        </span>
      ),
    },
   

   
    {
      header: "Actions",
      accessor: "id",
      cell: (prog: ProgrammeType) => (
        <div className="flex items-center justify-center space-x-2">
          <div>
            <EditProgramme data={prog} refetchData={refetch} />
          </div>
           <Link
                      href={`/dashboard/curriculum/programmes/${prog.id}`}
                      className="flex items-center justify-center p-2 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-500 hover:text-white transition duration-200 shadow-sm hover:shadow-md"
                      title="View  Details"
                    >
                      <FiEye className="text-sm" />
                    </Link>
          <div
                  onClick={()=>openDeleteModal(prog.id)}
                  className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer transition duration-200 shadow-sm"
            title="Delete"
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
          <h2 className="font-semibold text-black text-xl">All Programmes/Courses</h2>
          <div>
            <AddProgramme refetchData={refetch} />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="programme_name"
              value = {filters.programme_name}
              onChange={handleFilterChange}
              placeholder="Search by course/programme name"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
             <FilterSelect
            options={departmentOptions}
            value={departmentOptions.find(
              (option:DepartmentOption) => option.value === filters.department
            ) || { value: "", label: "All Departments" }}
            onChange={handleDepartmentChange}
            placeholder=""
            defaultLabel="All Departments"
          />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading Departments details. Please try again later.
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
              onDelete={handleDeleteProgram}
              isDeleting={isDeleting}
              confirmationMessage="Are you sure you want to Delete this Programme ?"
              deleteMessage="This action cannot be undone."
              title="Delete Programme"
              actionText="Delete Programme"
           />
      </div>
    </>
  );
};

export default Programmes;
