"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";



import IconButton from "@/components/common/IconButton";
import ModalBottomButton from "@/components/common/StickyModalFooterButtons";
import { CreateIntakeFormData, CreateIntakeSchema } from "@/schemas/curriculum/intakes";
import { useCreateIntakeMutation } from "@/store/services/admissions/admissionsService";
import { IoCloseOutline } from "react-icons/io5";


const AddIntake = ({ refetchData }: { refetchData: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [createIntake, { isLoading: isCreating }] = useCreateIntakeMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<CreateIntakeFormData>({
    resolver: zodResolver(CreateIntakeSchema),
    
  });

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
  };
const activeValue = watch("closed");
  const handleOpenModal = () => setIsOpen(true);
  
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsError(false);
    handleCloseModal();
  };
  


  const onSubmit = async (formData: CreateIntakeFormData) => {
    console.log("submitting form data", formData);

    try {
      const response = await createIntake(formData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Intake added successfully!");
      setShowSuccessModal(true);
      reset();
      // refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to add Intake: ${errorData.error}`);
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage("Unexpected error occurred. Please try again.");
        setShowSuccessModal(true);
      }
    }finally{
      refetchData();
    }
  };

  return (
    <>
       <IconButton
        onClick={handleOpenModal}
        title="Add New"
        label="New Intake"
        icon={<FiPlus className="w-4 h-4" />}
        className="bg-primary-500 text-white px-4 py-2 hover:bg-primary-600 focus:ring-primary-500 focus:ring-offset-1"
      />

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
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-xl bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-400 md:max-w-400 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Add New Intake
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={20}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2 p-4 md:p-4 lg:p-4"
                >
                 
                    <div>
                    <label className="block space-x-1  text-sm font-medium mb-2">
                      name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      placeholder="e.g Sep Intake 2022"
                      className="w-full py-2 px-4 border placeholder:text-sm  rounded-md focus:outline-none "
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Start Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        {...register("start_date")}
                      />
                      {errors.start_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.start_date.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        End Date<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        {...register("end_date")}
                      />
                      {errors.end_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.end_date.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                   <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="closed"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      {...register("closed")}
                    />
                    <label
                      htmlFor="closed"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      Closed {activeValue ? "(Yes)" : "(No)"}
                    </label>
                  </div>

                  <ModalBottomButton
                                                        onCancel={handleCloseModal}
                                                        isSubmitting={isSubmitting}
                                                        isProcessing={isCreating}
                                                      />
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

export default AddIntake;