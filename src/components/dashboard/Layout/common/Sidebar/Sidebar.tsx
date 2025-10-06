'use client';

import Image from 'next/image';
import { VscClose } from 'react-icons/vsc';
import { menuItems } from '../../admin/MenuLinks/menu';
import SidebarItem from './SidebarItem';
import { RolePermission } from '@/store/definitions';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import React from 'react';
import { MenuItem } from '@/definitions/menu';
const Menu = ({
  isOpen,
  isMobileOpen,
  onCloseMobile,
}: {
  isOpen: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  console.log('user', user);

  const permissions: RolePermission[] = React.useMemo(() => {
    return user?.role?.permissions ?? [];
  }, [user?.role?.permissions]);

  const allowedCodes = React.useMemo(() => {
    return new Set(
      permissions
        .filter((p) => p?.can_view)
        .map((p) => p?.module?.code)
        .filter(Boolean),
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
  return (
    <div
      className={`fixed bg-white border-r
         border-gray-200 left-0 top-0 z-50 font-montserrat
          duration-300 ease-linear h-screen transition-all md:relative md:translate-x-0 
    ${isMobileOpen ? 'translate-x-0 w-[80%]' : '-translate-x-full'}
    ${isOpen ? 'md:w-[20%] lg:w-[20%]' : 'md:w-[6%] lg:w-[6%]'}

   px-4 py-3 flex flex-col`}
    >
      <div className="flex items-center justify-between  w-full">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <Image
                src="/logo/university_logo.png"
                alt="University Logo"
                width={40}
                height={40}
                className="w-[50px] h-[50px] object-contain"
              />
            </div>
            {isOpen && (
              <div className="text-left">
                <h1 className="text-sm md:text-lg   font-poppins leading-tight ">
                  Maweng College
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
          {filteredMenu.map((category) => (
            <div
              className="flex flex-col mb-5"
              key={category.title || Math.random()}
            >
              {(isOpen || isMobileOpen) && (
                <h3 className="ml-3 py-2.5 font-montserrat font-medium text-[11px] text-primary uppercase mb-2">
                  {category.title}
                </h3>
              )}
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
