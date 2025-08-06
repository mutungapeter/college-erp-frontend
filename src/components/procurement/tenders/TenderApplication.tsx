"use client";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import {
  BusinessTypeOptions,
  tenderApplicationFormData,
  TenderApplicationSchema,
} from "@/schemas/procurement";
import { useCreateTenderApplicationMutation } from "@/store/services/finance/procurementService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { toast } from "react-toastify";
import { TenderType } from "./types";
interface Props {
  refetchData: () => void;
  data: TenderType; 
}

const TenderApplication = ({ refetchData, data }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [error, setError] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [createTenderApplication, { isLoading: isUploading }] = useCreateTenderApplicationMutation();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // setError("");
   
    reset();
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    closeModal();
  };

  const {
    reset,
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<tenderApplicationFormData>({
    resolver: zodResolver(TenderApplicationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

   const handleBusinessTypeChange = (selected: LabelOptionsType | null) => {
      if (selected) {
        setValue("business_type", String(selected.value));
      }
    };
  const onSubmit = async (formData: tenderApplicationFormData) => {
    const applicationData={
        tender: data.id,
        ...formData
    }
    console.log("applicationData", applicationData);
    try {
      const response = await createTenderApplication(applicationData).unwrap();
      console.log("response", response);

      setShowSuccessModal(true);
      setIsError(false);
      setSuccessMessage("Tender application submitted successfully!");
      refetchData();
      reset();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      // setError("Failed to submit tender application.");
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);

        const msg = errorData.error || "Failed to submit tender application.";
        setSuccessMessage(msg);
        setShowSuccessModal(true);
      } else {
        toast.error("Unexpected error occurred. Please try again.");
      }
    } finally {
      // setError("");
       refetchData();
      reset();
    }
  };

  return (
    <>
      <button
           onClick={openModal}
            title="Apply"
            className="flex items-center space-x-2 px-3 py-1 
        bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2
         focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"   >
            <HiOutlineDocumentPlus className="text-sm" />
            <span>Apply</span>
          </button>

      {isModalOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={closeModal}
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
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Apply for Tender
                  </p>
                  <IoCloseOutline size={20} className="cursor-pointer" onClick={closeModal} />
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 p-4 md:p-4 lg:p-4"
                >
               
            
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          {...register("company_name")}
                          placeholder="Enter company name"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        />
                        {errors.company_name && (
                          <p className="text-red-500 text-sm">{errors.company_name.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            {...register("email")}
                            placeholder="Enter email address"
                            className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            {...register("phone")}
                            placeholder="Enter phone number"
                            className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Address
                        </label>
                        <textarea
                          {...register("address")}
                          placeholder="Enter company address"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          rows={2}
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm">{errors.address.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Contact Person
                          </label>
                          <input
                            type="text"
                            {...register("contact_person")}
                            placeholder="Enter contact person name"
                            className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          />
                          {errors.contact_person && (
                            <p className="text-red-500 text-sm">{errors.contact_person.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Contact Person Phone
                          </label>
                          <input
                            type="tel"
                            {...register("contact_person_phone")}
                            placeholder="Enter contact person phone"
                            className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          />
                          {errors.contact_person_phone && (
                            <p className="text-red-500 text-sm">{errors.contact_person_phone.message}</p>
                          )}
                        </div>
                      </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Contact Person Email
                        </label>
                        <input
                          type="email"
                          {...register("contact_person_email")}
                          placeholder="Enter contact person email"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        />
                        {errors.contact_person_email && (
                          <p className="text-red-500 text-sm">{errors.contact_person_email.message}</p>
                        )}
                      </div>

                       <div>
                                      <label className="block space-x-1 text-sm font-medium mb-2">
                                       Business Type<span className="text-red-500">*</span>
                                      </label>
                                      <Select
                                        options={BusinessTypeOptions}
                                        menuPortalTarget={document.body}
                                        styles={{
                                          menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 9999,
                                          }),
                                          control: (base) => ({
                                            ...base,
                                            minHeight: "25px",
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
                                        onChange={handleBusinessTypeChange}
                                      />
                  
                                      {errors.business_type && (
                                        <p className="text-red-500 text-sm mt-1">
                                          {errors.business_type.message}
                                        </p>
                                      )}
                                    </div>
</div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Company Registration Number<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("company_registration_number")}
                            placeholder="Enter registration number"
                            className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          />
                          {errors.company_registration_number && (
                            <p className="text-red-500 text-sm">{errors.company_registration_number.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            KRA PIN<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("tax_pin")}
                            placeholder="Enter tax PIN"
                            className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          />
                          {errors.tax_pin && (
                            <p className="text-red-500 text-sm">{errors.tax_pin.message}</p>
                          )}
                        </div>
                      </div>
                    </>
                 

                  <div className="sticky bottom-0 bg-white z-40 flex md:px-4 gap-4 md:justify-between items-center py-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="border border-red-500 bg-white shadow-sm text-red-500 py-2 text-sm px-4 rounded-lg w-full min-w-[100px] md:w-auto hover:bg-red-500 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-lg w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isUploading ? (
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

export default TenderApplication;