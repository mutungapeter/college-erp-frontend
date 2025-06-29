"use client";

import Pagination from "@/components/common/Pagination";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import DataTable, { Column } from "@/components/common/Table/DataTable";
import { useFilters } from "@/hooks/useFilters";

import { PAGE_SIZE } from "@/lib/constants";
import {
  useConfirmHostelRoomBookingMutation,
  useGetHostelRoomBookingsQuery,
  useGetHostelsQuery,
} from "@/store/services/hostels/hostelService";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { GoSearch } from "react-icons/go";

import ActionModal from "@/components/common/Modals/ActionModal";
import FilterSelect from "@/components/common/Select";
import { BookingType, HostelsType } from "@/definitions/hostels";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import CreateBooking from "./CreateBooking";
const Bookings = () => {
  console.log("room_id");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [modalType, setModalType] = useState<"update" | "cancel">("update");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        reg_no: searchParams.get("reg_no") || "",
        hostel: searchParams.get("hostel") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["reg_no"],
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

  const {
    data: bookingsData,
    isLoading,
    error,
    refetch,
  } = useGetHostelRoomBookingsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [confirmHostelRoomBooking, { isLoading: isUpdating }] =
    useConfirmHostelRoomBookingMutation();
  const { data: hostels } = useGetHostelsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const hostelsOptions =
    hostels?.map((item: HostelsType) => ({
      value: item.id,
      label: item.name,
    })) || [];

  const openUpdateModal = (id: number) => {
    setSelectedBooking(id);
    setModalType("update");
    setIsModalOpen(true);
  };

  const openCancelModal = (id: number) => {
    setSelectedBooking(id);
    setModalType("cancel");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const handleConfirmBooking = async () => {
    const data = {
      status: "Confirmed",
    };
    console.log(selectedBooking);
    try {
      
      if (selectedBooking) {
        await confirmHostelRoomBooking({ id: selectedBooking, data }).unwrap();
      }
      toast.success("Booking Confirmed  successfully!");
      closeModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);
 
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        toast.error(`Failed to Confrim booking: ${errorData.error}`);
       
      }
    }
  };

  const handleCancelBooking = async () => {
    const data = {
      status: "Cancelled",
    };
    try {
      if (selectedBooking) {
        await confirmHostelRoomBooking({ id: selectedBooking, data }).unwrap();
      }
      toast.success("Booking cancelled successfully!");
      closeModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);
 
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        toast.error(`Failed to Cancel booking: ${errorData.error}`);
       
      }
    }
  };
  console.log("selectedBooking", selectedBooking);
  const handleHostelChange = (selectedOption: LabelOptionsType | null) => {
    handleFilterChange({
      hostel: selectedOption ? selectedOption.value : "",
    });
  };
  const columns: Column<BookingType>[] = [
    {
      header: "Student",
      accessor: "student",
      cell: (item: BookingType) => (
        <span className="font-semibold text-sm">
          {item?.student?.user?.first_name ?? "-"}{" "}
          {item?.student?.user?.last_name ?? ""}
        </span>
      ),
    },
    {
      header: "Reg No",
      accessor: "student",
      cell: (item: BookingType) => (
        <span className="text-sm font-normal">
          {item.student.registration_number}
        </span>
      ),
    },

    {
      header: "Phone",
      accessor: "student",
      cell: (item: BookingType) => (
        <span className="text-sm font-nunito ">
          {item.student.user.phone_number}
        </span>
      ),
    },

    {
      header: "Gender",
      accessor: "student",
      cell: (item: BookingType) => (
        <span className="text-sm normal">{item.student.user.gender}</span>
      ),
    },
    {
      header: "Hostel",
      accessor: "hostel_room",
      cell: (item: BookingType) => (
        <span className="text-sm normal">{item.hostel_room.hostel.name}</span>
      ),
    },
    {
      header: "Room",
      accessor: "hostel_room",
      cell: (item: BookingType) => (
        <span className="text-sm normal">{item.hostel_room.room_number}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (item: BookingType) => (
        <span
          className={`
    text-xs font-medium px-2 py-1 rounded-md ${
      item.status === "Pending"
        ? "text-amber-500 bg-amber-100"
        : item.status === "Cancelled"
        ? "text-red-600 bg-red-100"
        : "text-green-500 bg-green-100"
    }
    `}
        >
          {item.status}
        </span>
      ),
    },

    {
      header: "Actions",
      accessor: "id",
      cell: (item: BookingType) => {
        const isConfirmed = item.status === "Confirmed";
        const isPendingCheckIn = item.status === "Pending";

        return (
          <div className="flex items-center justify-center space-x-2">
            {isConfirmed ? (
              <div className="flex items-center space-x-1 text-green-900">
                No Actions
              </div>
            ) : isPendingCheckIn ? (
              <>
                <button
                  onClick={() => openUpdateModal(item.id)}
                  className="bg-green-200 text-green-600 hover:bg-green-800 hover:text-white px-2 py-2 rounded-xl transition duration-300 flex items-center justify-center"
                  title="Confirm Booking"
                >
                  <FiCheck className="text-sm" />
                </button>

                <button
                  onClick={() => openCancelModal(item.id)}
                  className="bg-red-200 text-red-600 hover:bg-red-800 hover:text-white p-2 rounded-xl transition duration-300 flex items-center justify-center"
                  title="Cancel Booking"
                >
                  <FiX className="text-sm" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-1 text-green-900">
                No Actions
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-start lg:items-start md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-lg  md:text-xl">
              Hostel Rooms Bookings
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <CreateBooking refetchData={refetch}  />
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
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={hostelsOptions}
              value={
                hostelsOptions.find(
                  (option: LabelOptionsType) => option.value === filters.hostel
                ) || { value: "", label: "All Hostels" }
              }
              onChange={handleHostelChange}
              placeholder=""
              defaultLabel="All Hostels"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading Bookings . Please try again later.
          </div>
        ) : bookingsData && bookingsData.count > 0 ? (
          <DataTable
            data={bookingsData?.results || bookingsData?.results || []}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {bookingsData && bookingsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={bookingsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
        {isModalOpen && (
          <ActionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onDelete={
              modalType === "update"
                ? handleConfirmBooking
                : modalType === "cancel"
                ? handleCancelBooking
                : () => {}
            }
            confirmationMessage={
              modalType === "update"
                ? "Are you sure you want to confirm this booking and assign student to the booked room?"
                : "Are you sure you want to cancel this booking?"
            }
            deleteMessage={
              modalType === "update"
                ? "This will assigned the  student to the room and hostel payment invoice  will be generated for the student and included in fee statement."
                : "This will cancel the booking and release the room for other students."
            }
            isDeleting={isUpdating}
            title={
              modalType === "update"
                ? "Confirm  Booking "
                : modalType === "cancel"
                ? "Cancel Booking"
                : "Confirm Booking"
            }
            actionText={
              modalType === "update"
                ? "Confirm Booking"
                : modalType === "cancel"
                ? "Cancel Booking"
                : "Confirm Booking"
            }
            actionType={
              modalType === "update"
                ? "create"
                : modalType === "cancel"
                ? "cancel"
                : "create"
            }
          />
        )}
      </div>
    </>
  );
};

export default Bookings;
