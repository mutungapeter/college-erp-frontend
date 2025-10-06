'use client';

import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useState } from 'react';
import Navbar from '../common/Header/Header';
import Menu from '../common/Sidebar/Sidebar';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import { usePermissions } from '@/hooks/getPermissions';

export default function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  const { isLoadingPermissions, permissionsError, retryPermissions } =
    usePermissions();

  // Show loading if auth is loading or permissions are loading
  const isLoading = loading || isLoadingPermissions;

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PageLoadingSpinner />
      </div>
    );
  }
  if (permissionsError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={retryPermissions}
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <>
      {/* {loading || !user ? (
        <div className="flex justify-center items-center h-screen">
          <PageLoadingSpinner />
        </div>
      ) : ( */}
      <div className="flex h-screen w-full bg-[#F5F5F5] overflow-hidden">
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
          className={`flex flex-col overflow-y-auto h-screen transition-all ${
            isMobileSidebarOpen
              ? 'md:block'
              : isSidebarOpen
                ? 'md:w-[80%] lg:w-[80%]'
                : 'md:w-[94%] lg:w-[94%]'
          }`}
        >
          <Navbar
            isOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onToggleMobileSidebar={() =>
              setIsMobileSidebarOpen(!isMobileSidebarOpen)
            }
          />

          {/* <main className="flex-1 overflow-y-auto mx-2  md:mx-2 p-2 md:p-2  md:mt-10 md:mb-10 mt-2"> */}
          <main className="flex-1  mx-2  md:mx-2 p-2 md:p-2  md:mt-10 md:mb-10 mt-2">
            {children}
          </main>
        </div>
      </div>
      {/* )} */}
    </>
  );
}
