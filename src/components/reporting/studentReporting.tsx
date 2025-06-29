"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import Select from "react-select";

import { SemesterType } from "@/definitions/curiculum";

import { StudentDetailsType } from "@/definitions/students";
import {
  singleStudentReportingSchema,
  SingleStudentReportingType,
} from "@/schemas/curriculum/semesterReporting";
import { useGetSemestersQuery } from "@/store/services/curriculum/semestersService";
import { useSingelStudentSemesterReportingMutation } from "@/store/services/reporting/reportingService";
import { useGetStudentsQuery } from "@/store/services/students/studentsService";
type SchoolOption = {
  value: string;
  label: string;
};
const SingleStudentReporting = ({
  refetchData,
}: {
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isError, setIsError] = useState(false);

 const [singelStudentSemesterReporting, { isLoading: isCreating }] = useSingelStudentSemesterReportingMutation();

  const { data: semeestersData } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: studentsData } = useGetStudentsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<SingleStudentReportingType>({
    resolver: zodResolver(singleStudentReportingSchema),
    defaultValues: {
      semester: undefined,
      student: undefined,
    },
  });
  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const handleSemesterChange = (selected: SchoolOption | null) => {
    if (selected) {
      const semId = Number(selected.value);
      setValue("semester", semId);
    }
  };
  const handleStudentChange = (selected: SchoolOption | null) => {
    if (selected) {
      const studentId = Number(selected.value);
      setValue("student", studentId);
    }
  };

  const onSubmit = async (formData: SingleStudentReportingType) => {
    console.log("submitting form data");

    try {
      const response = await singelStudentSemesterReporting(formData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Student reported for new semster successfully!");
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
        setSuccessMessage("Unexpected error occured. Please try again.");
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
         items-center space-x-2 text-white px-2 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          <FiPlus className="text-lg" />
          <span className="text-xs font-medium">
            Report student to new semester
          </span>
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
            className="fixed inset-0 min-h-full   z-100 w-screen flex flex-col text-center md:items-center
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-xl  bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-450 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-3 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Report student to new semester
                  </p>
                  
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2  p-4 md:p-4 lg:p-4 "
                >
                  
                    <div>
                      <div>
                        <label>Student</label>
                        <Select
                          options={studentsData?.map(
                            (item: StudentDetailsType) => ({
                              value: item.id,
                              label: `${item.user.first_name} ${item.user.last_name} -  ${item.registration_number} `,
                            })
                          )}
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
                    </div>
                    <div>
                      <div>
                        <label>Semester Reporting To</label>
                        <Select
                          options={semeestersData?.map((item: SemesterType) => ({
                            value: item.id,
                            label: `${item.name} - ${item.academic_year}`,
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
                          onChange={handleSemesterChange}
                        />

                        {errors.semester && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.semester.message}
                          </p>
                        )}
                      </div>
                    </div>
                 

                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6  gap-4 md:justify-end items-center py-3 ">
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
export default SingleStudentReporting;
