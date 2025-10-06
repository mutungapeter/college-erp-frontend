'use client';

import { IoChevronForward } from 'react-icons/io5';
import Link from 'next/link';

const FinancialReports = () => {
  // Mappable list of financial reports
  const financialReportsList = [
    {
      title: 'Income Statement (Revenue & Expenses)',
      description:
        "Shows your college's net income and summarizes your tuition fees, grants, and operational expenses in a given time period.",
      link: '/dashboard/accounts/reports/income-statement',
    },
    {
      title: 'Balance Sheet',
      description:
        "A snapshot of your college's finances on a given day. The balance sheet calculates your institution's net worth (equity) by subtracting what you owe (liabilities) from what you own (assets).",
      link: '/dashboard/accounts/reports/balance-sheet',
    },
    {
      title: 'Cash Flow',
      description:
        'Shows how much money is entering and leaving your college over a specific period, divided into academic operations, infrastructure investments, and funding activities.',
      link: '/dashboard/accounts/reports/cash-flow',
    },
    {
      title: 'Trial Balance',
      description:
        'Shows how much money is entering and leaving your college over a specific period, divided into academic operations, infrastructure investments, and funding activities.',
      link: '/dashboard/accounts/reports/trial-balance',
    },
  ];

  return (
    <div className="w-full font-nunito">
      {/* Header */}
      <div className="mb-8 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 gap-5 md:grid-cols-2 bg-white p-6 rounded-md">
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-medium text-gray-900">
            Financial Reports
          </h2>
          <p className="text-sm font-normal text-gray-600">
            Get a clear picture of how your college is doing. Use these core
            statements to better understand your institution&apos;s financial
            health.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-gray-200">
          {financialReportsList.map((report, index) => (
            <Link
              key={index}
              href={report.link}
              className="group cursor-pointer p-4 hover:bg-gray-50 transition-all duration-200 block"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-700 mb-2">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {report.description}
                  </p>
                </div>
                <IoChevronForward className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200 flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
