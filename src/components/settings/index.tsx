'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiBriefcase,
  FiLayers,
  FiShield,
  FiUsers
} from 'react-icons/fi';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { IoBriefcaseOutline } from 'react-icons/io5';
import { MdOutlineFormatListNumbered } from 'react-icons/md';
import Roles from '../accounts/permissions/roles';
import RoleWithPermissionsDetails from '../accounts/permissions/RolesDetails';
import AcademicYears from '../curriculum/acadmicyYears';
import Departments from '../curriculum/departments';
import Semesters from '../curriculum/semesters';
import StudyYears from '../curriculum/studyYears';
import InvoiceTypes from '../finance/invoices/invoiceTypes';
import Positions from '../staff/positions';
import SettingsLayout from './SettingsLayout';

interface Tab {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('role');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('roles');

  useEffect(() => {
    if (id) {
      setActiveTab('roles');
    }
  }, [id]);

  const tabs: Tab[] = [
    {
      id: 'roles',
      label: 'Roles & Permissions',
      description:
        'Manage roles, permissions and access control across the app.',
      icon: <FiShield className="w-5 h-5" />,
      content: id ? <RoleWithPermissionsDetails role_id={id} /> : <Roles />,
    },
    {
      id: 'libary',
      label: 'Library',
      description: 'Configure library settings.',
      icon: <MdOutlineFormatListNumbered className="w-5 h-5" />,
      content: <div>Library Info</div>,
    },
    {
      id: 'academic_years',
      label: 'Academic Years',
      description: 'Configure Academic Years',
      icon: <IoBriefcaseOutline className="w-5 h-5" />,
      content: <AcademicYears />,
    },
    {
      id: 'study_years',
      label: 'Study Years',
      description: 'Create and manage study years',
      icon: <HiOutlineClipboardDocumentList className="w-5 h-5" />,
      content: <StudyYears />,
    },
    {
      id: 'semesters',
      label: 'Semesters',
      description: 'Create and manage semesters',
      icon: <HiOutlineClipboardDocumentList className="w-5 h-5" />,
      content: <Semesters />,
    },
    {
      id: 'departments',
      label: 'Departments',
      description:
        'Manage departments, department heads and reporting structure.',
      icon: <FiLayers className="w-5 h-5" />,
      content: <Departments />,
    },
    {
      id: 'positions',
      label: 'Positions',
      description: 'Define positions, levels and position-specific details.',
      icon: <FiBriefcase className="w-5 h-5" />,
      content: <Positions />,
    },
    {
      id: 'invoice_types',
      label: 'Invoice Types',
      description: 'Define invoice types specific details.',
      icon: <FiBriefcase className="w-5 h-5" />,
      content: <InvoiceTypes />,
    },
    {
      id: 'leave',
      label: 'Leave Policies',
      description: 'Configure leave types, accrual rules and approval flows.',
      icon: <FiUsers className="w-5 h-5" />,
      content: (
        <div className="font-roboto">
          Leave Policies settings content goes here
        </div>
      ),
    },
  ];

  const activeTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];

  //   const handleTabChange = (tabId: string) => {
  //     setActiveTab(tabId);
  //     if (tabId !== "roles" && id) {
  //       router.push("/dashboard/settings");
  //     }
  //   };
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'roles') {
      router.push('/dashboard/settings'); // remove ?role= param
    } else {
      router.push(`/dashboard/settings?tab=${tabId}`); // if you want to store tab in URL
    }
  };

  return (
    <SettingsLayout>
      <div className="flex gap-4 w-full">
        {/* Sidebar */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 w-1/4 min-h-screen">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Settings
            </h2>
          </div>
          <div className="flex flex-col space-y-5 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors font-inter
                ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 w-3/4 font-roboto">
          {!id ? (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 font-montserrat">
                {activeTabObj.icon}
                {activeTabObj.label}
              </h2>
              <p className="text-gray-600 font-poppins">
                {activeTabObj.description}
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 font-montserrat">
                {activeTabObj.icon}
                Edit Role Permissions
              </h2>
              <p className="text-gray-600 font-poppins">
                Configure specific permissions for this role
              </p>
            </div>
          )}

          {activeTabObj.content}
        </div>
      </div>
    </SettingsLayout>
  );
}
