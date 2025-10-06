import { DepartmentType } from './curiculum';
import { UserType } from './students';

export interface Position {
  id: number;
  name: string;
  created_on: string;
  updated_on: string;
}

export interface RoleType {
  id: number;
  name: string;
  created_on: string;
  updated_on: string;
}

export interface StaffType {
  id: number;
  user: UserType;
  staff_number: string;
  department: DepartmentType;
  position: Position;
  status: string;
  onboarding_status: string;
  onboarding_progress: OnboardingProgressType;
}

export interface OnboardingProgressType {
  id: number;
  user_created: boolean;
  staff_details_completed: boolean;
  documents_uploaded: boolean;
  payroll_setup_completed: boolean;
  onboarding_completed: boolean;
  created_on: string;
  updated_on: string;
}
