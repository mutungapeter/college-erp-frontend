"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineBanknotes, HiOutlineDocumentText } from "react-icons/hi2"; 
import { IoCloseOutline } from "react-icons/io5";
import { MdPayments } from "react-icons/md"; 

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";

import { paySlipSchema, PaySlipSchemaType } from "@/schemas/payroll/main";
import { useGeneratePaySlipsMutation } from "@/store/services/staff/staffService";

const GeneratePaySlips = ({ refetchData }: { refetchData: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [generatePaySlips, { isLoading: isCreating }] = useGeneratePaySlipsMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<PaySlipSchemaType>({
    resolver: zodResolver(paySlipSchema),
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

  const onSubmit = async (formData: PaySlipSchemaType) => {
    console.log("submitting form data", formData);

    try {
      const response = await generatePaySlips(formData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("PaySlips generated successfully!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to generate payslips: ${errorData.error}`);
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
         items-center space-x-2 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-300 shadow-sm"
        >
          <HiOutlineDocumentText className="text-lg" />
          <span className="text-sm font-medium">Generate Payslips</span>
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
                overflow-y-auto rounded-lg bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-500 md:max-w-500"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex px-6 justify-between items-center py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <span className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                      <HiOutlineBanknotes className="text-blue-600 text-xl" />
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        Generate PaySlips
                      </p>
                      <p className="text-sm text-gray-500">
                        Create monthly salary statements
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={24}
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Professional Notice/Info Section */}
                <div className="px-6 py-4 bg-blue-50 border-l-4 border-blue-400 mx-6 mt-4 rounded-r-md">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Important Notice</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Select the pay period dates to generate payslips for all active employees. 
                        Ensure all attendance and salary adjustments are finalized before processing.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 mt-6 px-6 pb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pay Period Start Date
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          {...register("start_date")}
                        />
                         </div>
                      {errors.start_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.start_date.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pay Period End Date
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          {...register("end_date")}
                        />
                        </div>
                      {errors.end_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.end_date.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional Professional Notice */}
                  <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                    <div className="flex items-start space-x-2">
                      <MdPayments className="text-gray-500 text-lg mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-1">Processing Details:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Payslips will be generated for all active employees</li>
                          <li>• System will calculate salaries based on active employment status, Overtime hours, and deductions</li>
                          <li>• Generated payslips can be downloaded or emailed to employees</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                
                  <div className="sticky bottom-0 bg-white z-40 flex space-x-3 gap-4 justify-end items-center py-4 border-t border-gray-100 -mx-6 px-6">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-gray-300 bg-white shadow-sm text-gray-700 py-2.5 text-sm px-6 rounded-md min-w-[100px] hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isCreating}
                      className="bg-blue-600 text-white py-2.5 hover:bg-blue-700 text-sm px-6 rounded-md min-w-[120px] transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting || isCreating ? (
                        <span className="flex items-center justify-center space-x-2">
                          <SubmitSpinner />
                          <span>Generating...</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <HiOutlineDocumentText className="text-sm" />
                          <span>Generate</span>
                        </span>
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

export default GeneratePaySlips;