"use client";
import React from "react";
import Image from "next/image";
import { formatCurrency } from "@/utils/currency";

export interface FeeStatementStudent {
  id: number;
  registration_number: string;
  name: string;
  programme: string;
  cohort: string;
  balance: string; // ✅ added from backend
  statements: FeeStatementRecord[];
}

interface FeeStatementRecord {
  reference: string;
  statement_type: string;
  debit: string;
  credit: string;
  balance: string;
  payment_method: string | null;
  semester: string;
  created_on: string;
}

const StudentFeeStatementHTMLView = ({
  data,
}: {
  data: FeeStatementStudent[];
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        <h2>No fee statement data available</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.map((student) => {
        const { statements } = student;
        if (!statements || statements.length === 0) return null;

        const totalDebits = statements.reduce(
          (sum, s) => sum + parseFloat(s.debit || "0"),
          0
        );
        const totalCredits = statements.reduce(
          (sum, s) => sum + parseFloat(s.credit || "0"),
          0
        );

        // ✅ use backend balance instead of computing
        const currentBalance = parseFloat(student.balance || "0");

        return (
          <div
            key={student.id}
            className="bg-white border border-gray-300 mt-5 p-6 shadow-md text-sm leading-relaxed max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="mb-6 border-b-2 border-primary pb-4 text-center">
              <div className="mb-3 flex flex-col items-center">
                <Image
                  src="/logo/university_logo.png"
                  alt="College Logo"
                  className="w-[120px] h-[120px] mb-2"
                  width={120}
                  height={120}
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                MAWENG COLLEGE
              </h1>
              <div className="text-sm leading-tight space-y-1 text-gray-600">
                <p>P.O. BOX. 180-90119 Matuu</p>
                <p>TEL: 0728715810</p>
                <p>Email: mawengcollege@gmail.com</p>
              </div>
              <h2 className="text-base font-bold mt-3 text-gray-700">
                FEE STATEMENT
              </h2>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded">
              <div className="space-y-2">
                <p>
                  <span className="font-bold text-gray-700">Student: </span>
                  {student.name}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Reg No: </span>
                  {student.registration_number}
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-bold text-gray-700">Programme: </span>
                  {student.programme}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Cohort: </span>
                  {student.cohort}
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-bold text-gray-700">Term: </span>
                  {statements[0].semester}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Year: </span>
                  {new Date(statements[0].created_on).getFullYear()}
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-bold text-gray-700">Balance: </span>
                  <span className="font-bold">
                    {formatCurrency(currentBalance)}
                  </span>
                </p>
              </div>
            </div>

            {/* Statement Table */}
            <div className="mb-6 border border-gray-300 rounded">
              <div className="flex bg-gray-100 border-b border-gray-300 font-bold">
                <div className="w-24 p-2 text-center border-r">Date</div>
                <div className="flex-1 p-2 border-r">Type</div>
                <div className="w-48 p-2 text-center border-r">Reference</div>
                <div className="w-28 p-2 text-center border-r">Term</div>
                <div className="w-24 p-2 text-center border-r">Debit</div>
                <div className="w-24 p-2 text-center border-r">Credit</div>
                <div className="w-28 p-2 text-center">Balance</div>
              </div>

              {statements.map((s, idx) => (
                <div
                  key={s.reference}
                  className={`flex border-b border-gray-200 last:border-b-0 ${
                    idx % 2 === 1 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="w-24 p-2 text-center border-r">
                    {new Date(s.created_on).toLocaleDateString("en-GB")}
                  </div>
                  <div className="flex-1 p-2 border-r">{s.statement_type}</div>
                  <div className="w-48 p-2 text-center border-r">{s.reference}</div>
                  <div className="w-28 p-2 text-center border-r">{s.semester}</div>
                  <div className="w-24 p-2 text-center border-r">
                    {parseFloat(s.debit) > 0 ? formatCurrency(s.debit) : "-"}
                  </div>
                  <div className="w-24 p-2 text-center border-r">
                    {parseFloat(s.credit) > 0 ? formatCurrency(s.credit) : "-"}
                  </div>
                  <div className="w-28 p-2 text-center font-medium">
                    {formatCurrency(parseFloat(s.balance))}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 bg-gray-50 border border-primary rounded">
              <h3 className="font-bold text-gray-700 mb-3">STATEMENT SUMMARY</h3>
              <div className="space-y-1">
                <div className="flex justify-between border-b border-primary py-1">
                  <span>Total Invoiced:</span>
                  <span className="font-medium">{formatCurrency(totalDebits)}</span>
                </div>
                <div className="flex justify-between border-b border-primary py-1">
                  <span>Total Paid:</span>
                  <span className="font-medium">{formatCurrency(totalCredits)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Outstanding Balance:</span>
                  <span className="font-medium">{formatCurrency(currentBalance)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-gray-300 text-xs text-gray-600 space-y-1">
              <p>This is an official fee statement of Maweng College.</p>
              <p>For queries regarding this statement, please contact the bursar.</p>
              <p>Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentFeeStatementHTMLView;
