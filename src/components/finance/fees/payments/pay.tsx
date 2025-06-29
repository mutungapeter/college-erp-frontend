"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import Select from "react-select";

import {
  InvoiceType,
  paymentMethodOptions,
} from "@/definitions/finance/fees/invoices";
import { FeesPaymentSchema, FeesPaymentType } from "@/schemas/finance/fees";
import { usePayFeesMutation } from "@/store/services/finance/feesService";
type SchoolOption = {
  value: string;
  label: string;
};
interface Props {
  refetchData: () => void;
  data: InvoiceType;
}
const PayFees = ({ refetchData, data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isError, setIsError] = useState(false);

  const [payFees, { isLoading: isCreating }] = usePayFeesMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FeesPaymentType>({
    resolver: zodResolver(FeesPaymentSchema),
    defaultValues: {
      amount: 0,
      payment_method: "",
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

  const onSubmit = async (formData: FeesPaymentType) => {
    console.log("submitting form data");
    const payload = {
        student: data.student_id,
        semester: data.semester.id,
        ...formData
    }
    console.log("payload", payload)
    try {
      const response = await payFees(payload).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Payment Successful");
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
  const handlePaymentMethodChange = (selected: SchoolOption | null) => {
    if (selected && selected.value) {
      setValue("payment_method", String(selected.value));
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
         items-center space-x-2 text-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg
          hover:bg-green-800 transition duration-300"
        >
          <span className="text-xs font-medium">Pay</span>
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
                overflow-y-auto rounded-md  bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-450 md:max-w-450 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-4 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Make Fee Payment
                  </p>
                </div>
                <div className="mx-4 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-semibold text-blue-800">
                        Payment Information
                      </h3>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p className="whitespace-normal break-words">
                        <span className="font-medium">Student:</span>{" "}
                        {data.student_name}
                      </p>
                      <p className="whitespace-normal break-words">
                        <span className="font-medium">Registration No:</span>{" "}
                        {data.student_reg_no}
                      </p>
                      <p className="whitespace-normal break-words">
                        <span className="font-medium">Semester:</span>{" "}
                        {data.semester?.name || "-"} {data.semester.academic_year}
                      </p>
                      <p className="whitespace-normal break-words">
                        <span className="font-medium">
                          Current Balance Due:
                        </span>{" "}
                        Ksh {data.bal_due?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {isExpanded ? "Show Less" : "Show More"}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="pt-3 border-t border-blue-200 animate-fadeIn">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">
                        Payment Policy Notice
                      </h4>
                      <div className="text-xs text-gray-600 space-y-2">
                        <p className="whitespace-normal break-words">
                          • Payments will be applied to previous semester
                          arrears first, if any exist.
                        </p>
                        <p className="whitespace-normal break-words">
                          • Any remaining amount will be credited to the current
                          semester fees.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4   p-4 md:p-4 lg:p-4 "
                >
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Amount<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="number"
                      {...register("amount")}
                      placeholder="Ksh"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Payment Method
                    </label>
                    <Select
                      options={paymentMethodOptions}
                      onChange={handlePaymentMethodChange}
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
                    {errors.payment_method && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.payment_method.message}
                      </p>
                    )}
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
                          <span>Processing...</span>
                        </span>
                      ) : (
                        <span>Pay</span>
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
export default PayFees;
