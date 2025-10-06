"use client";
import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";

import { SemesterType } from "@/definitions/curiculum";
import { paymentMethodOptions } from "@/definitions/finance/fees/invoices";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { FeesPaymentFormData, payFeesBaseSchema } from "@/schemas/finance/fees";
import { useGetSemestersQuery } from "@/store/services/curriculum/semestersService";
import { usePayFeesMutation } from "@/store/services/finance/feesService";
import { FiCreditCard } from "react-icons/fi";

type SchoolOption = {
  value: string;
  label: string;
};
interface Props {
  refetchData: () => void;
}
const PayFees = ({ refetchData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [payFees, { isLoading: isCreating }] = usePayFeesMutation();
  const { data: semestersData } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FeesPaymentFormData>({
    resolver: zodResolver(payFeesBaseSchema),
    defaultValues: {
      amount: 0,
      payment_method: "",
      registration_number: "",
      semester: undefined,
      notes: "",
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

  const onSubmit = async (formData: FeesPaymentFormData) => {
    console.log("submitting form data");
    console.log("payload", formData);
    try {
      const response = await payFees(formData).unwrap();
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
  const handleSemesterChange = (selected: LabelOptionsType | null) => {
    console.log("semester:", selected?.value, typeof selected?.value);

    if (selected) {
      const levelId = Number(selected.value);
      setValue("semester", levelId);
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
          className="bg-primary-600 inline-flex cursor-pointer w-max 
         items-center space-x-2 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg
          hover:bg-primary-700 transition duration-300"
        >
            <FiCreditCard className="h-4 w-4" />
          <span className="text-sm font-medium">Make Payment</span>
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
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-4 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Make Fee Payment
                  </p>
                   <IoCloseOutline
                    size={20}
                    className="cursor-pointer"
                    onClick={handleCloseModal}
                  />
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4   p-4 md:p-4 lg:p-4 "
                >
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Reg No.<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("registration_number")}
                      placeholder="Enter a valid reg number"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.registration_number && (
                      <p className="text-red-500 text-sm">
                        {errors.registration_number.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Semester Within Payment Date
                      <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={semestersData?.map((item: SemesterType) => ({
                        value: item.id,
                        label: `${item.name} ${item.academic_year.name} `,
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
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Transaction Reference Code(Mpesa or Bank if Availale)
                    </label>
                    <input
                      id="receipt_number"
                      type="text"
                      {...register("reference")}
                      placeholder="e.g THRMFERW"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.reference && (
                      <p className="text-red-500 text-sm">
                        {errors.reference.message}
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
