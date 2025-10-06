import { StaffType } from './staff';

export interface LeaveApplicationType {
  id: number;
  reason_declined?: string;
  start_date: string;
  end_date: string;
  staff: StaffType;
  reason: string;
  leave_type: string;
  status: string;
  leave_days_applied_for: number;
}

export const LeaveStatusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Declined', label: 'Declined' },
];

export const LeaveTypeOptions = [
  { value: 'Sick Leave', label: 'Sick Leave' },
  { value: 'Vacation Leave', label: 'Vacation Leave' },
  { value: 'Maternity Leave', label: 'Maternity Leave' },
  { value: 'Paternity Leave', label: 'Paternity Leave' },
  { value: 'Study Leave', label: 'Study Leave' },
  { value: 'Unpaid Leave', label: 'Unpaid Leave' },
  { value: 'Annual Leave', label: 'Annual Leave' },
  { value: 'Casual Leave', label: 'Casual Leave' },
  { value: 'Emergency Leave', label: 'Emergency Leave' },
  { value: 'Privilege Leave', label: 'Privilege Leave' },
  { value: 'Annual Leave', label: 'Annual Leave' },
  { value: 'Other', label: 'Other' },
];

export interface LeaveType {
  id: number;
  application: LeaveApplicationType;
  created_on: string;
  reason_cancelled?: string;
  status: string;
  updated_on: string;
}

export interface EntitlementType {
  id: number;
  staff: StaffType;
  year: number;
  total_days: number;
  used_days: number;
  remaining_days: number;
}
