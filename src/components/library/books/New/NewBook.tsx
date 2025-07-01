"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";

import { BookCategoryOptions } from "@/lib/constants";


import { bookCreateSchema, BookCreateType } from "@/schemas/library/main";
import { useCreateBookMutation } from "@/store/services/library/libraryService";

type SelectOption = {
  value: string | number;
  label: string;
};



const CreateBook = ({ refetchData }: { refetchData: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();

  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<BookCreateType>({
    resolver: zodResolver(bookCreateSchema),
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

  const handleCategoryChange = (selected: SelectOption | null) => {
    if (selected && selected.value) {
      setValue("category", String(selected.value));
    }
  };
  

  
  
  
  const onSubmit = async (formData: BookCreateType) => {
    console.log("submitting form data", formData);

    try {
      const response = await createBook(formData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Book added successfully!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to add  book: ${errorData.error}`);
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
      <button
        onClick={handleOpenModal}
        title="Add Fee Item"
        className="flex items-center space-x-2 px-4 py-2 bg-primary
         hover:bg-primary-700 text-white   rounded-md transition duration-300 shadow-sm cursor-pointer"
      >
        <FiPlus className="text-sm" />
        <span className="text-sm">Add Book</span>
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
            className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center
           justify-start overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-600 md:max-w-600 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Add New Book
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
                  className="space-y-2 mt-2 p-4 "
                >
                 
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Title<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. The Richest Man In Babylon"
                          {...register("title")}
                        />
                        {errors.title && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.title.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Author<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. David Wilson"
                          {...register("author")}
                        />
                        {errors.author && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.author.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          ISBN<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. "
                          {...register("isbn")}
                        />
                        {errors.isbn && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.isbn.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Total Copies<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="e.g. 500 "
                          {...register("total_copies")}
                        />
                        {errors.total_copies && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.total_copies.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                         Publication Date
                        </label>
                        <input
                          type="date"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          {...register("publication_date")}
                        />
                        {errors.publication_date && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.publication_date.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label className="block space-x-1 text-sm font-medium mb-2">
                          Category<span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={BookCategoryOptions}
                          onChange={handleCategoryChange}
                          menuPortalTarget={document.body}
                          menuPlacement="auto"
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 999999,
                            }),
                            menu: (base) => ({
                              ...base,
                              position: "absolute",
                              width: "max-content",
                              minWidth: "100%",
                              minHeight: "50px",
                            }),
                            control: (base) => ({
                              ...base,
                              minHeight: "44px",
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
                        {errors.category && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.category.message}
                          </p>
                        )}
                      </div>
                    </div>
                
               
                <div>
                        <label className="block space-x-1 text-sm font-medium mb-2">
                       Copy Price
                        </label>
                        <input
                          type="number"
                          className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                          placeholder="Ksh"
                          {...register("unit_price")}
                        />
                        {errors.unit_price && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.unit_price.message}
                          </p>
                        )}
                      </div>
               
                  
                  <div className="sticky bottom-0 bg-white z-40 flex space-x-3 gap-4 md:justify-between items-center py-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-red-500 bg-white shadow-sm text-red-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-red-500 hover:text-white "
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isCreating}
                      className="bg-primary-600 text-white py-2 hover:bg-primary-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isCreating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Adding...</span>
                        </span>
                      ) : (
                        <span>Add</span>
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

export default CreateBook;