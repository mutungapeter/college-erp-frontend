
import React from 'react';
import { TranscriptType } from "@/definitions/transcripts";
import Image from 'next/image';

interface TranscriptHTMLViewProps {
  transcriptData: TranscriptType[];
}

const TranscriptHTMLView: React.FC<TranscriptHTMLViewProps> = ({ transcriptData }) => {
  const gradingData = [
    { points: "70-100", grade: "A" },
    { points: "60-69", grade: "B" },
    { points: "50-59", grade: "C" },
    { points: "40-49", grade: "D" },
    { points: "0-39", grade: "E" },
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-8">
      {transcriptData?.map((transcript: TranscriptType, index: number) => (
        <div key={index} className="bg-white border-1 border-gray-400 p-8 shadow-md font-helvetica max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 flex flex-col items-center">
            <div className="flex flex-col items-center mb-4">
              <Image
                alt="University Logo"
                className="w-20 h-20 object-cover"
                src="/logo/university_logo.png"
                width={80}
                height={80}
    
              />
              <div className="text-center">
                <h1 className="text-lg font-bold mb-1">
                  Kathangaita University of Science and Technology
                </h1>
              </div>
            </div>
            <div className="text-center text-xs leading-tight space-y-1">
              <p>P.O. BOX. 190-50100 Kathangaita,</p>
              <p>TEL: +057-250523646/3,0745535335, FAX: +056-30150</p>
              <p>Email: info@kaust.ac.ke, web: www.kaust.ac.ke</p>
            </div>
            <h2 className="text-sm font-bold mt-2 mb-1">
              OFFICE OF THE REGISTRAR - ACADEMICS
            </h2>
            <h3 className="text-sm font-bold mb-4">
              Provisional Transcripts / Result Slip
            </h3>
          </div>

          {/* Student Information Section */}
          <div className="mt-8 pt-4 border-t border-gray-500 flex justify-between mb-8">
            <div className="space-y-3">
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase">Student Name:</span>
                <span className="text-xs uppercase">
                  {transcript?.student?.user.first_name} {transcript?.student?.user.last_name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase">Programme:</span>
                <span className="text-xs uppercase">
                  {transcript?.student?.programme.name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase">Department:</span>
                <span className="text-xs uppercase">
                  {transcript?.student?.programme?.department.name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase">Faculty:</span>
                <span className="text-xs uppercase">
                  {transcript?.student?.programme?.department.school.name}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase">Reg. Number:</span>
                <span className="text-xs uppercase">
                  {transcript?.student?.registration_number}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase">Year Of Study:</span>
                <span className="text-xs uppercase">
                  {transcript?.student?.cohort.current_year}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase">Semester:</span>
                <span className="text-xs uppercase">
                  {transcript?.student?.cohort.current_semester.name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase">Admission Year:</span>
                <span className="text-xs uppercase">
                  {formatDate(transcript?.student?.created_on)}
                </span>
              </div>
            </div>
          </div>

          {/* Course Marks Table */}
          <div className="mt-6 border border-gray-500 rounded">
            {/* Table Header */}
            <div className="flex bg-gray-100 border-b border-gray-300">
              <div className="w-[15%] text-xs font-semibold p-2 text-left border-r border-gray-300">
                Code
              </div>
              <div className="w-[40%] text-xs font-bold p-2 text-left border-r border-gray-300">
                Course Name
              </div>
              <div className="w-[10%] text-xs font-bold p-2 text-center border-r border-gray-300">
                CAT 1
              </div>
              <div className="w-[10%] text-xs font-bold p-2 text-center border-r border-gray-300">
                CAT 2
              </div>
              <div className="w-[10%] text-xs font-bold p-2 text-center border-r border-gray-300">
                Exam
              </div>
              <div className="w-[10%] text-xs font-bold p-2 text-center border-r border-gray-300">
                Total
              </div>
              <div className="w-[10%] text-xs font-bold p-2 text-center">
                Grade
              </div>
            </div>

            {/* Table Rows */}
            {transcript?.marks?.map((course) => (
              <div key={course.id} className="flex border-b border-gray-300 last:border-b-0">
                <div className="w-[15%] text-xs p-3 text-left border-r border-gray-300">
                  {course.course.course_code}
                </div>
                <div className="w-[40%] text-xs p-3 text-left border-r border-gray-300">
                  {course.course.name}
                </div>
                <div className="w-[10%] text-xs p-3 text-center border-r border-gray-300">
                  {course.cat_one}
                </div>
                <div className="w-[10%] text-xs p-3 text-center border-r border-gray-300">
                  {course.cat_two}
                </div>
                <div className="w-[10%] text-xs p-3 text-center border-r border-gray-300">
                  {course.exam_marks}
                </div>
                <div className="w-[10%] text-xs p-3 text-center border-r border-gray-300">
                  {course.total_marks}
                </div>
                <div className="w-[10%] text-xs p-3 text-center">
                  {course.grade}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-2">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold">Total Units:</span>
              <span className="text-xs uppercase">{transcript?.marks?.length}</span>
            </div>
          </div>

          {/* Grading System */}
          <div className="mt-8 flex justify-start">
            <div className="flex flex-col">
              <h4 className="text-xs font-bold text-left mb-2">
                Key Grading System
              </h4>

              <div className="flex py-1 mb-1">
                <span className="text-xs font-bold text-left pr-4">Points</span>
                <span className="text-xs font-bold text-left">Grade</span>
              </div>

              {gradingData.map((item, index) => (
                <div key={index} className="flex py-1">
                  <span className="text-xs text-left pr-4">{item.points}</span>
                  <span className="text-xs text-left">{item.grade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-10 flex justify-between">
            <div className="w-2/5 mx-[5%] text-center">
              <div className="border-t border-black pt-2">
                <span className="text-xs">Registrar</span>
              </div>
            </div>
            <div className="w-2/5 mx-[5%] text-center">
              <div className="border-t border-black pt-2">
                <span className="text-xs">Dean of Studies</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-300 pt-4 text-center text-xs text-gray-500 space-y-1">
            <p>
              This is an official transcript of the Kathangaita University of Science and Technology.
            </p>
            <p>This document is void if altered in any way.</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TranscriptHTMLView;