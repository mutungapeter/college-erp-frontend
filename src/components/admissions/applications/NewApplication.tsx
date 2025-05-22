"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { z } from "zod";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";

import { GenderOptions } from "@/lib/constants";
import { useGetProgrammesQuery } from "@/store/services/curriculum/programmesService";

import { IntakeType } from "@/definitions/admissions";
import {
  CampusType,
  ProgrammeType,
} from "@/definitions/curiculum";
import { applicationCreateSchema } from "@/schemas/admissions/main";
import { useGetIntakesQuery, useMakeApplicationMutation } from "@/store/services/admissions/admissionsService";
import { useGetCampusesQuery } from "@/store/services/curriculum/campusService";

type SelectOption = {
  value: string | number;
  label: string;
};

type FormValues = z.infer<typeof applicationCreateSchema>;

const CreateApplication = ({ refetchData }: { refetchData: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [makeApplication, { isLoading: isCreating }] = useMakeApplicationMutation();
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
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(applicationCreateSchema),
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
  

  
  const handleFirstChoiceChange = (selected: SelectOption | null) => {
    if (selected) {
      const programmeId = Number(selected.value);
      setValue("first_choice_programme", programmeId);
    }
  };
  
  const handleSecondChoiceChange = (selected: SelectOption | null) => {
    if (selected) {
      const programmeId = Number(selected.value);
      setValue("second_choice_programme", programmeId);
    }
  };
  
  const handleIntakeChange = (selected: SelectOption | null) => {
    if (selected) {
      const intakeId = Number(selected.value);
      setValue("intake", intakeId);
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
      const response = await makeApplication(formData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Application submitted successfully!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to submit application: ${errorData.error}`);
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
         items-center space-x-2 text-white px-2 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          <FiPlus className="text-lg" />
          <span className="text-xs font-medium">New Application</span>
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
           justify-start overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-600 md:max-w-600 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    New  Application
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
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Last Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. Smith"
                          {...register("last_name")}
                        />
                        {errors.last_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.last_name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Email<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. user@example.com"
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Phone Number<span className="text-red-500">*</span>
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
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Date of Birth
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
                    </div>
                
               
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          ID Number
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="National ID Number"
                          {...register("id_number")}
                        />
                        {errors.id_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.id_number.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Passport Number
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="If applicable"
                          {...register("passport_number")}
                        />
                        {errors.passport_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.passport_number.message}
                          </p>
                        )}
                      </div>
                    </div>
               
                    <h3 className="font-medium text-gray-700 mb-3">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Address
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
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. 10100"
                          {...register("postal_code")}
                        />
                        {errors.postal_code && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.postal_code.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. Nairobi"
                          {...register("city")}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. Kenya"
                          {...register("country")}
                        />
                        {errors.country && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.country.message}
                          </p>
                        )}
                      </div>
                    </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Guardian Name
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="Full name"
                          {...register("guardian_name")}
                        />
                        {errors.guardian_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.guardian_name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Guardian Relationship
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. Parent, Guardian"
                          {...register("guardian_relationship")}
                        />
                        {errors.guardian_relationship && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.guardian_relationship.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Guardian Email
                        </label>
                        <input
                          type="email"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. guardian@example.com"
                          {...register("guardian_email")}
                        />
                        {errors.guardian_email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.guardian_email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Guardian Phone
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. 07xxxxxxxxx"
                          {...register("guardian_phone_number")}
                        />
                        {errors.guardian_phone_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.guardian_phone_number.message}
                          </p>
                        )}
                      </div>
                    </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          First Choice Programme<span className="text-red-500">*</span>
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
                          onChange={handleFirstChoiceChange}
                        />
                        {errors.first_choice_programme && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.first_choice_programme.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Second Choice Programme
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
                          onChange={handleSecondChoiceChange}
                        />
                        {errors.second_choice_programme && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.second_choice_programme.message}
                          </p>
                        )}
                      </div>
                    </div> 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Intake<span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={intakesData?.map(
                            (item: IntakeType) => ({
                              value: item.id,
                              label: `${item.name} (${new Date(item.start_date).toLocaleDateString()})`,
                            })
                          )}
                          menuPortalTarget={document.body}
                          menuPlacement="auto"
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 10000,
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
                          <span>Submitting...</span>
                        </span>
                      ) : (
                        <span>Submit Application</span>
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

export default CreateApplication;