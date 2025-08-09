"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";

import {
    InventoryItemFormData,
    inventoryItemSchema,
} from "@/schemas/inventory";
import {
    useGetCategoriesQuery,
    useGetUnitsQuery,
    useUpdateInventoryItemMutation
} from "@/store/services/finance/inventoryService";
import { FiEdit } from "react-icons/fi";
import { CategoryType, InventoryItem, InventoryUnitType } from "./types";
type SchoolOption = {
  value: string;
  label: string;
};
interface Props {
  refetchData: () => void;
  data: InventoryItem;
}
const UpdateInventoryItem = ({ refetchData, data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [updateInventoryItem, { isLoading: isCreating }] =
    useUpdateInventoryItemMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
    
      name: data?.name ?? "",
      description: data?.description ?? "",
      quantity_in_stock: data?.quantity_in_stock ?? 0,
      unit_valuation: Number(data?.unit_valuation ?? 0),
      total_valuation: Number(data?.total_valuation ?? 0),
      category: data?.category.id ?? undefined,
      unit: data?.unit.id ?? undefined,
    },
  });
  const quantityInStock = watch("quantity_in_stock");
  const unitValuation = watch("unit_valuation");
   useEffect(() => {
    if (quantityInStock && unitValuation) {
      const quantity = parseFloat(quantityInStock.toString());
      const unitPrice = parseFloat(unitValuation.toString());
      
      if (!isNaN(quantity) && !isNaN(unitPrice)) {
        const totalValuation = quantity * unitPrice;
        setValue("total_valuation", totalValuation)
      }
    } else {
      setValue("total_valuation", 0)
    }
  }, [quantityInStock, unitValuation, setValue]);
  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);
  const { data: catData } = useGetCategoriesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: unitsData } = useGetUnitsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const handleCategoryChange = (selected: SchoolOption | null) => {
    if (selected) {
      const categoryId = Number(selected.value);
      setValue("category", categoryId);
    }
  };
  const handleUnitChange = (selected: SchoolOption | null) => {
    if (selected) {
      const unitId = Number(selected.value);
      setValue("unit", unitId);
    }
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const onSubmit = async (formData: InventoryItemFormData) => {
    console.log("submitting form data");

    console.log("formData", formData);
    try {
      const response = await updateInventoryItem({
        id: data.id,
        data: formData
      }).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Inventory Updated Successfully");
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
                       title="Edit Structure"
                       className="group relative p-2 bg-amber-100 text-amber-500 rounded-md hover:bg-amber-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
                     >
                       <FiEdit className="w-4 h-4" />
                       <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                         Edit Inventory Item
                       </span>
                     </button>

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
                w-full sm:max-w-c-550 md:max-w-550 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex  px-4 justify-between items-center py-4 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Update  Inventory Item
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register("name")}
                        placeholder="Name"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Category
                        <span className="text-red-500 mb-2">*</span>
                      </label>
                      <Select
                        options={catData?.map((item: CategoryType) => ({
                          value: item.id.toString(),
                          label: `${item.name} (${item.category_type_label})`,
                        }))}
                        defaultValue={{
                            value: data?.category.id.toString(),
                            label: `${data?.category.name} (${data?.category.category_type_label})`,
                        }}
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
                        onChange={handleCategoryChange}
                      />

                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.category.message}
                        </p>
                      )}
                    </div>
                     <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Unit of Measure
                      <span className="text-red-500 mb-2">*</span>
                    </label>
                    <Select
                      options={unitsData?.map((unit: InventoryUnitType) => ({
                        value: unit.id.toString(),
                        label: `${unit.name}`,
                      }))}
                      defaultValue={{
                        value: data?.unit.id.toString(),
                        label: `${data?.unit.name}`,
                      }}
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
                      onChange={handleUnitChange}
                    />

                    {errors.unit && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.unit.message}
                      </p>
                    )}
                  </div>
                      <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Quantity<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="quantity_in_stock"
                        type="text"
                        {...register("quantity_in_stock")}
                        placeholder="0"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.quantity_in_stock && (
                        <p className="text-red-500 text-sm">
                          {errors.quantity_in_stock.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Unit Valuation(Ksh)
                      </label>
                      <input
                        id="unit_valuation"
                        type="text"
                        step="0.01"
                        {...register("unit_valuation")}
                        placeholder="Ksh 0.00"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.unit_valuation && (
                        <p className="text-red-500 text-sm">
                          {errors.unit_valuation.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Total Valuation(Ksh)
                      </label>
                      <input
                        id="total_valuation"
                        type="text"
                        step="0.01"
                        {...register("total_valuation")}
                        placeholder="Ksh 0.00"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.total_valuation && (
                        <p className="text-red-500 text-sm">
                          {errors.total_valuation.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      id="name"
                      {...register("description")}
                      placeholder="Description optional"
                      rows={3}
                      cols={5}
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
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
export default UpdateInventoryItem;
