"use client";

import Pagination from "@/components/common/Pagination";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import DataTable, { Column } from "@/components/common/Table/DataTable";
import { useFilters } from "@/hooks/useFilters";
import { FiUserMinus } from "react-icons/fi";

import { PAGE_SIZE } from "@/lib/constants";
import {
  useGetHostelRoomOccupantsQuery,
  useRemoveHostelRoomOccupantMutation
} from "@/store/services/hostels/hostelService";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { GoSearch } from "react-icons/go";
import Link from "next/link";
import { StudentDetailsType } from "@/definitions/students";
import { toast } from "react-toastify";
import ActionModal from "@/components/common/Modals/ActionModal";
import { IoArrowBackOutline } from "react-icons/io5";
interface Props {
  room_id: string;
}
const HostelRoomOccupants = ({ room_id }: Props) => {
  console.log("room_id");
  const router = useRouter();
  const searchParams = useSearchParams();
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        reg_no: searchParams.get("reg_no") || "",
        campus: searchParams.get("campus") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["reg_no"],
    });

  const queryParams = useMemo(
    () => ({
      room_id,
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [room_id, currentPage, filters]
  );

  console.log("queryParams", queryParams);

  const {
    data: occupantsData,
    isLoading,
    error,
    refetch,
  } = useGetHostelRoomOccupantsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
 const [removeHostelRoomOccupant, {isLoading:isRemoving}] = useRemoveHostelRoomOccupantMutation()
  console.log("occupantsData", occupantsData);
 const openDeleteModal = (id: number) => {
    setSelectedStudent(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedStudent(null);
  };
 const handleRemoveOccupant = async () => {
  const submissionData = {
      student: selectedStudent,
      hostel_room: room_id,
    };
    try {
      await removeHostelRoomOccupant(submissionData).unwrap();
      toast.success("Occupant  Removed successfully!");
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        toast.error(errorData.error || "Error Removing occupant!.");
      } else {
        toast.error("Unexpected Error occured. Please try again.");
      }
    }
  };
  const columns: Column<StudentDetailsType>[] = [
    {
      header: "Student",
      accessor: "user",
    cell: (item: StudentDetailsType) => (
  <span className="font-semibold text-sm">
    {item?.user?.first_name ?? "-"} {item?.user?.last_name ?? ""}
  </span>
),
    },
    {
      header: "Reg No",
      accessor: "registration_number",
     cell: (item: StudentDetailsType) => (
  <span className="text-sm font-normal">{item.registration_number}</span>
),
    },

    {
      header: "Phone",
      accessor: "user",
      cell: (item: StudentDetailsType) => (
  <span className="text-sm font-nunito ">
    {item.user.phone_number}
  </span>
),
    },
    {
      header: "Email",
      accessor: "user",
      cell: (item: StudentDetailsType) => (
  <span className="text-sm normal">{item.user.email }</span>
),
    },
    {
      header: "Gender",
      accessor: "user",
      cell: (item: StudentDetailsType) => (
  <span className="text-sm normal">{item.user.gender}</span>
),
    },
    
    

    {
      header: "Actions",
      accessor: "id",
      cell: (item: StudentDetailsType) => (
        <div className="flex items-center justify-center space-x-2">
          
        
          <div
            onClick={() => openDeleteModal(item.id)}
            className="flex items-center cursor-pointer justify-center px-2 py-2 text-xs font-medium rounded-xl bg-red-100 text-red-600 hover:bg-red-700 hover:text-white transition duration-200 shadow-sm hover:shadow-md"
            title=""
          >
          <FiUserMinus className="text-sm" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className="flex flex-col gap-3 p-3">
        <Link href={`/dashboard/hostels/${occupantsData?.results?.room.hostel.id}`} className="p-2 flex items-center gap-2 pb-3 border-b hover:text-blue-600">
                  <IoArrowBackOutline className="text-lg" />
                  <span>Back to Rooms</span>
                </Link>
               
                </div>
        <div className=" p-3  flex flex-col md:flex-row md:items-start lg:items-start md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-extrabold  text-lg pb-2">
            Occupants
            </h2>
            
            <h2 className="font-bold  text-sm">
             <span className=" font-normal text-sm">Room No</span>: {occupantsData?.results?.room.room_number || "Room"}
            </h2>
            
            <small className=" rounded-md text-sm  font-bold ">
             <span className="  font-normal text-sm">Hostel:</span> {occupantsData?.results?.room.hostel.name || "Missing hostel"}
            </small>
            <div className="text-sm  md:text-base md:font-bold">
              <span className=" font-normal text-sm">Room Capacity: </span>{occupantsData?.results?.room.room_capacity ?? "-"}
            </div>
            <div className="text-sm  md:text-base md:font-bold">
              <span className=" font-normal text-sm">Available Spots: </span>{occupantsData?.results?.available_spots ?? "-"}
            </div>

          </div> 

       <div className="flex flex-col gap-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${occupantsData?.results.room?.status === "Fully Occupied" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {occupantsData?.results.room?.status || "-"}
        </span>
            {/* <AddRoom refetchData={refetch} data={occupantsData?.results?.hostel} /> */} 
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="reg_no"
              onChange={handleFilterChange}
              value={filters.reg_no}
              placeholder="Search by  reg no"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:bg-blue-100 focus:border-blue-600"
            />
          </div>
      
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading Books . Please try again later.
          </div>
        ) : occupantsData && occupantsData.count > 0 ? (
          <DataTable
            data={occupantsData?.results?.occupants || occupantsData?.results || []}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {occupantsData && occupantsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={occupantsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
        <ActionModal
                      isOpen={isDeleteModalOpen}
                      onClose={closeDeleteModal}
                      onDelete={handleRemoveOccupant}
                      isDeleting={isRemoving}
                      confirmationMessage="Are you sure you want to Remove this Occupant ?"
                      deleteMessage="This action cannot be undone."
                      title="Remove Occupant"
                      actionText="Remove"
                   />
      </div>
    </>
  );
};

export default HostelRoomOccupants;
