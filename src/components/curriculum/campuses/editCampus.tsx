"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { z } from "zod";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import { useUpateCampusMutation } from "@/store/services/curriculum/campusService";

import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import { CampusType } from "@/definitions/curiculum";
import campusSchema from "@/schemas/curriculum/campus";

const EditCampus = ({
  campus,
  refetchData,
}: {
  campus: CampusType;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isError, setIsError] = useState(false);

  const [updateCampus, { isLoading: isUpdating }] =useUpateCampusMutation();

  const {
    register,
    handleSubmit,

    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(campusSchema),
    defaultValues: {
      name: campus?.name || "",
      city: campus?.city || "",
      address: campus?.address || "",
      phone_number: campus?.phone_number || "",
      email: campus?.email || "",
      population: campus?.population ??  0,
    },
  });

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => setIsOpen(true);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };

  const onSubmit = async (formData: z.infer<typeof campusSchema>) => {
    try {
      const response = await updateCampus({
        id: campus.id,
        data: formData,
      }).unwrap();
      console.log("response", response);

      setIsError(false);
      setSuccessMessage("Campus updated successfully!");
      setShowSuccessModal(true);

      refetchData();
    } catch (error: unknown) {
      setIsError(true);
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        
        setSuccessMessage(`Error: ${errorData.error}`);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage("Failed to update Campus. Please try again.");
        setShowSuccessModal(true);
      }
    }
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="p-2 rounded-xl hover:bg-blue-200 text-blue-600  hover:text-blue-700 cursor-pointer transition duration-200 shadow-sm"
        title="Edit Client"
      >
        <FiEdit className="text-sm" />
      </div>

      {isOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            // onClick={handleCloseModal}
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
                w-full sm:max-w-c-500 md:max-w-500 px-3"
            >
               <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-3 ">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold ">
                    Add New Campus
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={30}
                      onClick={handleCloseModal}
                      className="text-gray-500  "
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2  p-4 md:p-4 lg:p-4 "
                >
                 <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Campus name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register("name")}
                        placeholder="e.g X University"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                  
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        City<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="city"
                        type="text"
                        {...register("city")}
                        placeholder="e.g Nairobi"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Address<span className="text-red-500"></span>
                      </label>
                      <input
                        id="address"
                        type="text"
                        {...register("address")}
                        placeholder="e.g Greec Towers, 5th Floor"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Email<span className="text-red-500"></span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="e.g inform@x.com"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block space-x-1  text-sm font-medium mb-2">
                        Population<span className="text-red-500"></span>
                      </label>
                      <input
                        id="population"
                        type="text"
                        {...register("population")}
                        placeholder="e.g 600"
                        className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                      />
                      {errors.population && (
                        <p className="text-red-500 text-sm">
                          {errors.population.message}
                        </p>
                      )}
                    </div>
                    
                    
                    
                  </div>
                 
                  
                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6  gap-4 md:justify-end items-center py-3 ">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-gray-300 bg-white shadow-sm text-gray-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUpdating}
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isUpdating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Editing...</span>
                        </span>
                      ) : (
                        <span>Edit</span>
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
export default EditCampus;