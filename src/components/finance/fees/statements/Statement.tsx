import { FeeStatementDetailsType } from "@/definitions/finance/fees/payments";
import Image from "next/image";

import { BsDownload } from "react-icons/bs";
interface Props {
  data: FeeStatementDetailsType[];
  onExportPDF: () => void;
  isExporting?: boolean;
}

const FeeStatementHTML = ({ data, onExportPDF, isExporting = false }: Props) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        <h2>No data to show</h2>
      </div>
    );
  }

  const student = data[0]?.student;
  const semester = data[0]?.semester;
  const currentBalance = parseFloat(data[data.length - 1]?.balance || "0");

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Export Button */}
      <div className="flex justify-end p-4 bg-gray-50 border-b">
        <button
          onClick={onExportPDF}
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-md transition-colors ${
            isExporting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary hover:bg-blue-700'
          }`}
        >
          <BsDownload size={16} />
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>

      {/* Statement Content */}
      <div className="p-8 border-2 border-gray-300 m-4">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="flex flex-col items-center mb-4">
            <Image  
              width={100} 
              height={100} 
              src="/logo/university_logo.png" 
              alt="University Logo"
              className="w-16 h-16 mb-2"
            />
            <h1 className="text-lg font-bold text-gray-800">
              Kathangaita University of Science and Technology
            </h1>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <p>P.O. BOX. 190-50100 Kathangaita,</p>
            <p>TEL: +057-250523646/3,0745535335, FAX: +056-30150</p>
            <p>Email: info@kaust.ac.ke, web: www.kaust.ac.ke</p>
          </div>
          
          <div className="mt-4">
            <h2 className="text-sm font-bold text-gray-800">
              OFFICE OF THE REGISTRAR - FINANCE
            </h2>
            <h3 className="text-sm font-bold text-gray-800 mt-2">
              STUDENT FEE STATEMENT
            </h3>
          </div>
        </div>

        {/* Student Information Section */}
        <div className="border-t border-gray-300 pt-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase w-24">Student Name:</span>
                <span className="text-xs uppercase">
                  {student.user.first_name} {student.user.last_name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase w-24">Programme:</span>
                <span className="text-xs uppercase">
                  {student.programme?.name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase w-24">Cohort:</span>
                <span className="text-xs uppercase">
                  {student.cohort?.name}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase w-24">Reg. Number:</span>
                <span className="text-xs uppercase">
                  {student.registration_number}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase w-24">Semester:</span>
                <span className="text-xs uppercase">
                  {semester.name} {semester.academic_year}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold uppercase w-24">Statement Date:</span>
                <span className="text-xs uppercase">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Statement Table */}
        <div className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-center w-[15%]">
                    Date
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-left w-[35%]">
                    Description
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-center w-[15%]">
                    Type
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-center w-[15%]">
                    Debit (KSh)
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-center w-[15%]">
                    Credit (KSh)
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-xs font-bold text-center w-[15%]">
                    Balance (KSh)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 text-xs text-center">
                      {new Date().toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-left">
                      {transaction.statement_type === 'Invoice' 
                        ? `Tuition Fee - ${semester.name} ${semester.academic_year}` 
                        : `Fee Payment - ${transaction.statement_type}`
                      }
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-center">
                      {transaction.statement_type}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-right">
                      {parseFloat(transaction.debit) > 0 
                        ? parseFloat(transaction.debit).toLocaleString() 
                        : '-'
                      }
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-right">
                      {parseFloat(transaction.credit) > 0 
                        ? parseFloat(transaction.credit).toLocaleString() 
                        : '-'
                      }
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-right">
                      {parseFloat(transaction.balance).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <div className="flex justify-between items-center pt-2 border-t border-gray-400">
            <span className="text-sm font-bold">CURRENT BALANCE:</span>
            <span className="text-sm font-bold">
              KSh {currentBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <h4 className="text-xs font-bold mb-2">PAYMENT INFORMATION:</h4>
          <div className="text-xs space-y-1 text-gray-700">
            <p>• Payments can be made through MPESA, Bank Transfer, or at the Finance Office</p>
            <p>• All payments should quote the student registration number</p>
            <p>• For queries, contact the Finance Office: finance@kaust.ac.ke</p>
          </div>
        </div>

        {/* Signature Section */}
        <div className="flex justify-between items-end mb-6 pt-8">
          <div className="text-center">
            <div className="border-t border-gray-400 w-32 mb-1"></div>
            <span className="text-xs">Finance Officer</span>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-400 w-32 mb-1"></div>
            <span className="text-xs">Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
          <p>This is an official fee statement of Kathangaita University of Science and Technology.</p>
          <p>This document is void if altered in any way.</p>
        </div>
      </div>
    </div>
  );
};

export default FeeStatementHTML;