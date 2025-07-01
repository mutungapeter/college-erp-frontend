"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloseOutline } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import Select from "react-select";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";



import { BookType, Member } from "@/definitions/library";
import {
  IssueBookSchema,
  IssueBookType
} from "@/schemas/library/main";
import {
  useGetMembersQuery,
  useIssueBookMutation,
} from "@/store/services/library/libraryService";

type SelectOption = {
  value: string | number;
  label: string;
};

interface IssueBookProps {
  data: BookType | null;
  refetchData: () => void;
}

const IssueBook = ({ refetchData, data }: IssueBookProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [issueBook, { isLoading: isCreating }] = useIssueBookMutation();

  const { data: membersData } = useGetMembersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<IssueBookType>({
    resolver: zodResolver(IssueBookSchema),
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

  const handleMemberChange = (selected: SelectOption | null) => {
    if (selected) {
      const memberId = Number(selected.value);
      setValue("member", memberId);
    }
  };

  const onSubmit = async (formData: IssueBookType) => {
    const submissionData = {
      ...formData,
      book: data?.id,
      due_date: new Date(formData.due_date).toISOString().split('T')[0],
    };
    console.log("submitting form data", submissionData);

    try {
      const response = await issueBook(submissionData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Book issued successfully!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to issue book: ${errorData.error}`);
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
      className="relative group"
    >
      <div
        className="bg-green-100 inline-flex cursor-pointer p-2
         items-center justify-center text-green-700 rounded-xl hover:bg-green-700 hover:text-white transition duration-300"
        title="Issue Book" 
      >
      
        <LuNotebookPen className="text-sm" />
      </div>
    
      {/* <div className="absolute bottom-full left-1/2 transform 
      -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs
       rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 
       pointer-events-none whitespace-nowrap">
        Issue Book
      </div> */}
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
           justify-center overflow-y-auto p-2 md:p-3"
          >
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-600 md:max-w-600 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Issue Book
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={20}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Book Title
                      </label>
                      <input
                        type="text"
                        value={`${data?.title}`}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Book. Author
                      </label>
                      <input
                        type="text"
                        value={data?.author}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <input
                        type="text"
                        value={data?.category}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Available Copies
                      </label>
                      <input
                        type="text"
                        value={data?.copies_available}
                        readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 mt-2 p-4 md:p-4 lg:p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Member
                      </label>
                      <Select
                        options={membersData?.map((item: Member) => ({
                          value: item.id,
                          label: `${item.user.first_name} ${item.user.last_name} (${item.user?.role.name})`,
                        }))}
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 10000,
                            overflow: "visible",
                            maxHeight: "300px",
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: "26px",
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
                        onChange={handleMemberChange}
                      />
                      {errors.member && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.member.message}
                        </p>
                      )}
                    </div>
                    {/* <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Copy No<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        placeholder="copy number"
                        {...register("copy_number")}
                      />
                      {errors.copy_number && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.copy_number.message}
                        </p>
                      )}
                    </div> */}
                    <div>
                      <label className="block space-x-1 text-sm font-medium mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                        {...register("due_date")}
                      />
                      {errors.due_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.due_date.message}
                        </p>
                      )}
                    </div>
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
                      className="bg-primary-600 text-white py-2 hover:bg-blue-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[100px] md:w-auto"
                    >
                      {isSubmitting || isCreating ? (
                        <span className="flex items-center">
                          <SubmitSpinner />
                          <span>Issueing...</span>
                        </span>
                      ) : (
                        <span>Issue</span>
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

export default IssueBook;
