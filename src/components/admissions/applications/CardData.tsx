'use client';
import Link from 'next/link';
import React from 'react';
import { GoArrowUpRight } from 'react-icons/go';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  count: string | number;
  // subtitle?: string;
  iconBgColor?: string;
  href?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  count,
  // subtitle,
  href,
  iconBgColor = 'bg-blue-500',
}) => {
  return (
    <div
      className="relative bg-white rounded-xl
    border border-gray-200 shadow-md hover:shadow-lg
     transition-shadow duration-200 w-full min-h-[100px] p-2.5 group"
    >
      {/* Header with title and icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-gray-600 font-medium text-sm">{title}</div>
        <div className={`${iconBgColor} p-2 rounded-lg flex-shrink-0`}>
          <div className="text-white text-sm">{icon}</div>
        </div>
      </div>

      {/* Main count/value */}
      <div className="mb-3 mt-2 flex justify-between">
        <div className="text-2xl font-bold text-gray-900 tracking-tight">
          {typeof count === 'number' ? count.toLocaleString() : count}
        </div>
        {href && (
          <div className="flex justify-end">
            <Link
              href={href}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-600 transition-colors duration-150"
            >
              <span className="mr-1">View</span>
              <GoArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Professional View Link Options - Choose one */}

      {/* Option 1: Subtle button style */}
      {/* {href && (
        <Link
          href={href}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 hover:text-gray-700 transition-colors duration-150 group-hover:bg-gray-100"
        >
          View Details
          <GoArrowUpRight className="ml-1 h-3 w-3" />
        </Link>
      )} */}

      {/* Option 2: Underlined link style 
      {href && (
        <Link
          href={href}
          className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 border-b border-transparent hover:border-blue-300 transition-all duration-150"
        >
          View Details
          <GoArrowUpRight className="ml-1 h-3 w-3" />
        </Link>
      )}
      */}

      {/* Option 3: Minimal professional style  */}
      {/* {href && (
        <Link
          href={href}
          className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors duration-150"
        >
          View Details
          <GoArrowUpRight className="ml-1 h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </Link>
      )} */}

      {/* Option 4: Badge style 
      {href && (
        <Link
          href={href}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-150"
        >
          View
          <GoArrowUpRight className="ml-1 h-3 w-3" />
        </Link>
      )}
      */}

      {/* Option 5: Right-aligned subtle link  */}
      {/* {href && (
        <div className="flex justify-end">
          <Link
            href={href}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-600 transition-colors duration-150"
          >
            <span className="mr-1">View</span>
            <GoArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )} */}
    </div>
  );
};

export default MetricCard;
