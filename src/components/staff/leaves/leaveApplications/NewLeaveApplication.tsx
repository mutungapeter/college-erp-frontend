"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import Select from "react-select";

import { LeaveTypeOptions } from "@/definitions/leaves";
import { StaffType } from "@/definitions/staff";
import {
  AdminLeaveApplicationSchema,
  AdminLeaveApplicationType,
} from "@/schemas/staff/leaves";
import { useCreateLeaveApplicationMutation } from "@/store/services/staff/leaveService";
import { useGetActiveStaffListQuery } from "@/store/services/staff/staffService";

type SelectOption = {
  value: string | number;
  label: string;
};

const NewLeaveRequest = ({ refetchData }: { refetchData: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [createLeaveApplication, { isLoading: isCreating }] =
    useCreateLeaveApplicationMutation();
  const { data: staffData } = useGetActiveStaffListQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<AdminLeaveApplicationType>({
    resolver: zodResolver(AdminLeaveApplicationSchema),
    defaultValues: {
      reason: "",
      start_date: "",
      end_date: "",
      staff: undefined,
      leave_type: "",
    },
  });

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
  };
  const handleLeaveTypeChange = (selected: SelectOption | null) => {
    if (selected && selected.value) {
      setValue("leave_type", String(selected.value));
    }
  };
  const handleOpenModal = () => setIsOpen(true);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const handleStaffChange = (selected: SelectOption | null) => {
    if (selected) {
      const staffId = Number(selected.value);
      setValue("staff", staffId);
    }
  };

  const onSubmit = async (formData: AdminLeaveApplicationType) => {
    console.log("submitting form data", formData);

    try {
      const response = await createLeaveApplication(formData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Leave request submitted successfully!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(errorData.error);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage("Unexpected error occurred. Please try again.");
        setShowSuccessModal(true);
      }
    }
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto"
      >
        <div
          className="bg-blue-600 inline-flex cursor-pointer w-max 
         items-center space-x-2 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition duration-300"
        >
          <FiPlus className="text-lg" />
          <span className="text-xs font-medium">New Leave Request</span>
        </div>
      </div>

      {isOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn"
            aria-hidden="true"
          ></div>

          <div
            className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-xl bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-450 md:max-w-450 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center md:mt-3 mt-2">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Request for a leave
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={20}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2 p-4 md:p-4 lg:p-4"
                >
                  <div>
                    <label>Staff</label>
                    <Select
                      options={staffData?.map((item: StaffType) => ({
                        value: item.id,
                        label: `${item.user.first_name} ${item.user.last_name}-${item.staff_number}`,
                      }))}
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        control: (base) => ({
                          ...base,
                          minHeight: "24px",
                          minWidth: "200px",
                          borderColor: "#d1d5db",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "#9ca3af",
                          },
                          "&:focus-within": {
                            borderColor: "#9ca3af",
                            boxShadow: "none",
                          },
                        }),
                      }}
                      onChange={handleStaffChange}
                    />

                    {errors.staff && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.staff.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Leave Type
                    </label>
                    <Select
                      options={LeaveTypeOptions}
                      onChange={handleLeaveTypeChange}
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        control: (base) => ({
                          ...base,
                          minHeight: "24px",
                          minWidth: "200px",
                          borderColor: "#d1d5db",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "#9ca3af",
                          },
                          "&:focus-within": {
                            borderColor: "#9ca3af",
                            boxShadow: "none",
                          },
                        }),
                      }}
                    />
                    {errors.leave_type && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.leave_type.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Start Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        {...register("start_date")}
                      />
                      {errors.start_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.start_date.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        End Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        {...register("end_date")}
                      />
                      {errors.end_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.end_date.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block space-x-1 text-sm font-normal mb-2">
                      Reason For Applying for Leave
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="reason"
                      {...register("reason")}
                      placeholder="Write here..."
                      className="w-full py-2 px-4  
                        text-sm md:text-lg font-normal border placeholder:text-sm  rounded-md focus:outline-none"
                      rows={2}
                      cols={50}
                    />
                    {errors.reason && (
                      <p className="text-red-500 text-sm">
                        {errors.reason.message}
                      </p>
                    )}
                  </div>

                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6 gap-4 md:justify-between items-center py-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-red-500 bg-white shadow-sm text-red-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-red-500 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isCreating}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isCreating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Submit...</span>
                        </span>
                      ) : (
                        <span>Submit</span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            </div>

            {showSuccessModal && (
              <SuccessFailModal
                message={successMessage}
                onClose={handleCloseSuccessModal}
                isError={isError}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NewLeaveRequest;
