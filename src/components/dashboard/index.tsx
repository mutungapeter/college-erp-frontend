'use client';


import { RolePermission } from '@/store/definitions';
import { useAppSelector } from '@/store/hooks';
import { useGetDashboardCountsQuery } from '@/store/services/dashboard/dashboardService';
import { RootState } from '@/store/store';
import React, { useEffect, useState } from "react";
import { HiOutlineUserGroup } from 'react-icons/hi2';
import {
  LuBriefcase,
  LuGraduationCap,
  LuLayoutDashboard,
} from 'react-icons/lu';
import ContentSpinner from '../common/spinners/dataLoadingSpinner';
import MetricCard from './components/metrics/card';
import EnrollmentsBarChart from './components/metrics/EnrollmentsChart';
import FeeCollectionChart from './components/metrics/FeesCollectedChart';
const Dashboard = () => {
  const { user, loading:loadingPermissions } = useAppSelector((state: RootState) => state.auth);
  
  const permissions: RolePermission[] = React.useMemo(
    () => user?.role?.permissions ?? [],
    [user?.role?.permissions]
  );
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour12: true }) 
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dashboardPermission = permissions.find(
    (perm) => perm.module.code === "dashboard"
  );
  const { data } = useGetDashboardCountsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  console.log('data', data);
 
  const canViewAll = dashboardPermission?.can_view_all;
  const canView = dashboardPermission?.can_view;

  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  return (
    <div className="font-inter">
       {loadingPermissions ? (
        <ContentSpinner />
      ) : canViewAll ? (
      <>
      <div className="grid grid-cols-1 gap-4">
        
         <div>
            <h2 className="font-inter text-xl font-semibold text-gray-900">
              {greeting}, {user?.first_name}
            </h2>
          <p className="font-inter text-sm text-gray-700 mt-1">Welcome . See What is Happening in Your Institution</p>
            <p className="text-sm text-gray-500 mt-1">
            Current time: {currentTime}
          </p>
          </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          <MetricCard
            icon={<LuGraduationCap size={25} className="text-blue-600" />}
            title="Active Students"
            count={data?.data.active_students}
            iconBgColor="bg-blue-100"
            href="/dashboard/students"
          />
          <MetricCard
            icon={<HiOutlineUserGroup size={25} className="text-green-600" />}
            title="Active Staff"
            count={data?.data.active_staff}
            iconBgColor="bg-green-100"
            href="/dashboard/staff"
          />
          <MetricCard
            icon={<LuBriefcase size={25} className="text-purple-500" />}
            title="Programmes"
            count={data?.data.total_programmes}
            iconBgColor="bg-purple-100"
            href="/dashboard/curriculum/programmes"
          />
          <MetricCard
            icon={<LuLayoutDashboard size={25} className="text-yellow-600" />}
            title="Departments"
            count={data?.data.total_departments}
            iconBgColor="bg-yellow-100"
            href="/dashboard/curriculum/departments"
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
      </>
      ): canView ? (
        <div className="flex items-start bg-white shadow-md rounded-lg overflow-hidden p-6">
          <div className="w-2 bg-blue-600"></div>
          <div>
            <h2 className="font-inter text-xl font-semibold text-gray-900">{greeting}, {user?.first_name} </h2>
            <p className="font-inter text-sm text-gray-700 mt-1">Welcome . See What is Happening in Your Institution</p>
            <p className="text-sm text-gray-500 mt-1">
            Current time: {currentTime}
          </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-6">Nothing to show</p>
      )}
    </div>
  );
};

export default Dashboard;
