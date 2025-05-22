"use client";

import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useState } from "react";
import Navbar from "../common/Header/Header";
import Menu from "../common/Sidebar/Sidebar";
import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";

export default function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); 
  const { loading, user } = useAppSelector((state: RootState) => state.auth);

  return (
    <>
      {loading || !user ? (
        <div className="flex justify-center items-center h-screen">
          <PageLoadingSpinner />
        </div>
      ) : (
        <div className="flex h-screen w-full bg-[#E3EFFE]/40 overflow-hidden">
      
          <Menu
            isOpen={isSidebarOpen}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
          
        
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-[998] md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
          
          
          <div
            className={`flex flex-col h-screen transition-all ${
              isMobileSidebarOpen
                ? "md:block"
                : isSidebarOpen
                ? "md:w-[83%] lg:w-[83%]" 
                : "md:w-[94%] lg:w-[94%]" 
            }`}
          >
           
            <Navbar
              isOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            />
            
        
            <main className="flex-1 overflow-y-auto mx-2 md:mx-2 p-2 md:p-2 md:mt-4 mt-2">
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}