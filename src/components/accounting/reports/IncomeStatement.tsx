"use client";
import {
  Expense,
  Income,
  IncomeStatementType,
} from "@/definitions/finance/accounts/reports";
import { useFilters } from "@/hooks/useFilters";
import { useGetIncomeStatementQuery } from "@/store/services/finance/accounting";
import { formatCurrency } from "@/utils/currency";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { BiArrowBack } from "react-icons/bi";
import { exportIncomeStatementToPDF } from "./IncomeStatementPDFDocument"; // Import the PDF export function

interface IncomeSectionProps {
  title: string;
  items: Income[] | Expense[];
  isExpense?: boolean;
  sectionTotal: number;
}

const IncomeStatementReports: React.FC = () => {
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

  const { data, isLoading, error } = useGetIncomeStatementQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const IncomeSection: React.FC<IncomeSectionProps> = ({
    title,
    items,
    isExpense = false,
    sectionTotal,
  }) => {
    const hasItems =
      items && items.some((item) => parseFloat(item.amount.toString()) > 0);

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <div className="bg-blue-50 px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
              {hasItems && (
                <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {
                    items.filter(
                      (item) => parseFloat(item.amount.toString()) > 0
                    ).length
                  }{" "}
                  active
                </span>
              )}
            </div>
            <span
              className={`font-semibold ${
                isExpense ? "text-red-600" : "text-green-600"
              }`}
            >
              {formatCurrency(sectionTotal)}
            </span>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 px-3 bg-white rounded border border-gray-100"
              >
                <span className="text-sm text-gray-700">{item.name}</span>
                <span
                  className={`text-sm font-medium ${
                    parseFloat(item.amount.toString()) > 0
                      ? isExpense
                        ? "text-red-600"
                        : "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {parseFloat(item.amount.toString()) > 0
                    ? formatCurrency(item.amount)
                    : "-"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 bg-gray-50 px-3 py-2 rounded">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">
                Total {title}:
              </span>
              <span
                className={`font-bold text-lg ${
                  isExpense ? "text-red-600" : "text-green-600"
                }`}
              >
                {formatCurrency(sectionTotal)}
              </span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Income Statement
            </h1>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Income Statement
            </h1>
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
            <p className="text-gray-600">
              Failed to load income statement data
            </p>
          </div>
        </div>
      </div>
    );
  }

  const incomeStatementData = data as IncomeStatementType;

  const { total_income, total_expenses, net_profit, profit_margin } =
    incomeStatementData?.totals || {
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      profit_margin: 0,
    };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPeriodText = () => {
    if (filters.start_date && filters.end_date) {
      return `For the period from ${formatDate(
        filters.start_date
      )} to ${formatDate(filters.end_date)}`;
    } else if (filters.start_date) {
      return `For the period ending ${formatDate(filters.start_date)}`;
    } else if (filters.end_date) {
      return `For the period ending ${formatDate(filters.end_date)}`;
    } else {
      return `For the period ending ${formatDate(new Date().toISOString())}`;
    }
  };

  // Updated handleExportPDF function
  const handleExportPDF = async (): Promise<void> => {
    try {
      const periodText = getPeriodText();
      await exportIncomeStatementToPDF(incomeStatementData, periodText);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      // You can add a toast notification here if you have one
    }
  };

  return (
    <div className="w-full font-nunito">
      <Link
        href="/dashboard/accounts/reports"
        className="flex items-center w-fit hover:text-primary-500 cursor-pointer space-x-2 p-3 mb-4"
      >
        <BiArrowBack className="h-5 w-5" />
        <span className="text-sm">Back to Reports</span>
      </Link>
      <div className="mb-8 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Income Statement
          </h1>
          <p className="text-gray-600">{getPeriodText()}</p>
        </div>

        {/* Date Filters */}
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

        {/* Export PDF Button */}
        <button
          onClick={handleExportPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          type="button"
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
            Profit & Loss Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md hover:border-green-300 transition-all duration-300">
              <div className="text-green-700 text-sm mb-1">Total Revenue</div>
              <div className="text-xl font-semibold text-green-800">
                {formatCurrency(total_income)}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md hover:border-red-300 transition-all duration-300">
              <div className="text-red-700 text-sm mb-1">Total Expenses</div>
              <div className="text-xl font-semibold text-red-800">
                {formatCurrency(total_expenses)}
              </div>
            </div>
            <div
              className={`${
                parseFloat(net_profit.toString()) >= 0
                  ? "bg-green-50 border-green-200 hover:border-green-300"
                  : "bg-red-50 border-red-200 hover:border-red-300"
              } border rounded-lg p-4 hover:shadow-md transition-all duration-300`}
            >
              <div
                className={`text-sm mb-1 ${
                  parseFloat(net_profit.toString()) >= 0
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                Net Profit/Loss
              </div>
              <div
                className={`text-xl font-semibold ${
                  parseFloat(net_profit.toString()) >= 0
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {formatCurrency(net_profit)}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-300">
              <div className="text-blue-700 text-sm mb-1">Profit Margin</div>
              <div className="text-xl font-semibold text-blue-800">
                {profit_margin.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Income and Expense Sections */}
        <div>
          <IncomeSection
            title="Revenue"
            items={incomeStatementData?.income || []}
            sectionTotal={total_income}
          />
          <IncomeSection
            title="Expenses"
            items={incomeStatementData?.expenses || []}
            isExpense={true}
            sectionTotal={total_expenses}
          />
        </div>

        {/* Net Profit Section */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Net Profit/Loss</h3>
            <span
              className={`text-2xl font-bold ${
                parseFloat(net_profit.toString()) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(net_profit)}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {parseFloat(net_profit.toString()) >= 0
              ? `Your business generated a profit of ${formatCurrency(
                  net_profit
                )} for this period.`
              : `Your business incurred a loss of ${formatCurrency(
                  Math.abs(net_profit)
                )} for this period.`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStatementReports;
