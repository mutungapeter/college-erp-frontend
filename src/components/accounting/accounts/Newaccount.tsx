"use client";
import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";


import { Account_type } from "@/definitions/finance/accounts/main";
import { CashFlowOptions, CreateAccountFormData, createAccountSchema } from "@/schemas/finance/accounts/account";
import { useGetAccountTypesQuery, useNewAccountMutation } from "@/store/services/finance/accounting";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
type SchoolOption = {
  value: string;
  label: string;
};
interface Props {
  refetchData: () => void;
}
const NewAccount = ({ refetchData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [newAccount, { isLoading: isCreating }] =
    useNewAccountMutation();
  
  const { data: accountTypesData } = useGetAccountTypesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
 

  const {
    handleSubmit,
    reset,
    setValue,
    register,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
  });
  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const defaultValue = watch("is_default");
  const contraValue = watch("is_contra");
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };
  

  const handleProgrammeChange = (selected: SchoolOption | null) => {
    if (selected) {
      const accTypeId = Number(selected.value);
      setValue("account_type", accTypeId);
    }
  };
 const handleCashFlowSectionChange = (selected: LabelOptionsType | null) => {
    if (selected) {
      setValue("cash_flow_section", String(selected.value));
    }
  };
  const onSubmit = async (formData: CreateAccountFormData) => {
    console.log("submitting form data");

    console.log("payload", formData);
    try {
      const response = await newAccount(formData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Account Created Successfully");
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
      <button
        onClick={handleOpenModal}
        title="Add Fee Item"
        className="flex items-center max-w-fit space-x-2 p-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FiPlus className="text-md" />
        <span className="text-xs md:text-sm">New Account</span>
      </button>

      {isOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
            aria-hidden="true"
          />

          <div className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center justify-center overflow-y-auto p-2 md:p-3 pointer-events-none">
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
          overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
          w-full sm:max-w-c-500 md:max-w-500 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-4 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Add New Account
                  </p>
                  <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4   p-4 md:p-4 lg:p-4 "
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Account Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. Cash At Bank"
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Account Code<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. 20038."
                          {...register("account_code")}
                        />
                        {errors.account_code && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.account_code.message}
                          </p>
                        )}
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                     <label className="block space-x-1 text-sm font-medium mb-2">
                                        Account Type<span className="text-red-500">*</span>
                                      </label>
                    <Select
                      options={accountTypesData?.map((item: Account_type) => ({
                        value: item.id,
                        label: `${item.name}(${item.normal_balance})`,
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
                      onChange={handleProgrammeChange}
                    />

                    {errors.account_type && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.account_type.message}
                      </p>
                    )}
                  </div>
                    <div>
                                      <label className="block space-x-1 text-sm font-medium mb-2">
                                        Cashflow Section<span className="text-red-500">*</span>
                                      </label>
                                      <Select
                                        options={CashFlowOptions}
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
                                        onChange={handleCashFlowSectionChange}
                                      />
                  
                                      {errors.cash_flow_section && (
                                        <p className="text-red-500 text-sm mt-1">
                                          {errors.cash_flow_section.message}
                                        </p>
                                      )}
                                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="flex items-center space-x-2 mb-4">
                  <input
                      type="checkbox"
                      id="is_default"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      {...register("is_default")}
                    />
                    <label
                      htmlFor="closed"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      Default {defaultValue ? "(Yes)" : "(No)"}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                  <input
                      type="checkbox"
                      id="is_contra"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      {...register("is_contra")}
                    />
                    <label
                      htmlFor="is_contra"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      Contra {contraValue ? "(Yes)" : "(No)"}
                    </label>
                  </div>
                  </div>
                  <div className="sticky bottom-0 bg-white z-40 flex md:px-4  gap-4 md:justify-between items-center py-2 ">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-red-500 bg-white shadow-sm text-red-500 py-2 text-sm px-4 rounded-lg w-full min-w-[100px] md:w-auto hover:bg-red-500 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isCreating}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-lg w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isCreating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Submitting...</span>
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
export default NewAccount;
