"use client";
import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloseOutline } from "react-icons/io5";
import { TbCalendarUser } from "react-icons/tb";

import { HostelRoomsType } from "@/definitions/hostels";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { StudentDetailsType } from "@/definitions/students";
import {
  addRoomOccupantSchema,
  AddRoomOccupantTye
} from "@/schemas/hostels/main";
import {
  useAddHostelRoomOccupantMutation
} from "@/store/services/hostels/hostelService";
import { useGetStudentsQuery } from "@/store/services/students/studentsService";

import Select from "react-select";
interface Props {
  data: HostelRoomsType;
  refetchData: () => void;
}
const AddOccuppant = ({ refetchData, data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [addHostelRoomOccupant, { isLoading: isCreating }] =
    useAddHostelRoomOccupantMutation();
    const { data: studentsData } = useGetStudentsQuery({}, { refetchOnMountOrArgChange: true });
    
  console.log("data", data);
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<AddRoomOccupantTye>({
    resolver: zodResolver(addRoomOccupantSchema),
    defaultValues: {
      student: undefined,
    },
  });

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
  };

  const handleOpenModal = () => setIsOpen(true);
const handleStudentChange = (selected: LabelOptionsType | null) => {
    if (selected) {
      const studentId = Number(selected.value);
      setValue("student", studentId);
    }
  };
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const onSubmit = async (formData: AddRoomOccupantTye) => {
    console.log("submitting form data", formData);
    const submissionData = {
    
      hostel_room: data.id,
      ...formData,
    };
    try {
      const response = await addHostelRoomOccupant(submissionData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Occupant   added successfully to the given room!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to add  occupant to the given  Room: ${errorData.error}`);
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
          className="bg-green-600 inline-flex cursor-pointer w-max 
         items-center space-x-2 rounded-xl text-white p-2  hover:bg-green-700 transition duration-300"
        >
          <TbCalendarUser className="text-sm" />
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
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-600 md:max-w-600 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Add New Room Occupant
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={30}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Hostel
                      </label>
                      <input
                        type="text"
                        value={`${data?.hostel.name}`}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>

                    

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Hostels Gender
                      </label>
                      <input
                        type="text"
                        value={data?.hostel.gender}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>
                   
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-2 mt-2 p-4 "
                >
                  <div>

                      <label>Student/Occupant</label>
                      <Select
                        options={studentsData?.map((item: StudentDetailsType) => ({
                          value: item.id,
                          label: `${item.user.first_name + " " + item.user.last_name} -  ${item.registration_number})`,
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
                        onChange={handleStudentChange}
                      />

                      {errors.student && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.student.message}
                        </p>
                      )}
  </div>
                  <div className="sticky bottom-0 bg-white z-40 flex space-x-3 gap-4 md:justify-end items-center py-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-gray-300 bg-white shadow-sm text-gray-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-gray-50"
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
                          <span>Adding...</span>
                        </span>
                      ) : (
                        <span>Add</span>
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

export default AddOccuppant;
