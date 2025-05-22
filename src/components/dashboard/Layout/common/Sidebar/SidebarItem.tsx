"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { JSX, useRef, useState } from "react";
import { GoChevronRight } from "react-icons/go";

type SidebarItemProps = {
  item: {
    icon?: JSX.Element;
    label: string;
    href?: string;
    children?: { label: string; href: string }[];
  };
  isOpen: boolean;
  onCloseMobile: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isOpen,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const isActive = (href?: string) => href && pathname === href;

  return (
    <>
      
      {item.href ? (
        <Link
          href={item.href}
          key={item.label}
          className={`group flex items-center px-2 py-2.5 w-full text-left
            transition-all duration-200 ease-in-out rounded-sm
            ${
              isActive(item.href)
                ? "bg-primary-100 text-primary-700 font-medium border-l-4 border-primary-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-primary-600 cursor-pointer"
            }`}
          onClick={() => {
            if (item.children) {
              setIsExpanded(!isExpanded);
            } else {
              onCloseMobile();
            }
          }}
        >
          {item.icon && (
            <span
              className={`text-xl ${
                isActive(item.href)
                  ? "text-primary-600"
                  : "text-gray-500 group-hover:text-primary-500"
              }`}
            >
              {item.icon}
            </span>
          )}
          <span
            className={`ml-3 text-sm font-normal ${
              isOpen ? "block" : "lg:hidden"
            } md:block`}
          >
            {item.label}
          </span>

          {item.children && (
            <GoChevronRight
              size={14}
              className={`ml-auto transform transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          )}
        </Link>
      ) : (
        <div
          key={item.label}
          className={`group flex items-center px-2 py-2.5 w-full text-left
            transition-all duration-200 ease-in-out rounded-sm
            text-gray-600 hover:bg-gray-100 hover:text-primary-600 cursor-pointer`}
          onClick={() => {
            if (item.children) {
              setIsExpanded(!isExpanded);
            } else {
              onCloseMobile();
            }
          }}
        >
          {item.icon && (
            <span className="text-xl text-gray-500 group-hover:text-primary-500">
              {item.icon}
            </span>
          )}
          <span
            className={`ml-3 text-sm font-normal ${
              isOpen ? "block" : "lg:hidden"
            } md:block`}
          >
            {item.label}
          </span>

          {item.children && (
            <GoChevronRight
              size={14}
              className={`ml-auto transform transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          )}
        </div>
      )}

      {/* Dropdown for Submenus */}
      {item.children && isExpanded && (
        <div ref={dropdownRef} className="pl-6 space-y-1">
          {item.children.map((child) => (
            <Link
              href={child.href}
              key={child.label}
              className={`group flex items-center px-3 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out
                ${
                  isActive(child.href)
                    ? "bg-primary-100 text-primary-700 font-medium border-l-4 border-primary-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary-600"
                }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default SidebarItem;
