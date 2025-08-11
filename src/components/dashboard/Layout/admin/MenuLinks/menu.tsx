
import { MenuGroup } from "@/definitions/menu";
import {
  AiOutlineDashboard,
  AiOutlineFileDone,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BiBookBookmark, BiBuilding, BiReceipt } from "react-icons/bi";
import { BsBoxSeam, BsCalendarCheck, BsClipboardData } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
import { GrMoney } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import {
  IoArchiveOutline,
  IoBedOutline,
  IoBriefcaseOutline,
  IoCalendarClearOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoLibraryOutline,
  IoPeopleOutline,
  IoPieChartOutline,
  IoSchoolOutline,
  IoSettingsOutline
} from "react-icons/io5";
import { LiaClipboardListSolid } from "react-icons/lia";
import { LuCalendarCheck2, LuLayoutTemplate, LuPackageCheck } from "react-icons/lu";
import { MdAccessTime, MdOutlineRequestQuote } from "react-icons/md";
import { PiChartLineUp, PiExam, PiStudentDuotone, PiUsersThree } from "react-icons/pi";
import { RiContractLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import { SlBriefcase } from "react-icons/sl";
import { TbBuildingWarehouse, TbFileInvoice, TbReportAnalytics } from "react-icons/tb";

export const menuItems: MenuGroup[] = [
  {
    title: "",
    items: [
      {
        code: "dashboard",
        icon: <AiOutlineDashboard />,
        label: "Dashboard",
        href: "/dashboard",
      },
    ],
  },
  {
    title: "Academics",
    items: [
      { code: "academics_campuses", icon: <BiBuilding />, label: "Campuses", href: "/dashboard/curriculum/campuses" },
      { code: "academics_schools", icon: <IoSchoolOutline />, label: "Schools", href: "/dashboard/curriculum/schools" },
      { code: "academics_departments", icon: <BsClipboardData />, label: "Departments", href: "/dashboard/curriculum/departments" },
      { code: "academics_programmes", icon: <IoSchoolOutline />, label: "Programmes", href: "/dashboard/curriculum/programmes" },
      { code: "academics_units", icon: <BiBookBookmark />, label: "Units", href: "/dashboard/curriculum/units" },
      { code: "academics_cohorts", icon: <BsClipboardData />, label: "Cohorts", href: "/dashboard/curriculum/cohorts" },
      { code: "academics_sessions", icon: <IoDocumentTextOutline />, label: "Sessions", href: "/dashboard/curriculum/course-sessions" },
      { code: "academics_semesters", icon: <TbFileInvoice />, label: "Semesters", href: "/dashboard/curriculum/semesters" },
      { code: "academics_academic_years", icon: <IoCalendarClearOutline />, label: "Academic Years", href: "/dashboard/curriculum/academic-years" },
    ],
  },
  {
    title: "Students",
    items: [
      { code: "students_students", icon: <PiStudentDuotone />, label: "Students", href: "/dashboard/students" },
      { code: "students_admissions", icon: <FaRegUser />, label: "Admissions", href: "/dashboard/admissions/applications" },
      { code: "students_marks", icon: <AiOutlineFileDone />, label: "Marks", href: "/dashboard/academics/marks" },
      { code: "students_assessment_list", icon: <TbReportAnalytics />, label: "Assessment List", href: "/dashboard/academics/marks/assessment-list" },
      { code: "students_transcripts", icon: <PiExam />, label: "Transcripts", href: "/dashboard/academics/transcripts" },
    ],
  },
  {
    title: "Staff & HR",
    items: [
      { code: "staff_hr_all_staff", icon: <IoPeopleOutline />, label: "All Staff", href: "/dashboard/staff" },
      { code: "staff_hr_positions", icon: <IoBriefcaseOutline />, label: "Positions", href: "/dashboard/staff/positions" },
      { code: "staff_hr_leave_entitlements", icon: <IoCalendarOutline />, label: "Leave Entitlements", href: "/dashboard/staff/leaves/leave-entitlements" },
      { code: "staff_hr_leave_applications", icon: <IoCalendarClearOutline />, label: "Leave Applications", href: "/dashboard/staff/leaves/leave-applications" },
      { code: "staff_hr_leaves", icon: <BsCalendarCheck />, label: "Leaves", href: "/dashboard/staff/leaves" },
    ],
  },
  {
    title: "Finance",
    items: [
      { code: "finance_fee_invoices", icon: <TbFileInvoice />, label: "Fee Invoices", href: "/dashboard/finance/fees/invoices" },
      { code: "finance_fee_statements", icon: <HiOutlineDocumentReport />, label: "Fee Statements", href: "/dashboard/finance/fees/fee-statement" },
      { code: "finance_fee_structure", icon: <LuLayoutTemplate />, label: "Fee Structure", href: "/dashboard/finance/fees/fee-structure" },
      { code: "finance_fee_payments", icon: <LiaClipboardListSolid />, label: "Fee Payments", href: "/dashboard/finance/fees/fees-payments" },
      { code: "finance_library_payments", icon: <RiMoneyDollarCircleLine />, label: "Library Payments", href: "/dashboard/finance/library-payments" },
    ],
  },
  {
    title: "Payroll",
    items: [
      { code: "payroll_payroll", icon: <MdOutlineRequestQuote />, label: "Payroll", href: "/dashboard/payroll" },
      { code: "payroll_payslips", icon: <BiReceipt />, label: "Payslips", href: "/dashboard/payroll/payslips" },
      { code: "payroll_overtime_payments", icon: <MdAccessTime />, label: "Overtime Payments", href: "/dashboard/payroll/overtime-payments" },
    ],
  },
  {
    title: "Library",
    items: [
      { code: "library_books", icon: <IoLibraryOutline />, label: "Books", href: "/dashboard/library/books" },
      { code: "library_members", icon: <PiUsersThree />, label: "Members", href: "/dashboard/library/members" },
      { code: "library_borrowed_books", icon: <BsClipboardData />, label: "Borrowed Books", href: "/dashboard/library/borrowed-books" },
      { code: "library_fines", icon: <RiMoneyDollarCircleLine />, label: "Fines", href: "/dashboard/library/borrowed-books-fines" },
    ],
  },
  {
    title: "Hostel",
    items: [
      { code: "hostel_bookings", icon: <LuCalendarCheck2 />, label: "Bookings", href: "/dashboard/hostels/bookings" },
      { code: "hostel_rooms", icon: <IoBedOutline />, label: "Rooms", href: "/dashboard/hostels" },
    ],
  },
  {
    title: "Procurement",
    items: [
      { code: "procurement_orders", icon: <AiOutlineShoppingCart />, label: "Orders", href: "/dashboard/procurement/orders" },
      { code: "procurement_vendors", icon: <TbBuildingWarehouse />, label: "Vendors", href: "/dashboard/procurement/vendors" },
      { code: "procurement_tenders", icon: <SlBriefcase />, label: "Tenders", href: "/dashboard/procurement/tenders" },
      { code: "procurement_tender_applications", icon: <HiOutlineClipboardDocumentList />, label: "Tender Applications", href: "/dashboard/procurement/tenders/applications" },
      { code: "procurement_awarded_tenders", icon: <RiContractLine />, label: "Awarded Tenders", href: "/dashboard/procurement/tenders/awarded" },
      { code: "procurement_tender_payments", icon: <GrMoney />, label: "Tender Payments", href: "/dashboard/payments/tenders" },
    ],
  },
  {
    title: "Inventory",
    items: [
      { code: "inventory_store", icon: <BsBoxSeam />, label: "Store", href: "/dashboard/inventory" },
      { code: "inventory_issue_records", icon: <LuPackageCheck />, label: "Issue Records", href: "/dashboard/inventory/issue-records" },
    ],
  },
  {
    title: "Accounts",
    items: [
      { code: "accounts_chart_of_accounts", icon: <PiChartLineUp />, label: "Chart of Accounts", href: "/dashboard/accounts/chart-of-accounts" },
      { code: "accounts_account_types", icon: <FiLayers />, label: "Account Types", href: "/dashboard/accounts/account-types" },
      { code: "accounts_transactions", icon: <TbFileInvoice />, label: "Transactions", href: "/dashboard/accounts/transactions" },
      { code: "accounts_reports", icon: <IoPieChartOutline />, label: "Reports", href: "/dashboard/accounts/reports" },
    ],
  },
  {
    title: "Archived",
    items: [
      { code: "archived_accounts", icon: <IoArchiveOutline />, label: "Accounts", href: "/dashboard/accounts/archieved/accounts" },
      { code: "archived_account_types", icon: <IoArchiveOutline />, label: "Account Types", href: "/dashboard/accounts/archieved/account-types" },
    ],
  },
  {
    title: "Settings",
    items: [
      // There is a module "settings_settings" in your module list.
      // If you later create a dedicated module for roles & permissions use that code instead.
      { code: "settings_settings", icon: <IoSettingsOutline />, label: "Roles & Permissions", href: "/dashboard/permissions/roles" },
    ],
  },
];
