import { MenuGroup } from "@/definitions/menu";
import {
  IoBedOutline,
  IoBriefcaseOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoHomeOutline,
  IoLibraryOutline,
  IoPeopleOutline,
  IoSchoolOutline
} from "react-icons/io5";
import { PiUserList } from "react-icons/pi";

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
    title: "Manage Academics",
    items: [
      {
        icon: <IoSchoolOutline />,
        label: "Curriculum",
        children: [
          { label: "Campuses", href: "/dashboard/curriculum/campuses" },
          { label: "Schools", href: "/dashboard/curriculum/schools" },
          { label: "Departments", href: "/dashboard/curriculum/departments" },
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
    title: "Manage Students",
    items: [
      {
        icon: <IoPeopleOutline />,
        label: "Students",
        children: [
          { label: "Students", href: "/dashboard/students" },
          { label: "Attendance", href: "/dashboard/students/attendance" },
          // { label: "Cohorts", href: "/dashboard/cohorts" },
          { label: "Gate Check-Ins", href: "/dashboard/students/gate-checkins" },
        ],
      },
    ],
  },
  {
    title: "Academics",
    items: [
      {
        icon: <IoCalendarOutline />,
        label: "Academics",
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
          { label: "College Staff", href: "/dashboard/staff" },
          { label: "Staff Attendance", href: "/dashboard/staff/attendance" },
          { label: "Leaves", href: "/dashboard/staff/leaves" },
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
          { label: "Rooms", href: "/dashboard/hostels/rooms" },
          { label: "Hostels", href: "/dashboard/hostels" },
        ],
      },
    ],
  },
  // {
  //   title: "Cafeteria",
  //   items: [
  //     {
  //       icon: <IoRestaurantOutline />,
  //       label: "Cafeteria",
  //       children: [
  //         { label: "Meals", href: "/dashboard/cafeteria/meals" },
  //         { label: "Meal Plans", href: "/dashboard/cafeteria/plans" },
  //       ],
  //     },
  //   ],
  // },
  {
    title: "Library",
    items: [
      {
        icon: <IoLibraryOutline />,
        label: "Library",
        children: [
          { label: "Books", href: "/dashboard/library/books" },
          { label: "Members", href: "/dashboard/library/members" },
          { label: "Borrowed Records", href: "#" },
          { label: "Fines", href: "#" },
        ],
      },
    ],
  },
  {
    title: "Financials",
    items: [
      {
        icon: <IoCashOutline />,
        label: "Financials",
        children: [
          { label: "Fees Structure", href: "/dashboard/finance/fee-structure" },
          { label: "Fees Statements", href: "/dashboard/finance/fee-statement" },
        ],
      },
    ],
  },

];
