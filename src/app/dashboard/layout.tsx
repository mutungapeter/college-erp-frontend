"use client";

import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

import AdminDashboardLayout from "@/components/dashboard/Layout/admin/adminLayout";

import StudentDashboardLayout from "@/components/dashboard/Layout/students/studentLayout";
import AdmissionsAdminDashboardLayout from "@/components/dashboard/Layout/admissionsAdmin/admissonsAdminLayout";
import HostelAdminDashboardLayout from "@/components/dashboard/Layout/hostealAdmin/hostealAdminLayout";
import FinanceAdminDashboardLayout from "@/components/dashboard/Layout/financeAdmin/financeAdminLayout";

import AdministratorsDashboardLayout from "@/components/dashboard/Layout/admnistrators/administratorsLayout";
import LecturerDashboardLayout from "@/components/dashboard/Layout/lecturer/lecturerLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAppSelector((state: RootState) => state.auth);

  const Layout =
    user?.role.name === "Admin"
      ? AdminDashboardLayout
      : user?.role.name === "Admissions Admin"
      ? AdmissionsAdminDashboardLayout
      : user?.role.name === "Hostels Admin"
      ? HostelAdminDashboardLayout
      : user?.role.name === "Finance Admin"
      ? FinanceAdminDashboardLayout
      : user?.role.name === "Lecturer"
      ? LecturerDashboardLayout
      : user?.role.name === "Administrators"
      ? AdministratorsDashboardLayout
      : StudentDashboardLayout;

  return <Layout>{children}</Layout>;
}
