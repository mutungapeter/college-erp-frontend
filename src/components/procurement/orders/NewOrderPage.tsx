"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IoAddOutline, IoTrashOutline } from "react-icons/io5";
import Select from "react-select";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import { CategoryType, InventoryUnitType } from "@/components/inventory/types";
import { MakeOrderFormData, makeOrderSchema } from "@/schemas/procurement/po";
import { useGetCategoriesQuery, useGetUnitsQuery } from "@/store/services/finance/inventoryService";
import {
  useGetVendorsQuery,
  useMakeOrderMutation,
} from "@/store/services/finance/procurementService";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { VendorDetailedType } from "../vendors/types";

type SchoolOption = {
  value: string;
  label: string;
};


interface Props {
  refetchData?: () => void;
}

const NewOrderPage = ({ refetchData }: Props) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  
  const [makeOrder, { isLoading: isCreating }] = useMakeOrderMutation();
  const { data: vendorsData } = useGetVendorsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: categoriesData } = useGetCategoriesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: unitsData } = useGetUnitsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = useForm<MakeOrderFormData>({
    resolver: zodResolver(makeOrderSchema),
    defaultValues: {
      items: [
        {
          name: "",
          description: "",
          quantity: 1,
          unit: 1,
          unit_price: 0,
          category: 1
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const handleVendorChange = (selected: SchoolOption | null) => {
    if (selected) {
      const vendorId = Number(selected.value);
      setValue("vendor", vendorId);
    }
  };

  const handleUnitChange = (selected: SchoolOption | null, index: number) => {
    if (selected) {
      const unitId = Number(selected.value);
      setValue(`items.${index}.unit`, unitId);
    }
  };

  const handleCategoryChange = (selected: SchoolOption | null, index: number) => {
    if (selected) {
      const catId = Number(selected.value);
      setValue(`items.${index}.category`, catId);
    }
  };

  const addNewItem = () => {
    append({
      name: "",
      description: "",
      quantity: 1,
      unit: 1,
      unit_price: 0,
      category: 1, // Changed from undefined to 1 (default value)
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateSubtotal = () => {
    return watchedItems?.reduce((total, item) => {
      return total + calculateItemTotal(item.quantity || 0, item.unit_price || 0);
    }, 0) || 0;
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.16; // 16% VAT
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
  };

  const onSubmit = async (formData: MakeOrderFormData) => {
    console.log("submitting form data", formData);
    try {
      const response = await makeOrder(formData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Order placed successfully");
      setShowSuccessModal(true);
      reset();
      refetchData?.();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(errorData.error);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage("Unexpected error occurred. Please try again.");
        setShowSuccessModal(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <Link href="/dashboard/procurement/orders"
        className="flex items-center space-x-2 mb-7 text-lg text-gray-500 hover:text-blue-700"
        >
            <FiArrowLeft className="text-lg" />
        <span>Back To Orders</span>
        </Link>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            {/* <MdShoppingCart className="text-blue-600" /> */}
            Make New Order
          </h1>
          <p className="text-gray-600 mt-2">Create a new purchase order for your vendor</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
                  <p className="text-gray-600 text-sm mt-1">Add items to your purchase order</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Vendor Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Vendor <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={vendorsData?.map((item: VendorDetailedType) => ({
                        value: item.id.toString(),
                        label: `${item.name} (${item.business_type})`,
                      }))}
                      placeholder="Select vendor..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "42px",
                          borderColor: "#d1d5db",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "#9ca3af",
                          },
                          "&:focus-within": {
                            borderColor: "#2563eb",
                            boxShadow: "0 0 0 1px #2563eb",
                          },
                        }),
                      }}
                      onChange={handleVendorChange}
                    />
                    {errors.vendor && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.vendor.message}
                      </p>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Items</h3>
                      <button
                        type="button"
                        onClick={addNewItem}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <IoAddOutline size={18} />
                        Add Item
                      </button>
                    </div>

                    {fields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <IoTrashOutline size={18} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Item Name */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Item Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...register(`items.${index}.name`)}
                              placeholder="Enter item name"
                              className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.items?.[index]?.name && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.items[index]?.name?.message}
                              </p>
                            )}
                          </div>

                          {/* Category */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Category
                            </label>
                            <Select
                              options={categoriesData?.map((item: CategoryType) => ({
                                value: item.id.toString(),
                                label: `${item.name}(${item.category_type_label})`,
                              }))}
                              placeholder="Select category..."
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  minHeight: "38px",
                                  borderColor: "#d1d5db",
                                }),
                              }}
                              onChange={(selected: SchoolOption | null) => handleCategoryChange(selected, index)}
                            />
                          </div>

                          {/* Description */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                              Description
                            </label>
                            <textarea
                              {...register(`items.${index}.description`)}
                              placeholder="Enter item description"
                              rows={2}
                              className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          {/* Quantity */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="1"
                              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                              placeholder="0"
                              className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.items?.[index]?.quantity && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.items[index]?.quantity?.message}
                              </p>
                            )}
                          </div>

                          {/* Unit */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Unit <span className="text-red-500">*</span>
                            </label>
                            <Select
                              options={unitsData?.map((unit: InventoryUnitType) => ({
                                value: unit.id.toString(),
                                label: `${unit.name}`,
                              }))}
                              placeholder="Select unit..."
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  minHeight: "38px",
                                  borderColor: "#d1d5db",
                                }),
                              }}
                              onChange={(selected: SchoolOption | null) => handleUnitChange(selected, index)}
                            />
                            {errors.items?.[index]?.unit && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.items[index]?.unit?.message}
                              </p>
                            )}
                          </div>

                          {/* Unit Price */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Unit Price (KSh) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                              placeholder="0.00"
                              className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.items?.[index]?.unit_price && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.items[index]?.unit_price?.message}
                              </p>
                            )}
                          </div>

                          {/* Item Total */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Item Total (KSh)
                            </label>
                            <div className="py-2 px-3 bg-gray-100 border rounded-md text-gray-700 font-medium">
                              {calculateItemTotal(
                                watchedItems?.[index]?.quantity || 0,
                                watchedItems?.[index]?.unit_price || 0
                              ).toLocaleString('en-KE', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border sticky top-6">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Items Summary */}
                  <div className="space-y-3">
                    {watchedItems?.map((item, index) => (
                      <div key={index} className="flex justify-between items-start text-sm">
                        <div className="flex-1 pr-2">
                          <p className="font-medium text-gray-900">
                            {item.name || `Item ${index + 1}`}
                          </p>
                          <p className="text-gray-500">
                            {item.quantity || 0} × KSh {(item.unit_price || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="font-medium text-gray-900">
                          KSh {calculateItemTotal(
                            item.quantity || 0,
                            item.unit_price || 0
                          ).toLocaleString('en-KE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr />

                  {/* Totals */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-gray-900">
                        KSh {calculateSubtotal().toLocaleString('en-KE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">VAT (16%):</span>
                      <span className="font-medium text-gray-900">
                        KSh {calculateTax(calculateSubtotal()).toLocaleString('en-KE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <hr />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-blue-600">
                        KSh {calculateTotal().toLocaleString('en-KE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                 

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || isCreating}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting || isCreating ? (
                        <span className="flex items-center justify-center gap-2">
                          <SubmitSpinner />
                          Processing...
                        </span>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {showSuccessModal && (
          <SuccessFailModal
            message={successMessage}
            onClose={handleCloseSuccessModal}
            isError={isError}
          />
        )}
      </div>
    </div>
  );
};

export default NewOrderPage;