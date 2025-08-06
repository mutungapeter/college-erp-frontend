"use client";

import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { useGetVendorDetailsQuery } from "@/store/services/finance/procurementService";
import { formatCurrency } from "@/utils/currency";
import { CustomDate, YearMonthCustomDate } from "@/utils/date";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { VendorDetailedType } from "./types";

interface Props {
  id: string | number | null;
}

const VendorDetails = ({ id }: Props) => {
  const { data, isLoading, error } = useGetVendorDetailsQuery(id, {
    skip: !id,
  });
console.log("data", data)
  const vendor = data as VendorDetailedType;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <ContentSpinner />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Vendor
          </h2>
          <p className="text-gray-600">
            An error occurred while loading vendor details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Link
        href={`/dashboard/procurement/vendors`}
        className="py-5 cursor-pointer  flex items-center space-x-2 hover:text-blue-500 font-medium"
      >
        <FiArrowLeft className="text-xl" />
        <span>Back To Vendors</span>
      </Link>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Vendor Information */}
        <div className="bg-white rounded-lg shadow border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Vendor Details
            </h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Vendor No</p>
              <p className="text-gray-900 font-medium">{vendor.vendor_no}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-gray-900 font-medium">{vendor.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-gray-900 font-medium">{vendor.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-gray-900 font-medium">{vendor.phone}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Address</p>
              <p className="text-gray-900 font-medium whitespace-pre-line">
                {vendor.address}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Business Type</p>
              <p className="text-gray-900 font-medium capitalize">
                {vendor.business_type}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-gray-900 font-medium capitalize">
                {vendor.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Company Reg. Number</p>
              <p className="text-gray-900 font-medium font-mono">
                {vendor.company_registration_number}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Tax PIN</p>
              <p className="text-gray-900 font-medium font-mono">
                {vendor.tax_pin}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Contact Person</p>
              <p className="text-gray-900 font-medium">
                {vendor.contact_person}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Contact Phone</p>
              <p className="text-gray-900 font-medium">
                {vendor.contact_person_phone}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Contact Email</p>
              <p className="text-gray-900 font-medium">
                {vendor.contact_person_email}
              </p>
            </div>
          </div>
        </div>

        {/* Awards */}
        <div className="bg-white rounded-lg shadow border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tender Awards</h2>
          </div>

          {vendor.awards.length > 0 ? (
            <div className="p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tender duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Awarded On
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {vendor.awards.map((award) => (
                    <tr key={award.id}>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {award.tender.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {YearMonthCustomDate(award.tender.start_date)} - {YearMonthCustomDate(award.tender.end_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-green-700 font-medium">
                        {formatCurrency(award.award_amount)}
                      </td>
                      <td className={`px-6 py-4 text-sm`}>
                            <span className={` border rounded-md px-3 py-1
                      ${award.status === "approved" 
                      ? "border-green-700 text-green-500 bg-green-100 " 
                      : award.status === "revoked" 
                      ? "border-red-700 text-red-500 bg-red-100 "
                      : award.status === "completed"
                      ? "border-blue-700 bg-blue-100 text-blue-500"
                      : "border-red-700" }
                        `}>
   {award.status}
                            </span>
                     
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {CustomDate(award.created_on)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No awards available for this vendor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
