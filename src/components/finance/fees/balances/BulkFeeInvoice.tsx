"use client";
import { useEffect, useState } from "react";



import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { toast } from "react-toastify";
import { LiaUserCheckSolid } from "react-icons/lia";
import { useBulkFeeInvoiceMutation, useGetInvoiceTypesQuery } from "@/store/services/finance/feesService";
import { useGetCohortsQuery } from "@/store/services/curriculum/cohortsService";
import { bulkFeeInvoiceSchema,BulkFeeInvoiceFormData } from "@/schemas/finance/fees";
import { useGetSemestersQuery } from "@/store/services/curriculum/semestersService";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { ProgrammeCohortType, SemesterType } from "@/definitions/curiculum";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import { InvoiceType } from "../../invoices/types";



interface Props {
  refetchData: () => void;
}
const BulkFeeInvoicing = ({ refetchData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [bulkFeeInvoice, { isLoading: isCreating }] =
    useBulkFeeInvoiceMutation();
  const { data: invoiceTypesData } = useGetInvoiceTypesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: semestersData } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: cohortsData } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const {
    handleSubmit,
    setValue,

    reset,
    formState: { isSubmitting, errors },
  } = useForm<BulkFeeInvoiceFormData>({
    resolver: zodResolver(bulkFeeInvoiceSchema),
  });

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);
  const onSubmit = async (formData: BulkFeeInvoiceFormData) => {
    console.log("Form Data:", formData);
    try {
      const res = await bulkFeeInvoice(formData).unwrap();
      console.log("response", res);
      if (res.message) {
        toast.success(res.message);
      } else {
        toast.success("Invoicing successful!");
      }

      handleCloseModal();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);

      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        toast.error(errorData.error);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };

  console.log("acadmicyearsData", invoiceTypesData);

  const handleSemesterChange = (selected: LabelOptionsType | null) => {
    console.log("semester:", selected?.value, typeof selected?.value);

    if (selected) {
      const levelId = Number(selected.value);
      setValue("semester", levelId);
    }
  };
  const handleInvoiceTypeChange = (selected: LabelOptionsType | null) => {
    console.log("invoiceType:", selected?.value, typeof selected?.value);

    if (selected) {
      const itemId = Number(selected.value);
      setValue("invoice_type", itemId);
    }
  };
  const handleCohortChange = (selected: LabelOptionsType | null) => {
    console.log("cohort:", selected?.value, typeof selected?.value);

    if (selected) {
      const itemId = Number(selected.value);
      setValue("cohort", itemId);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        title="Single Reporting"
        className="flex items-center space-x-2 py-2 px-4 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <LiaUserCheckSolid className="w-4 h-4" />
        <span>Bulk Fee Invoicing</span>
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
          w-full sm:max-w-c-450 md:max-w-450 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-4 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Bulk Students Fee Invoicing
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
                      Cohort To Invoice<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={cohortsData?.map((item: ProgrammeCohortType) => ({
                        value: item.id,
                        label: `${item.name} ${item.current_semester.academic_year.name}`,
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
                      onChange={handleCohortChange}
                    />

                    {errors.cohort && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cohort.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      semester Invoicing For<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={semestersData?.map((item: SemesterType) => ({
                        value: item.id,
                        label: `${item.name} ${item.academic_year.name}`,
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
                      Invoice Type<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={invoiceTypesData?.map((item: InvoiceType) => ({
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
                      onChange={handleInvoiceTypeChange}
                    />

                    {errors.semester && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.semester.message}
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
          </div>
        </div>
      )}
    </>
  );
};
export default BulkFeeInvoicing;
