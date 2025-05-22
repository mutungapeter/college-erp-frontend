"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";

import { IoCloseOutline } from "react-icons/io5";

import { ApplicationType, IntakeType } from "@/definitions/admissions";
import { CampusType, ProgrammeType } from "@/definitions/curiculum";
import {
  StudentApplicationProgrammeInterestUpdate,
  updateProgrammeInterestSchema,
} from "@/schemas/admissions/main";
import {
  useGetIntakesQuery,
  useUpdateApplicationMutation,
} from "@/store/services/admissions/admissionsService";
import { useGetCampusesQuery } from "@/store/services/curriculum/campusService";
import { useGetProgrammesQuery } from "@/store/services/curriculum/programmesService";
import Select, { SingleValue } from "react-select";

type ApplicationOptionsType = {
  value: number | undefined;
  label: string | undefined;
};
const EditProgrammeInterest = ({
  data,
  refetchData,
}: {
  data: ApplicationType | null;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isError, setIsError] = useState(false);

  const [updateApplication, { isLoading: isUpdating }] =
    useUpdateApplicationMutation();
  const { data: programmesData } = useGetProgrammesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: intakesData } = useGetIntakesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: campusData } = useGetCampusesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  // type FormValues = z.infer<typeof updateProgrammeInterestSchema>;
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(updateProgrammeInterestSchema),
    defaultValues: {
      first_choice_programme: data?.first_choice_programme?.id || null,
      second_choice_programme: data?.second_choice_programme?.id || null,
      intake: data?.intake?.id || null,
      campus: data?.campus?.id || null,
    },
  });

  const handleFirstChoiceChange = (
    selected: SingleValue<ApplicationOptionsType>
  ) => {
    if (selected) {
      const first_choice_id = Number(selected.value);
      setValue("first_choice_programme", first_choice_id);
    }
  };
  const handleSecondChoiceChange = (
    selected: SingleValue<ApplicationOptionsType>
  ) => {
    if (selected) {
      const second_choice_id = Number(selected.value);
      setValue("second_choice_programme", second_choice_id);
    }
  };
  const handleIntakeChange = (
    selected: SingleValue<ApplicationOptionsType>
  ) => {
    if (selected) {
      const intakeId = Number(selected.value);
      setValue("intake", intakeId);
    }
  };
  const handleCampusChange = (
    selected: SingleValue<ApplicationOptionsType>
  ) => {
    if (selected) {
      const campusId = Number(selected.value);
      setValue("campus", campusId);
    }
  };

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

  const onSubmit = async (
    formData: StudentApplicationProgrammeInterestUpdate
  ) => {
    console.log("submitting form data for update", formData);
    console.log("data", formData);
    try {
      const response = await updateApplication({
        id: data?.id,
        data: formData,
      }).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Programme and Inatake info  updated successfully!");
      setShowSuccessModal(true);
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        setIsError(true);
        setSuccessMessage(
          "An error occured while updating Programme interest and intake info.Please try again!."
        );
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage("Unexpected error occured. Please try again.");
        setShowSuccessModal(true);
      }
    } finally {
      refetchData();
    }
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="px-3 py-1 rounded-lg inline-flex items-center space-x-3
         bg-blue-100 text-blue-600 hover:bg-blue-200
          hover:text-blue-700 cursor-pointer transition duration-200 shadow-sm"
        title="Edit Event"
      >
        <FiEdit className="text-sm" />
        <span>Edit</span>
      </div>

      {isOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            // onClick={handleCloseModal}
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
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-2 ">
                  <p className="text-sm md:text-lg lg:text-lg font-bold ">
                    Edit Program Interest Information
                  </p>

                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={25}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3 mt-2 p-3"
                >
                  <div>
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        First Choice Programme
                        <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={programmesData?.map((item: ProgrammeType) => ({
                          value: item.id,
                          label: `${item.name}(${item.level})`,
                        }))}
                        defaultValue={{
                          value: data?.first_choice_programme?.id,
                          label: data?.first_choice_programme?.name,
                        }}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        menuPosition="absolute"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: "44px",
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
                        onChange={handleFirstChoiceChange}
                      />

                      {errors.first_choice_programme && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.first_choice_programme.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Second Choice Programme
                        <span className="text-red-500"></span>
                      </label>
                      <Select
                        options={programmesData?.map((item: ProgrammeType) => ({
                          value: item.id,
                          label: `${item.name}(${item.level})`,
                        }))}
                        defaultValue={{
                          value: data?.second_choice_programme?.id,
                          label: data?.second_choice_programme?.name,
                        }}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        menuPosition="absolute"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: "44px",
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
                        onChange={handleSecondChoiceChange}
                      />

                      {errors.second_choice_programme && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.second_choice_programme.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Intake<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={intakesData?.map((item: IntakeType) => ({
                          value: item.id,
                          label: `${item.name} (${new Date(
                            item.start_date
                          ).toLocaleDateString()})`,
                        }))}
                        defaultValue={{
                          value: data?.intake?.id,
                          label: `${data?.intake?.name})`,
                        }}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        menuPosition="absolute"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: "44px",
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
                        onChange={handleIntakeChange}
                      />

                      {errors.intake && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.intake.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Campus Interested<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={campusData?.map((item: CampusType) => ({
                          value: item.id,
                          label: `${item.name}`,
                        }))}
                        defaultValue={{
                          value: data?.campus?.id,
                          label: `${data?.campus?.name})`,
                        }}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        menuPosition="absolute"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: "44px",
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
                        onChange={handleCampusChange}
                      />

                      {errors.campus && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.campus.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6 gap-4 md:justify-end items-center py-3">
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
                      className="bg-blue-500 text-white py-2 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isUpdating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          Updating
                        </span>
                      ) : (
                        <span>Update</span>
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
export default EditProgrammeInterest;
