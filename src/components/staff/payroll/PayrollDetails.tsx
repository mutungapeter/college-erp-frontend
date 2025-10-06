'use client';
import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { FiEye } from 'react-icons/fi';
import { PayrollType } from '@/definitions/payroll';
import { formatCurrency } from '@/utils/currency';
import { CustomDate } from '@/utils/date';

interface Props {
  data: PayrollType;
}

const PayrollDetailsModal = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => setIsOpen(true);

  const calculateTotalSalary = () => {
    const basic = parseFloat(data.basic_salary || '0');
    const house = parseFloat(data.house_allowance || '0');
    const transport = parseFloat(data.transport_allowance || '0');
    const other = parseFloat(data.other_allowances || '0');
    return basic + house + transport + other;
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="flex items-center justify-center p-2 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700 cursor-pointer transition duration-200 shadow-sm hover:shadow-md"
      >
        <FiEye className="text-sm text-indigo-600" />
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

          <div className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center justify-start overflow-y-auto p-2 md:p-3">
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh] overflow-y-auto
             rounded-md bg-white text-left shadow-xl transition-all w-full sm:max-w-c-600 md:max-w-600 "
            >
              <>
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-3 mt-2 border-b">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Payroll Details - {data.staff?.user.first_name}{' '}
                    {data.staff?.user.last_name}
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={28}
                      onClick={handleCloseModal}
                      className="text-red-500 bg-red-100 p-1 rounded-md hover:text-white hover:bg-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-6 mt-4 p-4 md:p-6 lg:p-6">
                  <div className="bg-slate-100 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      Staff Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium underline underline-offset-4 decoration-gray-600 text-gray-600 mb-1">
                          Staff Name
                        </label>
                        <p className="text-sm text-gray-900">
                          {data.staff?.user.first_name}{' '}
                          {data.staff?.user.last_name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 underline underline-offset-4 decoration-gray-600">
                          Employee ID/Staff No
                        </label>
                        <p className="text-sm text-gray-900">
                          {data.staff.staff_number || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Salary Breakdown */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      Salary Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Basic Salary
                        </label>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(data.basic_salary)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          House Allowance
                        </label>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(data.house_allowance)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Transport Allowance
                        </label>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(data.transport_allowance)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Other Allowances
                        </label>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(data.other_allowances)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex justify-between items-center">
                        <label className="text-base font-semibold text-gray-800">
                          Total Gross Salary
                        </label>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(calculateTotalSalary())}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Statutory Information */}
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      Statutory Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          KRA PIN
                        </label>
                        <p className="text-sm text-gray-900 font-mono">
                          {data.kra_pin || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          NSSF Number
                        </label>
                        <p className="text-sm text-gray-900 font-mono">
                          {data.nssf_number || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          NHIF Number
                        </label>
                        <p className="text-sm text-gray-900 font-mono">
                          {data.nhif_number || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Payment Frequency
                        </label>
                        <p className="text-sm text-gray-900 capitalize">
                          {data.payment_frequency || 'Monthly'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Banking Information */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      Banking Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Bank Name
                        </label>
                        <p className="text-sm text-gray-900">
                          {data.bank_name || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Bank Account Number
                        </label>
                        <p className="text-sm text-gray-900 font-mono">
                          {data.bank_account_number || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          M-Pesa Number
                        </label>
                        <p className="text-sm text-gray-900 font-mono">
                          {data.mpesa_number || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      Record Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Created On
                        </label>
                        <p className="text-sm text-gray-900">
                          {CustomDate(data.created_on)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Last Updated
                        </label>
                        <p className="text-sm text-gray-900">
                          {CustomDate(data.updated_on)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white z-40 flex justify-end items-center py-2 px-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className=" text-red-700  border border-red-700 py-2  text-sm px-6 rounded-md transition duration-200"
                  >
                    Close
                  </button>
                </div>
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PayrollDetailsModal;
