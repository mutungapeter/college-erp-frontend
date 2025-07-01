import { MenuGroup } from "@/definitions/menu";
import { AiOutlineFileDone } from "react-icons/ai";
import { BiBuildingHouse } from "react-icons/bi";
import { GrMoney } from "react-icons/gr";
import {
  IoBedOutline,
  IoBriefcaseOutline,
  IoCalendarOutline,
  IoHomeOutline,
  IoLibraryOutline,
  IoPeopleOutline,
  IoSchoolOutline
} from "react-icons/io5";
import { LuBookOpenCheck } from "react-icons/lu";
import { PiUserList } from "react-icons/pi";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
export const menuItems: MenuGroup[] = [
  {
    title: "Dashboard",
    items: [
      {
        icon: <IoHomeOutline />,
        label: "Dashboard",
        href: "/dashboard/admin",
      },
    ],
  },
  {
    title: "Manage Units",
    items: [
      {
        icon: <BiBuildingHouse />,
        label: "School Units",
        children: [
          { label: "Campuses", href: "/dashboard/curriculum/campuses" },
          { label: "Schools", href: "/dashboard/curriculum/schools" },
          { label: "Departments", href: "/dashboard/curriculum/departments" },
            ],
      },
    ],
  },
  {
    title: "Manage Academics",
    items: [
      {
        icon: <IoSchoolOutline />,
        label: "Academics",
        children: [
          { label: "Intakes", href: "/dashboard/curriculum/intakes" },
          { label: "Programmes", href: "/dashboard/curriculum/programmes" },
          { label: "Units", href: "/dashboard/curriculum/units" },
          { label: "Cohorts", href: "/dashboard/curriculum/cohorts" },
          { label: "Sessions", href: "/dashboard/curriculum/course-sessions" },
          { label: "Semesters", href: "/dashboard/curriculum/semesters" },
          { label: "Study Years", href: "/dashboard/curriculum/academic-years" },
        ],
      },
    ],
  },
    {
    title: "Admissions",
    items: [
      {
        icon: <PiUserList />,
        label: "Admissions",
        href: "/dashboard/admissions/applications" 
      },
    ],
  },
    {
    title: "Reporting",
    items: [
      {
        icon: <LuBookOpenCheck />,
        label: "Reporting",
        href: "/dashboard/reporting" 
      },
    ],
  },
    {
    title: "Students",
    items: [
      {
        icon: <IoPeopleOutline />,
        label: "Students",
        href: "/dashboard/students"
      },
    ],
  },
  // {
  //   title: "Manage Students",
  //   items: [
  //     {
  //       icon: <IoPeopleOutline />,
  //       label: "Students",
  //       children: [
  //         { label: "Students", href: "/dashboard/students" },
  //         { label: "Attendance", href: "/dashboard/students/attendance" },
  //         // { label: "Cohorts", href: "/dashboard/cohorts" },
  //         { label: "Gate Check-Ins", href: "/dashboard/students/gate-checkins" },
  //       ],
  //     },
  //   ],
  // },
  {
    title: "Results ",
    items: [
      {
        icon: <AiOutlineFileDone />,
        label: "Results ",
        children: [
          { label: "Marks", href: "/dashboard/academics/marks" },
          { label: "Assessment List", href: "/dashboard/academics/marks/assessment-list" },
          { label: "Transcripts", href: "/dashboard/academics/transcripts" },
        ],
      },
    ],
  },
  {
    title: "Staff",
    items: [
      {
        icon: <IoBriefcaseOutline />,
        label: "Staff",
        children: [
          { label: "Positions", href: "/dashboard/staff/positions" },
          { label: "All Staff", href: "/dashboard/staff" },
          // { label: "Attendance", href: "/dashboard/staff/attendance" },
        ],
      },
    ],
  },
  {
    title: "Leaves",
    items: [
      {
        icon: <IoCalendarOutline />,
        label: "Leaves",
        children: [
          { label: "Leave Entitlements", href: "/dashboard/staff/leaves/leave-entitlements" },
          { label: "Leave Applications", href: "/dashboard/staff/leaves/leave-applications" },
          { label: "Leaves", href: "/dashboard/staff/leaves" },
        ],
      },
    ],
  },
  {
    title: "Payroll & Payslips",
    items: [
      {
        icon: <IoBriefcaseOutline />,
        label: "Payroll/Payslips",
        children: [
          { label: "Payroll", href: "/dashboard/payroll" },
          { label: "Payslips", href: "/dashboard/payroll/payslips" },
          { label: "Overtime Payments", href: "/dashboard/payroll/overtime-payments" },
        ],
      },
    ],
  },
  {
    title: "Hostel",
    items: [
      {
        icon: <IoBedOutline />,
        label: "Hostels",
        children: [
          { label: "Bookings", href: "/dashboard/hostels/bookings" },
          { label: "Rooms", href: "/dashboard/hostels" },
        ],
      },
    ],
  },
    {
    title: "Fees",
    items: [
      {
        icon: <GrMoney />,
        label: "Fees",
        children: [
          { label: "Invoices", href: "/dashboard/finance/fees/invoices" },
          { label: "Fee Statements", href: "/dashboard/finance/fees/fee-statement" },
          { label: "Fee Structure", href: "/dashboard/finance/fees/fee-structure" },
          { label: "Fee Payments", href: "/dashboard/finance/fees/fees-payments" },
        ],
      },
    ],
  },
  {
    title: "Library",
    items: [
      {
        icon: <IoLibraryOutline />,
        label: "Library",
        children: [
          { label: "Books", href: "/dashboard/library/books" },
          { label: "Members", href: "/dashboard/library/members" },
          { label: "Borrowed Books", href: "/dashboard/library/borrowed-books" },
          { label: "Fines", href: "/dashboard/library/borrowed-books-fines" },
        ],
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        icon: <RiMoneyDollarBoxLine />,
        label: "Finance",
        children: [
          // { label: "Reports", href: "/dashboard/finance/reports" },
          { label: "Library Payments", href: "/dashboard/finance/library-payments" },
          // { label: "Budget", href: "/dashboard/finance/budget" },
        ],
      },
    ],
  },

];
