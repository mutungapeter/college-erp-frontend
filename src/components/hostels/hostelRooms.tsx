"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import DataTable, { Column } from "@/components/common/Table/DataTable";

import { HostelRoomsType } from "@/definitions/hostels";
import { PAGE_SIZE } from "@/lib/constants";
import {
  useDeletHostelRoomMutation,
  useGetHostelRoomsQuery,
} from "@/store/services/hostels/hostelService";
import { formatCurrency } from "@/utils/currency";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { IoArrowBackOutline } from "react-icons/io5";
import ActionModal from "../common/Modals/ActionModal";
import SuccessFailModal from "../common/Modals/SuccessFailModal";
import AddRoom from "./NewHostelRoom";
import AddOccuppant from "./occupants/addOccupant";
import EditHostelRoom from "./UpdateHostelRoom";
interface Props {
  hostel_id: string;
}
const HostelRooms = ({ hostel_id }: Props) => {
  console.log("hostel_id");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        room_no: searchParams.get("room_no") || "",
        campus: searchParams.get("campus") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["room_no"],
    });

  const queryParams = useMemo(
    () => ({
      hostel_id,
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [hostel_id, currentPage, filters]
  );

  console.log("queryParams", queryParams);

  const {
    data: roomsData,
    isLoading,
    error,
    refetch,
  } = useGetHostelRoomsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteHostelROom, { isLoading: isRemoving }] =
    useDeletHostelRoomMutation();
  const openDeleteModal = (id: number) => {
    setSelectedRoom(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRoom(null);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    closeDeleteModal();
  };

  const handleRemoveRoom = async () => {
    try {
      await deleteHostelROom(selectedRoom).unwrap();
      setIsError(false);
      setSuccessMessage("Room deleted successfully!");
      closeDeleteModal();
      setShowSuccessModal(true);
      refetch();
    } catch (error: unknown) {
      setIsError(true);
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(errorData.error || "Error deleting room.");
        setShowSuccessModal(true);
      } else {
        setSuccessMessage("Unexpected error occurred. Please try again.");
        setShowSuccessModal(true);
      }
    }
  };

  console.log("roomsData", roomsData);

  const columns: Column<HostelRoomsType>[] = [
    {
      header: "Room No.",
      accessor: "room_number",
      cell: (item: HostelRoomsType) => (
        <span className="font-semibold text-sm">{item.room_number}</span>
      ),
    },
    {
      header: "Capacity",
      accessor: "room_capacity",
      cell: (item: HostelRoomsType) => (
        <span className="text-sm font-normal">{item.room_capacity}</span>
      ),
    },

    {
      header: "Cost",
      accessor: "hostel",
      cell: (item: HostelRoomsType) => (
        <span>
          <span className="text-sm font-nunito ">
            {formatCurrency(item.hostel.room_cost)}
          </span>
        </span>
      ),
    },
    {
      header: "Occupants",
      accessor: "students_assigned",
      cell: (item: HostelRoomsType) => (
        <span>
          <span className="text-sm normal">{item.students_assigned}</span>
        </span>
      ),
    },
    {
      header: "Occupancy",
      accessor: "occupancy",
      cell: (item: HostelRoomsType) => (
        <span>
          <span className="text-sm normal">{item.occupancy}</span>
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (item: HostelRoomsType) => (
        <span>
          <span
            className={`text-xs font-normal px-2 py-1 rounded-md
            ${
              item.status === "Fully Occupied"
                ? "text-red-500 bg-red-100"
                : "text-green-500 bg-green-100"
            }
            `}
          >
            {item.status}
          </span>
        </span>
      ),
    },

    {
      header: "Actions",
      accessor: "id",
      cell: (item: HostelRoomsType) => (
        <div className="flex items-center justify-center space-x-2">
          <EditHostelRoom data={item} refetchData={refetch} />
          <AddOccuppant data={item} refetchData={refetch} />

          <div
            onClick={() => openDeleteModal(item.id)}
            className="flex items-center justify-center cursor-pointer px-2 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-700 hover:text-white transition duration-200 shadow-sm hover:shadow-md"
            title=""
          >
            <FiTrash2 className="text-sm" />
          </div>

          <Link
            href={`/dashboard/hostels/rooms/${item.id}`}
            className="flex items-center justify-center px-2 py-1 text-xs font-medium rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-700 hover:text-white transition duration-200 shadow-sm hover:shadow-md"
            title=""
          >
            Occupants
          </Link>
        </div>
      ),
    },
  ];
  const selectedRoomData = roomsData?.results?.rooms?.find(
    (room: HostelRoomsType) => room.id === selectedRoom
  );

  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className="flex flex-col gap-3 p-3">
          <Link
            href="/dashboard/hostels"
            className="p-2 flex items-center gap-2 pb-3 border-b hover:text-blue-600"
          >
            <IoArrowBackOutline className="text-lg" />
            <span>Back to Hostels</span>
          </Link>
          <h2 className="text-2xl font-bold">
            {roomsData?.results?.hostel?.name || "Hostel"} - Rooms
          </h2>
        </div>

        <div className=" p-3  flex flex-col md:flex-row md:items-start lg:items-start md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-normal text-xs px-2 py-1 rounded-full bg-indigo-700 text-white w-fit">
              {roomsData?.results?.hostel?.campus?.name || "Campus"}
            </span>{" "}
            <small className="text-gray-600">
              {roomsData?.results?.hostel.campus?.city || "City"}
            </small>
            <div className="text-sm text-gray-700 md:text-base md:font-medium">
              Capacity: {roomsData?.results?.hostel?.capacity ?? "-"} People
            </div>
            <span> Rooms: {roomsData?.results.hostel?.rooms ?? "-"}</span>
          </div>

          <div>
            <AddRoom refetchData={refetch} data={roomsData?.results?.hostel} />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="room_no"
              onChange={handleFilterChange}
              value={filters.room_no}
              placeholder="Search by  room no"
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
            Error loading rooms . Please try again later.
          </div>
        ) : roomsData && roomsData.count > 0 ? (
          <DataTable
            data={roomsData?.results?.rooms || roomsData?.results || []}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {roomsData && roomsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={roomsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}

        <ActionModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleRemoveRoom}
          isDeleting={isRemoving}
          confirmationMessage={`Are you sure you want to delete this room ${selectedRoomData?.room_number} ? `}
          deleteMessage="This action cannot be undone."
          title="Delete Room"
          actionText="Delete"
        />
        {showSuccessModal && (
          <SuccessFailModal
            message={successMessage}
            onClose={handleCloseSuccessModal}
            isError={isError}
          />
        )}
      </div>
    </>
  );
};

export default HostelRooms;
