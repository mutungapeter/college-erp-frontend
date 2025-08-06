// import { MenuGroup } from "@/definitions/menu";
// import { AiOutlineFileDone } from "react-icons/ai";
// import { BiBuildingHouse } from "react-icons/bi";
// import { GrMoney } from "react-icons/gr";
// import {
//   IoArchiveOutline,
//   IoBedOutline,
//   IoBriefcaseOutline,
//   IoCalendarOutline,
//   IoHomeOutline,
//   IoLibraryOutline,
//   IoPeopleOutline,
//   IoSchoolOutline,
//   IoSettingsOutline
// } from "react-icons/io5";
// import { LuBookOpenCheck } from "react-icons/lu";
// import { PiChartLineUpLight, PiUserList } from "react-icons/pi";
// import { RiMoneyDollarBoxLine } from "react-icons/ri";

// export const menuItems: MenuGroup[] = [
//   {
//     title: "",
//     items: [
//       {
//         icon: <IoHomeOutline />,
//         label: "Dashboard",
//         href: "/dashboard/admin",
//       },
//     ],
//   },
//   {
//     title: "Academics",
//     items: [
//       { icon: <IoSchoolOutline />, label: "Intakes", href: "/dashboard/curriculum/intakes" },
//       { icon: <IoSchoolOutline />, label: "Programmes", href: "/dashboard/curriculum/programmes" },
//       { icon: <IoSchoolOutline />, label: "Units", href: "/dashboard/curriculum/units" },
//       { icon: <IoSchoolOutline />, label: "Cohorts", href: "/dashboard/curriculum/cohorts" },
//       { icon: <IoSchoolOutline />, label: "Sessions", href: "/dashboard/curriculum/course-sessions" },
//       { icon: <IoSchoolOutline />, label: "Semesters", href: "/dashboard/curriculum/semesters" },
//       { icon: <IoSchoolOutline />, label: "Study Years", href: "/dashboard/curriculum/academic-years" },
//     ],
//   },
//   {
//     title: "Student Management",
//     items: [
//       { icon: <IoPeopleOutline />, label: "Students", href: "/dashboard/students" },
//       { icon: <LuBookOpenCheck />, label: "Marks", href: "/dashboard/academics/marks" },
//       { icon: <LuBookOpenCheck />, label: "Assessment List", href: "/dashboard/academics/marks/assessment-list" },
//       { icon: <LuBookOpenCheck />, label: "Transcripts", href: "/dashboard/academics/transcripts" },
//     ],
//   },
//   {
//     title: "Admissions",
//     items: [
//       { icon: <PiUserList />, label: "Applications", href: "/dashboard/admissions/applications" },
//     ],
//   },
//   {
//     title: "HR & Payroll",
//     items: [
//       { icon: <IoBriefcaseOutline />, label: "Staff", href: "/dashboard/staff" },
//       { icon: <IoBriefcaseOutline />, label: "Positions", href: "/dashboard/staff/positions" },
//       { icon: <IoCalendarOutline />, label: "Leave Entitlements", href: "/dashboard/staff/leaves/leave-entitlements" },
//       { icon: <IoCalendarOutline />, label: "Leave Applications", href: "/dashboard/staff/leaves/leave-applications" },
//       { icon: <IoCalendarOutline />, label: "Leaves", href: "/dashboard/staff/leaves" },
//       { icon: <IoBriefcaseOutline />, label: "Payroll", href: "/dashboard/payroll" },
//       { icon: <IoBriefcaseOutline />, label: "Payslips", href: "/dashboard/payroll/payslips" },
//       { icon: <IoBriefcaseOutline />, label: "Overtime Payments", href: "/dashboard/payroll/overtime-payments" },
//     ],
//   },
//   {
//     title: "Finance & Accounts",
//     items: [
//       { icon: <GrMoney />, label: "Invoices", href: "/dashboard/finance/fees/invoices" },
//       { icon: <GrMoney />, label: "Fee Statements", href: "/dashboard/finance/fees/fee-statement" },
//       { icon: <GrMoney />, label: "Fee Structure", href: "/dashboard/finance/fees/fee-structure" },
//       { icon: <GrMoney />, label: "Fee Payments", href: "/dashboard/finance/fees/fees-payments" },
//       { icon: <RiMoneyDollarBoxLine />, label: "Library Payments", href: "/dashboard/finance/library-payments" },
//       { icon: <PiChartLineUpLight />, label: "Chart of Accounts", href: "/dashboard/accounts/chart-of-accounts" },
//       { icon: <PiChartLineUpLight />, label: "Account Types", href: "/dashboard/accounts/account-types" },
//       { icon: <PiChartLineUpLight />, label: "Transactions", href: "/dashboard/accounts/transactions" },
//       { icon: <PiChartLineUpLight />, label: "Reports", href: "/dashboard/accounts/reports" },
//     ],
//   },
//   {
//     title: "Library",
//     items: [
//       { icon: <IoLibraryOutline />, label: "Books", href: "/dashboard/library/books" },
//       { icon: <IoLibraryOutline />, label: "Members", href: "/dashboard/library/members" },
//       { icon: <IoLibraryOutline />, label: "Borrowed Books", href: "/dashboard/library/borrowed-books" },
//       { icon: <IoLibraryOutline />, label: "Fines", href: "/dashboard/library/borrowed-books-fines" },
//     ],
//   },
//   {
//     title: "Hostels",
//     items: [
//       { icon: <IoBedOutline />, label: "Bookings", href: "/dashboard/hostels/bookings" },
//       { icon: <IoBedOutline />, label: "Rooms", href: "/dashboard/hostels" },
//     ],
//   },
//   {
//     title: "Archived",
//     items: [
//       { icon: <IoArchiveOutline />, label: "Accounts", href: "/dashboard/accounts/archieved/accounts" },
//       { icon: <IoArchiveOutline />, label: "Account Types", href: "/dashboard/accounts/archieved/account-types" },
//     ],
//   },
// ];

// // export const menuItems: MenuGroup[] = [
// //   {
// //     title: "",
// //     items: [
// //       {
// //         icon: <IoHomeOutline />,
// //         label: "Dashboard",
// //         href: "/dashboard/admin",
// //       },
// //     ],
// //   },
// //   {
// //     title: "Manage Units",
// //     items: [
// //       {
// //         icon: <BiBuildingHouse />,
// //         label: "School Units",
// //         children: [
// //           { label: "Campuses", href: "/dashboard/curriculum/campuses" },
// //           { label: "Schools", href: "/dashboard/curriculum/schools" },
// //           { label: "Departments", href: "/dashboard/curriculum/departments" },
// //             ],
// //       },
// //     ],
// //   },
// //   {
// //     title: "Manage Academics",
// //     items: [
// //       {
// //         icon: <IoSchoolOutline />,
// //         label: "Academics",
// //         children: [
// //           { label: "Intakes", href: "/dashboard/curriculum/intakes" },
// //           { label: "Programmes", href: "/dashboard/curriculum/programmes" },
// //           { label: "Units", href: "/dashboard/curriculum/units" },
// //           { label: "Cohorts", href: "/dashboard/curriculum/cohorts" },
// //           { label: "Sessions", href: "/dashboard/curriculum/course-sessions" },
// //           { label: "Semesters", href: "/dashboard/curriculum/semesters" },
// //           { label: "Study Years", href: "/dashboard/curriculum/academic-years" },
// //         ],
// //       },
// //     ],
// //   },
// //     {
// //     title: "Admissions",
// //     items: [
// //       {
// //         icon: <PiUserList />,
// //         label: "Admissions",
// //         href: "/dashboard/admissions/applications" 
// //       },
// //     ],
// //   },
// //     {
// //     title: "Reporting",
// //     items: [
// //       {
// //         icon: <LuBookOpenCheck />,
// //         label: "Reporting",
// //         href: "/dashboard/reporting" 
// //       },
// //     ],
// //   },
// //     {
// //     title: "Students",
// //     items: [
// //       {
// //         icon: <IoPeopleOutline />,
// //         label: "Students",
// //         href: "/dashboard/students"
// //       },
// //     ],
// //   },
// //   // {
// //   //   title: "Manage Students",
// //   //   items: [
// //   //     {
// //   //       icon: <IoPeopleOutline />,
// //   //       label: "Students",
// //   //       children: [
// //   //         { label: "Students", href: "/dashboard/students" },
// //   //         { label: "Attendance", href: "/dashboard/students/attendance" },
// //   //         // { label: "Cohorts", href: "/dashboard/cohorts" },
// //   //         { label: "Gate Check-Ins", href: "/dashboard/students/gate-checkins" },
// //   //       ],
// //   //     },
// //   //   ],
// //   // },
// //   {
// //     title: "Results ",
// //     items: [
// //       {
// //         icon: <AiOutlineFileDone />,
// //         label: "Results ",
// //         children: [
// //           { label: "Marks", href: "/dashboard/academics/marks" },
// //           { label: "Assessment List", href: "/dashboard/academics/marks/assessment-list" },
// //           { label: "Transcripts", href: "/dashboard/academics/transcripts" },
// //         ],
// //       },
// //     ],
// //   },
// //   {
// //     title: "Staff",
// //     items: [
// //       {
// //         icon: <IoBriefcaseOutline />,
// //         label: "Staff",
// //         children: [
// //           { label: "Positions", href: "/dashboard/staff/positions" },
// //           { label: "All Staff", href: "/dashboard/staff" },
// //           // { label: "Attendance", href: "/dashboard/staff/attendance" },
// //         ],
// //       },
// //     ],
// //   },
// //   {
// //     title: "Leaves",
// //     items: [
// //       {
// //         icon: <IoCalendarOutline />,
// //         label: "Leaves",
// //         children: [
// //           { label: "Leave Entitlements", href: "/dashboard/staff/leaves/leave-entitlements" },
// //           { label: "Leave Applications", href: "/dashboard/staff/leaves/leave-applications" },
// //           { label: "Leaves", href: "/dashboard/staff/leaves" },
// //         ],
// //       },
// //     ],
// //   },
// //   {
// //     title: "Payroll & Payslips",
// //     items: [
// //       {
// //         icon: <IoBriefcaseOutline />,
// //         label: "Payroll/Payslips",
// //         children: [
// //           { label: "Payroll", href: "/dashboard/payroll" },
// //           { label: "Payslips", href: "/dashboard/payroll/payslips" },
// //           { label: "Overtime Payments", href: "/dashboard/payroll/overtime-payments" },
// //         ],
// //       },
// //     ],
// //   },
// //   {
// //     title: "Hostel",
// //     items: [
// //       {
// //         icon: <IoBedOutline />,
// //         label: "Hostels",
// //         children: [
// //           { label: "Bookings", href: "/dashboard/hostels/bookings" },
// //           { label: "Rooms", href: "/dashboard/hostels" },
// //         ],
// //       },
// //     ],
// //   },
// //     {
// //     title: "Fees",
// //     items: [
// //       {
// //         icon: <GrMoney />,
// //         label: "Fees",
// //         children: [
// //           { label: "Invoices", href: "/dashboard/finance/fees/invoices" },
// //           { label: "Fee Statements", href: "/dashboard/finance/fees/fee-statement" },
// //           { label: "Fee Structure", href: "/dashboard/finance/fees/fee-structure" },
// //           { label: "Fee Payments", href: "/dashboard/finance/fees/fees-payments" },
// //         ],
// //       },
// //     ],
// //   },
// //   {
// //     title: "Library",
// //     items: [
// //       {
// //         icon: <IoLibraryOutline />,
// //         label: "Library",
// //         children: [
// //           { label: "Books", href: "/dashboard/library/books" },
// //           { label: "Members", href: "/dashboard/library/members" },
// //           { label: "Borrowed Books", href: "/dashboard/library/borrowed-books" },
// //           { label: "Fines", href: "/dashboard/library/borrowed-books-fines" },
// //         ],
// //       },
// //     ],
// //   },
// //   {
// //     title: "Finance",
// //     items: [
// //       {
// //         icon: <RiMoneyDollarBoxLine />,
// //         label: "Finance",
// //         children: [
// //           // { label: "Reports", href: "/dashboard/finance/reports" },
// //           { label: "Library Payments", href: "/dashboard/finance/library-payments" },
// //           // { label: "Budget", href: "/dashboard/finance/budget" },
// //         ],
// //       },
// //     ],
// //   },
// //   {
// //     title: "Accounts",
// //     items: [
// //       {
// //         icon: <PiChartLineUpLight />,
// //         label: "Accounting",
// //         children: [
// //           // { label: "Reports", href: "/dashboard/finance/reports" },
// //           { label: "Chart of Acounts", href: "/dashboard/accounts/chart-of-accounts" },
// //           { label: "Account Types", href: "/dashboard/accounts/account-types" },
// //           // { label: "Budget", href: "/dashboard/finance/budget" },
// //           { label: "Transactions", href: "/dashboard/accounts/transactions" },
// //           { label: "Reports", href: "/dashboard/accounts/reports" },
// //         ],
// //       },
// //     ],
// //   },
// //   {
// //     title: "Archieved Folder",
// //     items: [
// //       {
// //         icon: <IoArchiveOutline />,
// //         label: "Archived",
// //         children: [
// //           // { label: "Reports", href: "/dashboard/finance/reports" },
// //           { label: "Accounts", href: "/dashboard/accounts/archieved/accounts" },
// //           { label: "Account Types", href: "/dashboard/accounts/archieved/account-types" },
// //           // { label: "Budget", href: "/dashboard/finance/budget" },
// //         ],
// //       },
// //     ],
// //   },
 
// // ];
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
  IoSchoolOutline
} from "react-icons/io5";
import { LiaClipboardListSolid } from "react-icons/lia";
import { LuCalendarCheck2, LuLayoutTemplate } from "react-icons/lu";
import { MdAccessTime, MdOutlineRequestQuote } from "react-icons/md";
import { PiChartLineUp, PiExam, PiStudentDuotone, PiUsersThree } from "react-icons/pi";
import { RiContractLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import { SlBriefcase } from "react-icons/sl";
import { TbBuildingWarehouse, TbFileInvoice, TbReportAnalytics } from "react-icons/tb";
export const menuItems: MenuGroup[] = [
  {
    title: "",
    items: [
      { icon: <AiOutlineDashboard />, label: "Dashboard", href: "/dashboard/admin" },
    ],
  },
  {
    title: "Academics",
    items: [
      { icon: <BiBuilding />, label: "Campuses", href: "/dashboard/curriculum/campuses" },
      { icon: <IoSchoolOutline />, label: "Schools", href: "/dashboard/curriculum/schools" },
      { icon: <BsClipboardData />, label: "Departments", href: "/dashboard/curriculum/departments" },
      { icon: <IoSchoolOutline />, label: "Programmes", href: "/dashboard/curriculum/programmes" },
      { icon: <BiBookBookmark />, label: "Units", href: "/dashboard/curriculum/units" },
      { icon: <BsClipboardData />, label: "Cohorts", href: "/dashboard/curriculum/cohorts" },
      { icon: <IoDocumentTextOutline />, label: "Sessions", href: "/dashboard/curriculum/course-sessions" },
      { icon: <TbFileInvoice />, label: "Semesters", href: "/dashboard/curriculum/semesters" },
      { icon: <IoCalendarClearOutline />, label: "Academic Years", href: "/dashboard/curriculum/academic-years" },
    ],
  },
  {
    title: "Students",
    items: [
      { icon: <PiStudentDuotone />, label: "Students", href: "/dashboard/students" },
      { icon: <FaRegUser />, label: "Admissions", href: "/dashboard/admissions/applications" },
      { icon: <AiOutlineFileDone />, label: "Marks", href: "/dashboard/academics/marks" },
      { icon: <TbReportAnalytics />, label: "Assessment List", href: "/dashboard/academics/marks/assessment-list" },
      { icon: <PiExam />, label: "Transcripts", href: "/dashboard/academics/transcripts" },
    ],
  },
  {
    title: "Staff & HR",
    items: [
      { icon: <IoPeopleOutline />, label: "All Staff", href: "/dashboard/staff" },
      { icon: <IoBriefcaseOutline />, label: "Positions", href: "/dashboard/staff/positions" },
      { icon: <IoCalendarOutline />, label: "Leave Entitlements", href: "/dashboard/staff/leaves/leave-entitlements" },
      { icon: <IoCalendarClearOutline />, label: "Leave Applications", href: "/dashboard/staff/leaves/leave-applications" },
      { icon: <BsCalendarCheck />, label: "Leaves", href: "/dashboard/staff/leaves" },
    ],
  },
  {
    title: "Finance",
    items: [
      { icon: <TbFileInvoice />, label: "Fee Invoices", href: "/dashboard/finance/fees/invoices" },
      { icon: <HiOutlineDocumentReport />, label: "Fee Statements", href: "/dashboard/finance/fees/fee-statement" },
      { icon: <LuLayoutTemplate />, label: "Fee Structure", href: "/dashboard/finance/fees/fee-structure" },
      { icon: <LiaClipboardListSolid />, label: "Fee Payments", href: "/dashboard/finance/fees/fees-payments" },
      { icon: <RiMoneyDollarCircleLine />, label: "Library Payments", href: "/dashboard/finance/library-payments" },
    ],
  },
  {
    title: "Payroll",
    items: [
      { icon: <MdOutlineRequestQuote />, label: "Payroll", href: "/dashboard/payroll" },
      { icon: <BiReceipt />, label: "Payslips", href: "/dashboard/payroll/payslips" },
      { icon: <MdAccessTime />, label: "Overtime Payments", href: "/dashboard/payroll/overtime-payments" },
    ],
  },
  {
    title: "Library",
    items: [
      { icon: <IoLibraryOutline />, label: "Books", href: "/dashboard/library/books" },
      { icon: <PiUsersThree />, label: "Members", href: "/dashboard/library/members" },
      { icon: <BsClipboardData />, label: "Borrowed Books", href: "/dashboard/library/borrowed-books" },
      { icon: <RiMoneyDollarCircleLine />, label: "Fines", href: "/dashboard/library/borrowed-books-fines" },
    ],
  },
  {
    title: "Hostel",
    items: [
      { icon: <LuCalendarCheck2/>, label: "Bookings", href: "/dashboard/hostels/bookings" },
      { icon: <IoBedOutline />, label: "Rooms", href: "/dashboard/hostels" },
    ],
  },
  {
    title: "Procurement",
    items: [
      { icon: <AiOutlineShoppingCart />, label: "Orders", href: "/dashboard/procurement/orders" },
      { icon: <TbBuildingWarehouse />, label: "Vendors", href: "/dashboard/procurement/vendors" },
      { icon: <SlBriefcase  />, label: "Tenders", href: "/dashboard/procurement/tenders" },
      { icon: <HiOutlineClipboardDocumentList />, label: "Tender Applications", href: "/dashboard/procurement/tenders/applications" },
      { icon: <RiContractLine  />, label: "Awarded Tenders", href: "/dashboard/procurement/tenders/awarded" },
      { icon: <GrMoney />, label: "Tender Payments", href: "/dashboard/payments/tenders" },
      
    ],
  },
  {
    title: "Inventory",
    items: [
      { icon: <BsBoxSeam />, label: "Store", href: "/dashboard/inventory" },
    ],
  },
  {
    title: "Accounts",
    items: [
      { icon: <PiChartLineUp />, label: "Chart of Accounts", href: "/dashboard/accounts/chart-of-accounts" },
      { icon: <FiLayers />, label: "Account Types", href: "/dashboard/accounts/account-types" },
      { icon: <TbFileInvoice />, label: "Transactions", href: "/dashboard/accounts/transactions" },
      { icon: <IoPieChartOutline />, label: "Reports", href: "/dashboard/accounts/reports" },
    ],
  },
  {
    title: "Archived",
    items: [
      { icon: <IoArchiveOutline />, label: "Accounts", href: "/dashboard/accounts/archieved/accounts" },
      { icon: <IoArchiveOutline />, label: "Account Types", href: "/dashboard/accounts/archieved/account-types" },
    ],
  },
];
