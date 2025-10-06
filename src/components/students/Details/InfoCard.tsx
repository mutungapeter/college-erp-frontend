'use client';

import { JSX } from 'react';

interface InfoCardItem {
  label: string;
  value: string | null | undefined;
}

interface InfoCardProps {
  icon: JSX.Element;
  title: string;
  items: InfoCardItem[];
}

const InfoCard = ({ icon, title, items }: InfoCardProps) => (
  <div className="bg-gray-50 rounded-lg p-4 shadow-md">
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index}>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {item.label}
          </label>
          <p className="text-sm font-medium bg-white border border-gray-200 rounded-lg py-2 px-3 text-gray-800">
            {item.value ?? '—'}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default InfoCard;
