'use client';

import { ReactNode } from 'react';

interface SettingsLayoutProps {
  children: ReactNode;
  customTitle?: string;
  customDescription?: string;
  customActions?: ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children,
  customTitle,
  customDescription,
  customActions,
}) => {

  const defaultContent = {
    title: 'Settings',
    description:
      'Configure Academic Years, departments, positions, leave policies,.',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">
            {customTitle || defaultContent.title}
          </div>
          <div className="text-sm text-gray-600 font-normal">
            {customDescription || defaultContent.description}
          </div>
        </div>

        {customActions && <div>{customActions}</div>}
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default SettingsLayout;
