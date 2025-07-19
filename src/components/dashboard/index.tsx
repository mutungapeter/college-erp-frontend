"use client";

import { LuRefreshCcw } from "react-icons/lu";

import { useGetDashboardCountsQuery } from "@/store/services/dashboard/dashboardService";
import { HiOutlineUserGroup } from "react-icons/hi2";
import {
  LuBriefcase,
  LuGraduationCap,
  LuLayoutDashboard,
} from "react-icons/lu";
import MetricCard from "./components/metrics/card";
import EnrollmentsBarChart from "./components/metrics/EnrollmentsChart";
import FeeCollectionChart from "./components/metrics/FeesCollectedChart";
const Dashboard = () => {
  const { data, refetch } = useGetDashboardCountsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  console.log("data", data);
  const handleResetFilters = () => {
    refetch();
  };

  return (
    <div className="font-nunito">
      <div className="grid grid-cols-1 gap-4">
        {/* Dashboard Title and Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Dashboard Overview
          </h2>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors mt-2 sm:mt-6"
          >
            <LuRefreshCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          <MetricCard
            icon={<LuGraduationCap size={25} className="text-white" />}
            title="Students"
            count={data?.data.active_students}
            iconBgColor="bg-blue-500"
          />
          <MetricCard
            icon={<HiOutlineUserGroup size={25} className="text-white" />}
            title="Staff"
            count={data?.data.active_staff}
            iconBgColor="bg-green-500"
          />
          <MetricCard
            icon={<LuBriefcase size={25} className="text-white" />}
            title="Programmes"
            count={data?.data.total_programmes}
            iconBgColor="bg-purple-500"
          />
          <MetricCard
            icon={<LuLayoutDashboard size={25} className="text-white" />}
            title="Departments"
            count={data?.data.total_departments}
            iconBgColor="bg-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <StatisticsChart 
           data={metricsData}
          /> */}
          <EnrollmentsBarChart />
          <FeeCollectionChart />
        </div>
        <div>
          {/* <RecentActivity 
           
          /> */}
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
