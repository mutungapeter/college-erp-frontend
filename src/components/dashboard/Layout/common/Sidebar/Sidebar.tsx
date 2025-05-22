"use client";

import Link from "next/link";
import { VscClose } from "react-icons/vsc";
import SidebarItem from "./SidebarItem";
import { menuItems } from "../../admin/MenuLinks/menu";

const Menu = ({
  isOpen,
  isMobileOpen,
  onCloseMobile,
}: {
  isOpen: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}) => {
 
  return (
    <div
      className={`fixed bg-sidebar-bg left-0 top-0 z-[999] duration-300 ease-linear h-screen transition-all md:relative md:translate-x-0 
    ${isMobileOpen ? "translate-x-0 w-[80%]" : "-translate-x-full"}
    ${isOpen ? "md:w-[17%] lg:w-[17%]" : "md:w-[6%] lg:w-[6%]"} 
    p-4 flex flex-col`}
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {isOpen && (
            <div className="flex h-[45px] w-full md:h-[55px] flex-col">
              <h2 className="text-lg md:text-lg font-bold tracking-tight text-primary uppercase">
                College ERP
              </h2>
            </div>
          )}
        </Link>

        <VscClose
          onClick={onCloseMobile}
          className="absolute top-4 right-4 md:hidden cursor-pointer text-3xl text-gray-600 hover:text-primary"
        />
      </div>

      {/* Fix: Create a separate scrollable container that takes the remaining height */}
      <div className="flex-1 flex flex-col mt-8 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1">
          {menuItems.map((category) => (
            <div className="flex flex-col mb-5" key={category.title}>
              <div className="space-y-1 flex flex-col">
                {category.items.map((item) => (
                  <SidebarItem 
                    key={item.label} 
                    item={item} 
                    isOpen={isOpen} 
                    onCloseMobile={onCloseMobile} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;