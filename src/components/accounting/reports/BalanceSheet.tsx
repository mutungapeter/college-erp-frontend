'use client';
import {
  BalanceSheetItem,
  BalanceSheetType,
} from '@/definitions/finance/accounts/reports';
import { useFilters } from '@/hooks/useFilters';
import { useGetBalanceSheetQuery } from '@/store/services/finance/accounting';
import { formatCurrency } from '@/utils/currency';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';
import { exportBalanceSheetToPDF } from './BalanceSheetPDFDocument'; // Import the PDF export function

export interface BalanceSheetSectionProps {
  title: string;
  items: BalanceSheetItem[];
  sectionTotal: number;
  sectionType: 'assets' | 'liabilities' | 'equity';
}

const BalanceSheetReports: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, handleFilterChange } = useFilters({
    initialFilters: {
      as_of_date:
        searchParams.get('as_of_date') ||
        new Date().toISOString().split('T')[0],
    },
    router,
    debounceTime: 100,
    debouncedFields: [],
  });

  const queryParams = useMemo(
    () => ({
      ...filters,
    }),
    [filters],
  );

  // Mock API call - replace with your actual API hook
  const { data, isLoading, error } = useGetBalanceSheetQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const BalanceSheetSection: React.FC<BalanceSheetSectionProps> = ({
    title,
    items,
    sectionTotal,
    sectionType,
  }) => {
    const hasItems = items && items.some((item) => item.balance > 0);

    const getSectionColor = () => {
      switch (sectionType) {
        case 'assets':
          return 'text-blue-600';
        case 'liabilities':
          return 'text-red-600';
        case 'equity':
          return 'text-green-600';
        default:
          return 'text-gray-600';
      }
    };

    const getSectionBgColor = () => {
      switch (sectionType) {
        case 'assets':
          return 'bg-blue-50';
        case 'liabilities':
          return 'bg-red-50';
        case 'equity':
          return 'bg-green-50';
        default:
          return 'bg-gray-50';
      }
    };

    const getBadgeColor = () => {
      switch (sectionType) {
        case 'assets':
          return 'bg-blue-200 text-blue-800';
        case 'liabilities':
          return 'bg-red-200 text-red-800';
        case 'equity':
          return 'bg-green-200 text-green-800';
        default:
          return 'bg-gray-200 text-gray-800';
      }
    };

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <div className={`${getSectionBgColor()} px-6 py-4`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
              {hasItems && (
                <span
                  className={`${getBadgeColor()} px-2 py-1 rounded-full text-xs font-medium`}
                >
                  {items.filter((item) => item.balance > 0).length} active
                </span>
              )}
            </div>
            <span className={`font-semibold ${getSectionColor()}`}>
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
                    item.balance > 0 ? getSectionColor() : 'text-gray-400'
                  }`}
                >
                  {item.balance > 0 ? formatCurrency(item.balance) : '-'}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 bg-gray-50 px-3 py-2 rounded">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">
                Total {title}:
              </span>
              <span className={`font-bold text-lg ${getSectionColor()}`}>
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
              Balance Sheet
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
              Balance Sheet
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
            <p className="text-gray-600">Failed to load balance sheet data</p>
          </div>
        </div>
      </div>
    );
  }

  const balanceSheetData = data as BalanceSheetType;

  const {
    Assets: totalAssets,
    'Liabilities + Equity': totalLiabilitiesEquity,
    Balanced: isBalanced,
  } = balanceSheetData?.Totals || {
    Assets: 0,
    'Liabilities + Equity': 0,
    Balanced: false,
  };

  const totalLiabilities =
    balanceSheetData?.Liabilities?.reduce(
      (sum, item) => sum + item.balance,
      0,
    ) || 0;
  const totalEquity =
    balanceSheetData?.Equity?.reduce((sum, item) => sum + item.balance, 0) || 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getAsOfDateText = () => {
    if (filters.as_of_date) {
      return `As of ${formatDate(filters.as_of_date)}`;
    } else {
      return `As of ${formatDate(new Date().toISOString())}`;
    }
  };

  // Updated handleExportPDF function
  const handleExportPDF = async (): Promise<void> => {
    try {
      const asOfDateText = getAsOfDateText();
      await exportBalanceSheetToPDF(balanceSheetData, asOfDateText);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      // You can add a toast notification here if you have one
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

      <div className="mb-8 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Balance Sheet
          </h1>
          <p className="text-gray-600">{getAsOfDateText()}</p>
        </div>

        {/* Date Filter */}
        <div className="flex md:flex-row flex-col gap-2 md:items-center">
          <div>
            <label
              htmlFor="as_of_date"
              className="block text-sm mb-2 font-medium text-gray-700"
            >
              As of Date
            </label>
            <input
              type="date"
              name="as_of_date"
              onChange={handleFilterChange}
              value={filters.as_of_date}
              placeholder="As of date"
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
            Balance Sheet Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-300">
              <div className="text-blue-700 text-sm mb-1">Total Assets</div>
              <div className="text-xl font-semibold text-blue-800">
                {formatCurrency(totalAssets)}
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:shadow-md hover:border-purple-300 transition-all duration-300">
              <div className="text-purple-700 text-sm mb-1">
                Liabilities + Equity
              </div>
              <div className="text-xl font-semibold text-purple-800">
                {formatCurrency(totalLiabilitiesEquity)}
              </div>
            </div>
            <div
              className={`${isBalanced ? 'bg-green-50 border-green-200 hover:border-green-300' : 'bg-red-50 border-red-200 hover:border-red-300'} border rounded-lg p-4 hover:shadow-md transition-all duration-300`}
            >
              <div
                className={`text-sm mb-1 ${isBalanced ? 'text-green-700' : 'text-red-700'}`}
              >
                Balance Status
              </div>
              <div
                className={`text-xl font-semibold ${isBalanced ? 'text-green-800' : 'text-red-800'}`}
              >
                {isBalanced ? 'Balanced' : 'Not Balanced'}
              </div>
            </div>
          </div>
        </div>

        {/* Assets, Liabilities, and Equity Sections */}
        <div>
          <BalanceSheetSection
            title="Assets"
            items={balanceSheetData?.Assets || []}
            sectionTotal={totalAssets}
            sectionType="assets"
          />
          <BalanceSheetSection
            title="Liabilities"
            items={balanceSheetData?.Liabilities || []}
            sectionTotal={totalLiabilities}
            sectionType="liabilities"
          />
          <BalanceSheetSection
            title="Equity"
            items={balanceSheetData?.Equity || []}
            sectionTotal={totalEquity}
            sectionType="equity"
          />
        </div>

        {/* Balance Verification Section */}
        <div
          className={`px-6 py-6 border-t border-gray-200 ${isBalanced ? 'bg-green-50' : 'bg-red-50'}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Balance Verification
            </h3>
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isBalanced ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}
            >
              {isBalanced ? (
                <FiCheck className="h-5 w-5 text-green-600" />
              ) : (
                <FiX className="h-5 w-5 text-red-600" />
              )}
              <span
                className={`text-lg font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}
              >
                {isBalanced ? 'BALANCED' : 'NOT BALANCED'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Assets</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatCurrency(totalAssets)}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">
                  Liabilities + Equity
                </span>
                <span className="font-bold text-lg text-purple-600">
                  {formatCurrency(totalLiabilitiesEquity)}
                </span>
              </div>
            </div>
          </div>

          {!isBalanced && (
            <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <FiX className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800">Difference:</span>
                <span className="font-bold text-red-900">
                  {formatCurrency(
                    Math.abs(totalAssets - totalLiabilitiesEquity),
                  )}
                </span>
              </div>
            </div>
          )}

          <div
            className={`rounded-lg p-4 ${isBalanced ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}
          >
            <div
              className={`flex items-center space-x-2 text-sm ${isBalanced ? 'text-green-800' : 'text-red-800'}`}
            >
              {isBalanced ? (
                <FiCheck className="h-4 w-4" />
              ) : (
                <FiAlertTriangle className="h-4 w-4" />
              )}
              <p>
                {isBalanced
                  ? 'The balance sheet is balanced. Assets equal Liabilities plus Equity.'
                  : 'The balance sheet is not balanced. Please review your entries to ensure the accounting equation is satisfied.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetReports;
