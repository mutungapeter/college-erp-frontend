"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { z } from "zod";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import Select from "react-select";

import IconButton from "@/components/common/IconButton";
import { IntakeType } from "@/definitions/admissions";
import { ProgrammeType, SemesterType } from "@/definitions/curiculum";
import { CohortStatusOptions, YearsOptions } from "@/lib/constants";
import { cohortSchema } from "@/schemas/curriculum/cohorts";
import { useGetIntakesQuery } from "@/store/services/admissions/admissionsService";
import { useCreateCohortMutation } from "@/store/services/curriculum/cohortsService";
import { useGetProgrammesQuery } from "@/store/services/curriculum/programmesService";
import { useGetSemestersQuery } from "@/store/services/curriculum/semestersService";
import ModalBottomButton from "@/components/common/StickyModalFooterButtons";
type SchoolOption = {
  value: string;
  label: string;
};
const AddCohort = ({ refetchData }: { refetchData: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isError, setIsError] = useState(false);

  const [createCohort, { isLoading: isCreating }] = useCreateCohortMutation();

  const { data: semeestersData } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: programmesData } = useGetProgrammesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: intakesData } = useGetIntakesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  type FormValues = z.infer<typeof cohortSchema>;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(cohortSchema),
    defaultValues: {
      name: "",
      programme: undefined,
      current_semester: undefined,
      intake: undefined,
      status: "",
      current_year: "",
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
      const semesterId = Number(selected.value);
      setValue("current_semester", semesterId);
    }
  };
  const handleIntakeChange = (selected: SchoolOption | null) => {
    if (selected) {
      const intakeId = Number(selected.value);
      setValue("intake", intakeId);
    }
  };

  const handleProgrammeChange = (selected: SchoolOption | null) => {
    if (selected) {
      const programmeId = Number(selected.value);
      setValue("programme", programmeId);
    }
  };
  const handleYearChange = (selected: SchoolOption | null) => {
    if (selected && selected.value) {
      setValue("current_year", String(selected.value));
    }
  };

  const handleStatusChange = (selected: SchoolOption | null) => {
    if (selected && selected.value) {
      setValue("status", String(selected.value));
    }
  };
  const onSubmit = async (formData: FormValues) => {
    console.log("submitting form data");

    try {
      const response = await createCohort(formData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Cohort added successfully!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to add Cohort: ${errorData.error}`);
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
      <IconButton
        onClick={handleOpenModal}
        title="Add New"
        label="New Cohort"
        icon={<FiPlus className="w-4 h-4" />}
        className="bg-primary-500 text-white px-4 py-2 hover:bg-primary-600 focus:ring-primary-500 focus:ring-offset-1"
      />

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
                    Add New Cohort/Class
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={20}
                      onClick={handleCloseModal}
                      className="text-gray-500  "
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2  p-4 md:p-4 lg:p-4 "
                >
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      placeholder="e.g SIT 2025"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                    <div>
                      <div>
                        <label>Programme</label>
                        <Select
                          options={programmesData?.map(
                            (prog: ProgrammeType) => ({
                              value: prog.id,
                              label: prog.name,
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
                          onChange={handleProgrammeChange}
                        />

                        {errors.programme && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.programme.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label>Current Semester</label>
                        <Select
                          options={semeestersData?.map((sem: SemesterType) => ({
                            value: sem.id,
                            label: sem.name,
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

                        {errors.current_semester && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.current_semester.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label>Inatake</label>
                        <Select
                          options={intakesData?.map((item: IntakeType) => ({
                            value: item.id,
                            label: `${item.name} (${new Date(
                              item.start_date
                            ).getFullYear()})`,
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
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Year
                      </label>
                      <Select
                        options={YearsOptions}
                        onChange={handleYearChange}
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
                      {errors.current_year && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.current_year.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Status
                    </label>
                    <Select
                      options={CohortStatusOptions}
                      onChange={handleStatusChange}
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
                    {errors.status && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.status.message}
                      </p>
                    )}
                  </div>

                      <ModalBottomButton
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                    isProcessing={isCreating}
                  />
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
export default AddCohort;
