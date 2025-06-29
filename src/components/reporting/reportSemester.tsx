"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import Select, { SingleValue } from "react-select";

import {
  ProgrammeCohortType,
  SemesterType
} from "@/definitions/curiculum";
import { semesterReportingSchema, SemesterReportingType } from "@/schemas/curriculum/semesterReporting";
import { useGetSemestersQuery } from "@/store/services/curriculum/semestersService";
import { useSemesterReportingMutation } from "@/store/services/reporting/reportingService";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";

const PromoteCohort = ({
    data,
  refetchData,
}: {
    data: ProgrammeCohortType;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isError, setIsError] = useState(false);

  const [semesterReporting, { isLoading: isUpdating }] = useSemesterReportingMutation();
  const { data: semeestersData } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
 


  const {

    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<SemesterReportingType>({
    resolver: zodResolver(semesterReportingSchema),
    defaultValues: {
      semester: undefined
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
    // handleCloseModal();
    refetchData();
  };

  const handleSemesterChange = ( selected: SingleValue<{ value: number | null; label: string }>) => {
    if (selected) {
      const semesterId = Number(selected.value);
      setValue("semester", semesterId);
    }
  };
   
const onSubmit = async (formData: SemesterReportingType) => {
  console.log("submitting form data", formData);
  console.log("submitting form data cohort ud", data?.id);

  try {
    const response = await semesterReporting({
      cohort_id: data.id,
      data: formData,
    }).unwrap();

    console.log("response", response);

    const total = response.total_students;
    const successful = response.successful_invoices;
    const failed = response.failed_invoice_details?.length || 0;
    const skipped = response.skipped_students?.count || 0;
    const skippedReason = response.skipped_students?.reason;

    setIsError(false);

    // Compose message
    let message = `Students reported: ${successful}/${total}`;
    if (failed > 0) {
      message += ` | Failed invoices: ${failed}`;
    }
    if (skipped > 0) {
      message += ` | Skipped: ${skipped} (${skippedReason})`;
    }

    setSuccessMessage(message);
    setShowSuccessModal(true);
    // refetchData();
  } catch (error: unknown) {
    console.log("error", error);
    setIsError(true);

    if (error && typeof error === "object" && "data" in error && error.data) {
      const errorData = (error as { data: { error: string } }).data;
      setSuccessMessage(errorData.error);
    } else {
      setSuccessMessage("Unexpected Error occurred. Please try again.");
    }

    setShowSuccessModal(true);
  }
};



  return (
    <>
      <div
        onClick={handleOpenModal}
        className="p-2 rounded-xl  text-blue-600 hover:bg-blue-200 hover:text-blue-700 cursor-pointer transition duration-200 shadow-sm"
        title="Edit Depart"
      >
        <VscGitPullRequestGoToChanges className="text-sm" />
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
                overflow-y-auto rounded-md  bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-3 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                Reporting for New Semester
                  </p>
                  
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2  p-4 md:p-4 lg:p-4 "
                >
                
                  <div>
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex md:items-center md:flex-row flex-col gap-2 text-sm text-blue-800">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Current:</span>
                            <span className="px-2 py-1 bg-blue-100 rounded">
                              {data?.current_semester?.name || "No current semester"}-{data?.current_semester?.academic_year}
                            </span>
                          </div>
                          
                        </div>
                        <p className="text-xs text-blue-600 mt-1 whitespace-normal break-words">
                          Select the next semester to report/promote this cohort to.
                        </p>
                      </div>

                      <div>
                        <label>Next Semester</label>
                        <Select
                          options={semeestersData?.map((item: SemesterType) => ({
                            value: item.id,
                            label: `${item.name}-${item.academic_year}-(${item.status})`,
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
                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6  gap-4 md:justify-between items-center py-3 ">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-gray-300 bg-white shadow-sm text-gray-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUpdating}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isUpdating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Reporting...</span>
                        </span>
                      ) : (
                        <span>Report</span>
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
export default PromoteCohort;
