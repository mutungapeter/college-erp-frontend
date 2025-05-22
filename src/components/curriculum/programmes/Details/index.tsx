"use client";

import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { ProgrammeDetailsType } from "@/definitions/curiculum";
import { useGetProgrammeQuery } from "@/store/services/curriculum/programmesService";
import Link from "next/link";
import { useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import {
  IoArrowBackOutline,
  IoBookOutline,
  IoCallOutline,
  IoListOutline,
  IoLocationOutline,
  IoMailOutline,
  IoSchoolOutline,
} from "react-icons/io5";
import AddUnit from "./AddUnit";
import EditUnit from "./Edit";

interface Props {
  programme_id: string;
}

const ProgrammeDetails = ({ programme_id }: Props) => {
  const { data, isLoading, isError, refetch } =
    useGetProgrammeQuery(programme_id);
  const programmeDetails = data as ProgrammeDetailsType;
  const [activeTab, setActiveTab] = useState("overview");
console.log("data", data)
  if (isLoading) {
    return <ContentSpinner />;
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">
            Failed to load programme details. Please try again later.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleTabChange = (tab: "overview" | "units") => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white ">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard/curriculum/programmes"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <IoArrowBackOutline className="mr-2" size={20} />
            <span>Back to Programmes</span>
          </Link>
        </div>
      </div>

      <div className="px-2 py-3">
        <div className="container mx-auto px-4 py-8 bg-gradient-to-r from-slate-100 to-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {programmeDetails.name}
              </h1>
              <div className="flex items-center space-x-2 text-white">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {programmeDetails.code}
                </span>
                <span className="flex items-center text-blue-600">
                  <FaGraduationCap className="mr-1 text-blue-600" />
                  {programmeDetails.level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => handleTabChange("overview")}
              className={`px-4 py-4 font-medium whitespace-nowrap ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabChange("units")}
              className={`px-4 py-4 font-medium whitespace-nowrap ${
                activeTab === "units"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Course Units
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <IoSchoolOutline className="text-blue-600 mr-2" size={24} />
                <h2 className="text-xl font-semibold">School Information</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="font-medium">{programmeDetails.school.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <div className="flex items-center">
                    <IoMailOutline className="text-gray-500 mr-2" />
                    <a
                      href={`mailto:${programmeDetails.school.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {programmeDetails.school.email}
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <div className="flex items-center">
                    <IoCallOutline className="text-gray-500 mr-2" />
                    <a
                      href={`tel:${programmeDetails.school.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {programmeDetails.school.phone}
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <div className="flex items-center">
                    <IoLocationOutline className="text-gray-500 mr-2" />
                    <p>{programmeDetails.school.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <HiOutlineBuildingLibrary
                  className="text-blue-600 mr-2"
                  size={24}
                />
                <h2 className="text-xl font-semibold">
                  Department Information
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="font-medium">
                    {programmeDetails.department.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Office</p>
                  <div className="flex items-center">
                    <IoLocationOutline className="text-gray-500 mr-2" />
                    <p>{programmeDetails.department.office}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">School</p>
                  <p>{programmeDetails.department.school.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <IoBookOutline className="text-blue-600 mr-2" size={24} />
                <h2 className="text-xl font-semibold">Programme Summary</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Programme Code</p>
                  <p className="font-medium">{programmeDetails.code}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Level</p>
                  <p className="font-medium">{programmeDetails.level}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Units</p>
                  <p className="font-medium">{programmeDetails.units.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "units" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
                <div>

              <div className="flex items-center">
                <IoListOutline className="text-blue-600 mr-2" size={24} />
                <h2 className="text-xl font-semibold">Course Units</h2>
              </div>
              <p className="text-gray-500 mt-1">
                Total of {programmeDetails.units.length} units
              </p>
                </div>
                <div>
                    <AddUnit refetchData={refetch} data={programmeDetails} programme_id={programmeDetails.id} />
                </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Course Code
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Course Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Department
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {programmeDetails.units.map((unit) => (
                    <tr key={unit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-blue-600">
                          {unit.course_code}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {unit.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {unit.department.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <EditUnit refetchData={refetch} data={unit}  />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgrammeDetails;
