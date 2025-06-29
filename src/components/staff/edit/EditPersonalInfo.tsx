"use client";
import { zodResolver } from "@hookform/resolvers/zod";




import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { z } from "zod";



import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";
import { StaffType } from "@/definitions/staff";
import { UpdateUserInfoSchema } from "@/schemas/auth/user";
import { useUpdateUserAccountMutation } from "@/store/services/users/usersService";


const EditPersonalInfo = ({
  data,
  refetchData,
}: {
  data: StaffType | null;
  refetchData: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isError, setIsError] = useState(false);

  const [updateUserAccount,{isLoading:isUpdating}] = useUpdateUserAccountMutation();

 
  const {
    register,
    handleSubmit,
    
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(UpdateUserInfoSchema),
    defaultValues: {
      
        address: data?.user.address || "",
        city: data?.user.city || "",
        country: data?.user.country || "",
        date_of_birth: data?.user.date_of_birth || "",
        gender: data?.user.gender || "",
        phone_number: data?.user.phone_number || "",
        postal_code: data?.user.postal_code || "",
        first_name: data?.user.first_name || "",
        last_name: data?.user.last_name || "",
        email: data?.user.email || "",
        id_number: data?.user.id_number || "",
        passport_number: data?.user.passport_number || "",
        
    
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

  const onSubmit = async (formData: z.infer<typeof UpdateUserInfoSchema>) => {
    console.log("submitting form data for update", formData);
    console.log("data", formData)
    try {
      const response = await updateUserAccount({ 
        id: data?.id,
        data: formData
    }).unwrap();
      console.log("response", response);

      setIsError(false);
      setSuccessMessage(" Personal Information updated successfully!");
      setShowSuccessModal(true);

      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        setIsError(true);
        setSuccessMessage(
          "An error occured while updating Student Personal Info.Please try again!."
        );
        setShowSuccessModal(true);
      } else {
        setIsError(true);
        setSuccessMessage("Unexpected error occured. Please try again.");
        setShowSuccessModal(true);
      }
    }finally{
        refetchData();
    }
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="px-3 py-1 rounded-lg inline-flex items-center space-x-3
         bg-blue-100 text-blue-600 hover:bg-blue-200
          hover:text-blue-700 cursor-pointer transition duration-200 shadow-sm"
        title="Edit Event"
      >
        <FiEdit className="text-sm" />
        <span>Edit</span>
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
                w-full sm:max-w-c-550 md:max-w-550 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex sm:px-6 px-4 justify-between items-center py-2 ">
                  <p className="text-sm md:text-lg lg:text-lg font-bold ">
                    Edit  Personal Information
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={25}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3 mt-2 p-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2 gap-2">
                    <div>
                      <label className="block space-x-1 text-xs font-bold mb-2">
                        First name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="first_name"
                        type="text"
                        {...register("first_name")}
                        placeholder="Enter new First name"
                        className="w-full py-2 px-4  text-sm font-light border placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-sm">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-2">
                       Last Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="last_name"
                        type="text"
                        {...register("last_name")}
                        placeholder="Enter new last name"
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-sm">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Email
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="e.g +2547..."
                        className="w-full py-2 px-4 text-sm border  font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        ID NO:<span className="text-red-500"></span>
                      </label>
                      <input
                        id="id_number"
                        type="text"
                        {...register("id_number")}
                        placeholder="e.g XXXXXXX"
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.id_number && (
                        <p className="text-red-500 text-sm">
                          {errors.id_number.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Passport No:<span className="text-red-500"></span>
                      </label>
                      <input
                        id="passport_number"
                        type="text"
                        {...register("passport_number")}
                        placeholder="e.g XXXXXXX"
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.passport_number && (
                        <p className="text-red-500 text-sm">
                          {errors.passport_number.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        Address<span className="text-red-500"></span>
                      </label>
                      <input
                        id="address"
                        type="text"
                        {...register("address")}
                        placeholder="e.g Saika"
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2">
                        City
                        <span className="text-red-500"></span>
                      </label>
                      <input
                        id="city"
                        type="text"
                        {...register("city")}
                        placeholder="e.g Thika"
                        className="w-full py-2 text-sm px-4 border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm">
                          {errors.city.message}
                        </p>
                      )}
                    </div>           
                  <div>
                      <label className="block text-xs font-bold mb-2">
                       Country<span className="text-red-500"></span>
                      </label>
                      <input
                        id="country"
                        type="text"
                        {...register("country")}
                        placeholder="e.g Kenya"
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.country && (
                        <p className="text-red-500 text-sm">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>
                      <div>
                      <label className="block text-xs font-bold mb-2">
                       Postal Code<span className="text-red-500"></span>
                      </label>
                      <input
                        id="postal_code"
                        type="text"
                        {...register("postal_code")}
                        placeholder="e.g 82-90119 "
                        className="w-full py-2 px-4 text-sm border font-light placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.postal_code && (
                        <p className="text-red-500 text-sm">
                          {errors.postal_code.message}
                        </p>
                      )}
                    </div>
                  <div className="sticky bottom-0 bg-white z-40 flex md:px-6 gap-4 md:justify-end items-center py-3">
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
                      className="bg-blue-500 text-white py-2 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isUpdating ? (
                        <span className="flex items-center">
                         <SubmitSpinner />
                          Updating
                        </span>
                      ) : (
                        <span>Update</span>
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
export default EditPersonalInfo;
