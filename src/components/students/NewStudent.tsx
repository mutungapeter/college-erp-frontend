"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { z } from "zod";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import {
  CampusType,
  ProgrammeCohortType,
  ProgrammeType,
} from "@/definitions/curiculum";
import { GenderOptions } from "@/lib/constants";
import { createStudentSchema } from "@/schemas/students/main";
import { useGetCampusesQuery } from "@/store/services/curriculum/campusService";
import { useGetCohortsQuery } from "@/store/services/curriculum/cohortsService";
import { useGetProgrammesQuery } from "@/store/services/curriculum/programmesService";
import { useCreateStudentMutation } from "@/store/services/students/studentsService";
import Select from "react-select";
import IconButton from "../common/IconButton";
import ModalBottomButton from "../common/StickyModalFooterButtons";

type SelectOption = {
  value: string | number;
  label: string;
};

type FormValues = z.infer<typeof createStudentSchema>;

const AdmitStudent = ({ refetchData }: { refetchData: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
  const { data: programmesData } = useGetProgrammesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: cohortsData } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: campusData } = useGetCampusesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createStudentSchema),
  });

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
  };

  const handleOpenModal = () => setIsOpen(true);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const handleGenderChange = (selected: SelectOption | null) => {
    if (selected && selected.value) {
      setValue("gender", String(selected.value));
    }
  };
  const handleProgrammeChange = (selected: SelectOption | null) => {
    if (selected) {
      const programmeId = Number(selected.value);
      setValue("programme", programmeId);
    }
  };
  const handleCohortChange = (selected: SelectOption | null) => {
    if (selected) {
      const cohortId = Number(selected.value);
      setValue("cohort", cohortId);
    }
  };
  const handleCampusChange = (selected: SelectOption | null) => {
    if (selected) {
      const campusId = Number(selected.value);
      setValue("campus", campusId);
    }
  };
  const onSubmit = async (formData: FormValues) => {
    console.log("submitting form data", formData);

    try {
      const response = await createStudent(formData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Student admitted successfully!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to admit Student: ${errorData.error}`);
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
      <IconButton
        onClick={handleOpenModal}
        title="Add New"
        label="New Student"
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
            className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center
           justify-start overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Admit New Student
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={30}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2 p-4 md:p-4 lg:p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          First Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. John"
                          {...register("first_name")}
                        />
                        {errors.first_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.first_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Last Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. Kamusukuti"
                          {...register("last_name")}
                        />
                        {errors.last_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.last_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Phone<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. 07xxxxxxxxx"
                          {...register("phone_number")}
                        />
                        {errors.phone_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone_number.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Email<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g user@example.com"
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Date of birth<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        {...register("date_of_birth")}
                      />
                      {errors.date_of_birth && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.date_of_birth.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Gender<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={GenderOptions}
                        onChange={handleGenderChange}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        menuPosition="absolute"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 999999,
                          }),
                          menu: (base) => ({
                            ...base,
                            position: "absolute",
                            width: "max-content",
                            minWidth: "100%",
                            minHeight: "50px",
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
                      />
                      {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Address<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. 123 Main St"
                          {...register("address")}
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.address.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Home town<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. 123 Main St"
                          {...register("city")}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Reg No<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g SIT-2023-0001"
                          {...register("registration_number")}
                        />
                        {errors.registration_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.registration_number.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Guardian Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g  John Kioko"
                          {...register("guardian_name")}
                        />
                        {errors.guardian_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.guardian_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Guardian Phone<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g 07xxxxxxxxx"
                          {...register("guardian_phone_number")}
                        />
                        {errors.guardian_phone_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.guardian_phone_number.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Programme<span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={programmesData?.map(
                            (item: ProgrammeType) => ({
                              value: item.id,
                              label: `${item.name}(${item.level})`,
                            })
                          )}
                          menuPortalTarget={document.body}
                          menuPlacement="auto"
                          // menuPosition="absolute"
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 10000,
                              overflow: "visible",
                              maxHeight: "300px",
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
                          onChange={handleProgrammeChange}
                        />

                        {errors.programme && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.programme.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Class<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={cohortsData?.map(
                          (item: ProgrammeCohortType) => ({
                            value: item.id,
                            label: `${item.name}(${item.current_year} - ${item.current_semester.name})`,
                          })
                        )}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        // menuPosition="absolute"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 10000,
                            overflow: "visible",
                            maxHeight: "300px",
                            paddingY: "20px",
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
                        onChange={handleCohortChange}
                      />

                      {errors.cohort && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cohort.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Campus<span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={campusData?.map((item: CampusType) => ({
                          value: item.id,
                          label: `${item.name}`,
                        }))}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        // menuPosition="absolute"
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

export default AdmitStudent;
