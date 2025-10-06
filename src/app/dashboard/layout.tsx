'use client';

// import { useAppSelector } from "@/store/hooks";
// import { RootState } from "@/store/store";

import AdminDashboardLayout from '@/components/dashboard/Layout/admin/adminLayout';
// import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
