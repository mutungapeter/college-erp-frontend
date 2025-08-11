"use client";

import Image from "next/image";
import { VscClose } from "react-icons/vsc";
import { menuItems } from "../../admin/MenuLinks/menu";
import SidebarItem from "./SidebarItem";
import { RolePermission } from "@/store/definitions";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import React from "react";
import { MenuItem } from "@/definitions/menu";
const Menu = ({
  isOpen,
  isMobileOpen,
  onCloseMobile,
}: {
  isOpen: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}) => {
  const { user,loading } = useAppSelector(
    (state: RootState) => state.auth
  );
  console.log("user", user);
 const permissions: RolePermission[] = React.useMemo(() => {
    return user?.role?.permissions ?? [];
  }, [user?.role?.permissions]);

  const allowedCodes = React.useMemo(() => {
    return new Set(
      permissions
        .filter((p) => p?.can_view)
        .map((p) => p?.module?.code)
        .filter(Boolean)
    );
  }, [permissions]);

  const filteredMenu = React.useMemo(() => {
    return menuItems
      .map((group) => {
        const visibleItems = group.items.filter((item: MenuItem) => {
          if (item.code) {
            return allowedCodes.has(item.code);
          }
          return true;
        });

        return visibleItems.length > 0
          ? { ...group, items: visibleItems }
          : null;
      })
      .filter(Boolean) as typeof menuItems;
  }, [allowedCodes]);
  if (loading) {
  return <div>Loading menu...</div>;
}
  return (
    <div
      className={`fixed bg-white shadow-sm left-0 top-0 z-[999] duration-300 ease-linear h-screen transition-all md:relative md:translate-x-0 
    ${isMobileOpen ? "translate-x-0 w-[80%]" : "-translate-x-full"}
    ${isOpen ? "md:w-[17%] lg:w-[17%]" : "md:w-[6%] lg:w-[6%]"} 
   px-4 py-3 flex flex-col`}
    >
      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <Image
                src="/logo/logo.png"
                alt="University Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
            </div>
            {isOpen && (
              <div className="text-left">
                <h1 className="text-lg md:text-md font-semibold leading-tight uppercase">
                  College ERP
                </h1>
              </div>
            )}
          </div>
        </div>

        <VscClose
          onClick={onCloseMobile}
          className="absolute top-4 right-4 md:hidden cursor-pointer text-3xl text-gray-600 hover:text-primary"
        />
      </div>

      {/* Fix: Create a separate scrollable container that takes the remaining height */}
      <div className="flex-1 flex flex-col mt-8 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1">
          {/* {menuItems.map((category) => (
            <div className="flex flex-col mb-5" key={category.title}>
              <h3 className="text-sm font-medium text-primary uppercase mb-2">
                {category.title}
              </h3>
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
          ))} */}
          {filteredMenu.map((category) => (
            <div className="flex flex-col mb-5" key={category.title || Math.random()}>
              <h3 className="text-sm font-medium text-primary uppercase mb-2">
                {category.title}
              </h3>
              <div className="space-y-1 flex flex-col">
                {category.items.map((item: MenuItem) => (
                  <SidebarItem
                    key={item.code || item.label}
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
