"use client";
import { PaySlipType } from "@/definitions/payroll";
import { formatCurrency } from "@/utils/currency";
import { CustomDate, YearMonthCustomDate } from "@/utils/date";
import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";

interface Props {
  data: PaySlipType;
}

const PayslipDetailsModal = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => setIsOpen(true);

 
  const formatPayrollPeriod = () => {
    const startDate = new Date(data.payroll_period_start);
    const endDate = new Date(data.payroll_period_end);
    
    return `${startDate.toLocaleDateString('en-KE', { 
      month: 'long', 
      year: 'numeric' 
    })} (${startDate.getDate()}${getOrdinalSuffix(startDate.getDate())} - ${endDate.getDate()}${getOrdinalSuffix(endDate.getDate())})`;
  };


  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

 
  const calculateGrossPay = () => {
    const basic = parseFloat(data.basic_salary || '0');
    const allowances = parseFloat(data.total_allowances || '0');
    const overtime = parseFloat(data.total_overtime || '0');
    return basic + allowances + overtime;
  };

 
  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };



  return (
    <>
      <div onClick={handleOpenModal} className="">
        <div className="hover:bg-blue-200 inline-flex w-fit cursor-pointer items-center text-blue-600 px-2 py-2 rounded-xl shadow-sm hover:text-blue-700 transition duration-300">
          <FiEye className="text-sm text-blue-600" />
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

          <div className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center justify-start overflow-y-auto p-2 md:p-3">
            <div className="relative transform justify-center animate-fadeIn max-h-[90vh] overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all w-full sm:max-w-c-700 md:max-w-4xl px-3">
              <>
                <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-3 border-b">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Payslip - {data.staff?.user.first_name} {data.staff?.user.last_name}
                  </p>
                  <div className="flex items-center gap-2">
                   
                    <div className="flex justify-end cursor-pointer">
                      <IoCloseOutline
                        size={30}
                        onClick={handleCloseModal}
                        className="text-gray-500 hover:text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mt-4 p-4 md:p-6 lg:p-6">
                  {/* Payslip Header */}
                  <div className="text-center border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">PAYSLIP</h1>
                    <p className="text-lg text-gray-600">Pay Period: {formatPayrollPeriod()}</p>
                    <div className="mt-2">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(data.payment_status)}`}>
                        {data.payment_status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                  </div>

                  {/* Employee Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">Employee Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">Employee Name:</span>
                          <span className="text-sm text-gray-900 font-medium">
                            {data.staff?.user.first_name} {data.staff?.user.last_name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">Employee ID/Staff No:</span>
                          <span className="text-sm text-gray-900">
                            {data.staff?.staff_number || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">Department:</span>
                          <span className="text-sm text-gray-900">
                            {data.staff?.department.name || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">Payslip Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">Payslip ID:</span>
                          <span className="text-sm text-gray-900 font-mono">#{data.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">Generated On:</span>
                          <span className="text-sm text-gray-900">
                            {CustomDate(data.generated_at)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">Pay Period:</span>
                          <span className="text-sm text-gray-900">
                            {YearMonthCustomDate(data.payroll_period_start)} -{YearMonthCustomDate(data.payroll_period_end)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Earnings Section */}
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-green-200 pb-2">
                      EARNINGS
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Basic Salary</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(data.basic_salary)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total Allowances</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(data.total_allowances)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Overtime</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(data.total_overtime)}
                        </span>
                      </div>
                      <div className="border-t border-green-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-bold text-gray-800">GROSS PAY</span>
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(calculateGrossPay())}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deductions Section */}
                  <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-red-200 pb-2">
                      DEDUCTIONS
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">NSSF</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(data.nssf)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">NHIF</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(data.nhif)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">PAYE (Tax)</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(data.paye)}
                        </span>
                      </div>
                      <div className="border-t border-red-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-bold text-gray-800">TOTAL DEDUCTIONS</span>
                          <span className="text-lg font-bold text-red-600">
                            {formatCurrency(data.total_deductions)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Pay Section */}
                  <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">NET PAY</h3>
                      <p className="text-3xl font-bold text-blue-600">
                        {formatCurrency(data.net_pay)}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Amount to be paid to employee
                      </p>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Payment Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Gross Pay</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(calculateGrossPay())}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Deductions</p>
                        <p className="text-lg font-semibold text-red-600">
                          -{formatCurrency(data.total_deductions)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Net Pay</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {formatCurrency(data.net_pay)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white z-40 flex justify-between items-center py-3 px-4 border-t">
                  <p className="text-xs text-gray-500">
                    This is a computer-generated payslip and does not require a signature.
                  </p>
                  <div className="flex gap-3">
                  
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="bg-gray-600 text-white py-2 hover:bg-gray-700 text-sm px-6 rounded-md transition duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PayslipDetailsModal;