"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";

import SuccessFailModal from "@/components/common/Modals/SuccessFailModal";
import SubmitSpinner from "@/components/common/spinners/submitSpinner";

import {
  CourseType,
  ProgrammeCohortType,
  SemesterType
} from "@/definitions/curiculum";

import { StudentDetailsType } from "@/definitions/students";
import { ExamDataCreate, examDataCreateSchema } from "@/schemas/exams/main";
import { useAddMarksMutation } from "@/store/services/academics/acadmicsService";

type AddMarksProps = {
  student: StudentDetailsType;
  course: CourseType;
  semester: SemesterType;
  cohort: ProgrammeCohortType;
  refetchData: () => void;
};

const AddMarks = ({
  refetchData,
  student,
  course,
  semester,
  cohort,
}: AddMarksProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [addMarks, { isLoading: isCreating }] = useAddMarksMutation();
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ExamDataCreate>({
    resolver: zodResolver(examDataCreateSchema),
    defaultValues: {
      cat_one: 0,
      cat_two: 0,
      exam_marks: 0,
    },
  });
  const cat_one = watch("cat_one");
  const cat_two = watch("cat_two");
  const exam_marks = watch("exam_marks");

  const total = (Number(cat_one) + Number(cat_two)) / 2 + Number(exam_marks);
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

  const onSubmit = async (formData: ExamDataCreate) => {
    const submissionData = {
      student: student.id,
    //   programme: programme.id,
      course: course.id,
      semester: semester.id,
      cohort: cohort.id,
      ...formData,
    };

    try {
      const response = await addMarks(submissionData).unwrap();
      console.log("response", response);
      setIsError(false);
      setSuccessMessage("Marks Added successfully!");
      setShowSuccessModal(true);
      reset();
      refetchData();
    } catch (error: unknown) {
      console.log("error", error);
      setIsError(true);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        setSuccessMessage(`Failed to add Marks: ${errorData.error}`);
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
          className="bg-teal-600 inline-flex cursor-pointer w-max 
         items-center space-x-2 text-white px-2 py-2 rounded-md hover:bg-teal-700  transform scale-105 transition duration-300"
        >
          <FiPlus className="text-sm" />
          <span className="text-xs font-medium">Add Marks</span>
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
                overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                w-full sm:max-w-c-450 md:max-w-450 px-3"
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Add Marks
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={30}
                      onClick={handleCloseModal}
                      className="text-gray-500"
                    />
                  </div>
                </div>
                <div className="p-3 space-y-2">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={`${student?.user.first_name} ${student?.user.last_name}`}
                      readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                   />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={student?.registration_number}
                      readOnly
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cohort/Class
                    </label>
                    <input
                      type="text"
                      value={cohort?.name}
                      readOnly
                    className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"

                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Semester
                    </label>
                    <input
                      type="text"
                      value={`${semester?.name} (${semester?.academic_year})`}
                      readOnly
                    className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"

                    />
                  </div>

                </div>
                 <div className="">
                    <label className="block text-sm font-medium text-gray-700">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={`${course?.course_code} - ${course?.name}`}
                      readOnly
                    className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"

                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 p-3 "
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm">Cat One</label>
                      <input
                        type="number"
                        {...register("cat_one")}
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.cat_one && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cat_one.message}
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm">Cat Two</label>
                      <input
                        type="number"
                        {...register("cat_two")}
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.cat_two && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cat_two.message}
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm">Exam Marks</label>
                      <input
                        type="number"
                        {...register("exam_marks")}
                        className="w-full py-2 px-4 border placeholder:text-sm rounded-md focus:outline-none"
                      />
                      {errors.exam_marks && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.exam_marks.message}
                          </p>
                        )}
                    </div>
                    <div className="">
                      <label className="block text-sm font-medium text-gray-700">
                        Total
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={total.toFixed(2)}
                        className="w-full py-2 px-4 border bg-gray-200 placeholder:text-sm rounded-md focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-white z-40 flex space-x-3 gap-4 md:justify-end items-center py-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="border border-gray-300 bg-white shadow-sm text-gray-700 py-2 text-sm px-4 rounded-md w-full min-w-[100px] md:w-auto hover:bg-gray-50"
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
                          <span>Submitting...</span>
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

export default AddMarks;
