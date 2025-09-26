"use client";
import { ReactNode } from "react";

type IconButtonProps = {
  onClick: () => void;
  title?: string;
  label?: string;
  icon: ReactNode;
  className?: string;
  tooltip?: string;
};

const IconButton = ({
  onClick,
  title,
  label,
  icon,
  className = "",
  tooltip,
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center space-x-2  rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md ${className}`}
    >
      {icon}
      {label && <span>{label}</span>}
      {tooltip && (
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {tooltip}
        </span>
      )}
    </button>
  );
};

export default IconButton;
