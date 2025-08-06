"use client";
import {
  Financing,
  Investing,
  Operating,
} from "@/definitions/finance/accounts/reports";
import { useFilters } from "@/hooks/useFilters";
import { useGetCashflowQuery } from "@/store/services/finance/accounting";
import { formatCurrency } from "@/utils/currency";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiArrowBack } from "react-icons/bi";
import { exportCashflowToPDF } from "./CashflowDoc";
const CashflowReports = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, handleFilterChange } = useFilters({
    initialFilters: {
      start_date: searchParams.get("start_date") || "",
      end_date: searchParams.get("end_date") || "",
    },

    router,
    debounceTime: 100,
    debouncedFields: ["reference"],
  });

  const queryParams = useMemo(
    () => ({
      ...filters,
    }),
    [filters]
  );
  const { data, isLoading, error } = useGetCashflowQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const ActivitySection = ({
    title,
    data,
  }: {
    title: string;
    data: Operating | Investing | Financing;
  }) => {
    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <div className="bg-blue-50 px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 text-lg">
              {title} Activities
            </h3>
            <span
              className={`font-semibold ${
                parseFloat(data.totals.net_cash_flow) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(data.totals.net_cash_flow)}
            </span>
          </div>

          {/* Activity Totals */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Inflows:</span>
              <div className="font-semibold text-green-600">
                {formatCurrency(data.totals.inflows)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Total Outflows:</span>
              <div className="font-semibold text-red-600">
                {formatCurrency(data.totals.outflows)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Net {title}:</span>
              <div
                className={`font-semibold ${
                  parseFloat(data.totals.net_cash_flow) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(data.totals.net_cash_flow)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full font-nunito">
        <div className="mb-8 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cashflow</h1>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full font-nunito">
        <div className="mb-8 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cashflow</h1>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-red-500 mb-2">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600">Failed to load cash flow data</p>
          </div>
        </div>
      </div>
    );
  }
  const getPeriodText = () => {
    if (filters.start_date && filters.end_date) {
      return `For the period from ${formatDate(
        filters.start_date
      )} to ${formatDate(filters.end_date)}`;
    } else if (filters.start_date) {
      return `As of ${formatDate(filters.start_date)}`;
    } else if (filters.end_date) {
      return `As of ${formatDate(filters.end_date)}`;
    }
  };
  const handleExportPDF = async (): Promise<void> => {
    try {
      const periodText = getPeriodText() ?? "";
      await exportCashflowToPDF(data, periodText);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };
  return (
    <div className="w-full font-nunito">
      <Link
        href="/dashboard/accounts/reports"
        className="flex items-center hover:text-primary-500 w-fit cursor-pointer space-x-2 p-3 mb-4"
      >
        <BiArrowBack className="h-5 w-5" />
        <span className="text-sm">Back to Reports</span>
      </Link>
      <div className="mb-8 p-3 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cashflow</h1>
          <p className="text-gray-600">{getPeriodText()}</p>
        </div>
        <div className="flex md:flex-row flex-col gap-2 md:items-center">
          <div>
            <label
              htmlFor="start_date"
              className="block text-sm mb-2 font-medium text-gray-700"
            >
              From
            </label>
            <input
              type="date"
              name="start_date"
              onChange={handleFilterChange}
              value={filters.start_date}
              placeholder="Starting from"
              className="px-2 py-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label
              htmlFor="start_date"
              className="block text-sm mb-2 font-medium text-gray-700"
            >
              To
            </label>
            <input
              type="date"
              name="end_date"
              onChange={handleFilterChange}
              value={filters.end_date}
              placeholder="Ending at"
              className="px-2 py-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <button
          // onClick={() => exportCashflowToPDF(data)}
          onClick={handleExportPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Export PDF</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Summary Section */}
        <div className="px-6 py-6 bg-white border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            Cash Flow Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all duration-300">
              <div className="text-gray-600 text-sm mb-1">Starting Balance</div>
              <div className="text-xl font-semibold text-gray-900">
                {formatCurrency(data.summary.opening_balance)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                As of 26 July, 2024
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md hover:border-green-300 transition-all duration-300">
              <div className="text-green-700 text-sm mb-1">
                Gross Cash Inflow
              </div>
              <div className="text-xl font-semibold text-green-800">
                {formatCurrency(data.summary.gross_inflows)}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md hover:border-red-300 transition-all duration-300">
              <div className="text-red-700 text-sm mb-1">
                Gross Cash Outflow
              </div>
              <div className="text-xl font-semibold text-red-800">
                {formatCurrency(data.summary.gross_outflows)}
              </div>
            </div>
            <div
              className={`${
                parseFloat(data.summary.net_cash_change) >= 0
                  ? "bg-green-50 border-green-200 hover:border-green-300"
                  : "bg-red-50 border-red-200 hover:border-red-300"
              } border rounded-lg p-4 hover:shadow-md transition-all duration-300`}
            >
              <div
                className={`text-sm mb-1 ${
                  parseFloat(data.summary.net_cash_change) >= 0
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                Net Cash Change
              </div>
              <div
                className={`text-xl font-semibold ${
                  parseFloat(data.summary.net_cash_change) >= 0
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {formatCurrency(data.summary.net_cash_change)}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-300">
              <div className="text-blue-700 text-sm mb-1">Ending Balance</div>
              <div className="text-xl font-semibold text-blue-800">
                {formatCurrency(data.summary.ending_balance)}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                As of 26 July, 2025
              </div>
            </div>
          </div>
        </div>

        {/* Activity Sections */}
        <div>
          <ActivitySection
            title="Operating"
            data={data.Operating as Operating}
          />
          <ActivitySection
            title="Investing"
            data={data.Investing as Investing}
          />
          <ActivitySection
            title="Financing"
            data={data.Financing as Financing}
          />
        </div>
      </div>
    </div>
  );
};

export default CashflowReports;
