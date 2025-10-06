import { AcademicYearType } from '@/components/curriculum/acadmicyYears/types';
import { CampusType, DepartmentType, SchoolType } from './curiculum';
import { LeadType } from './marketing';

export interface IntakeType {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  closed: boolean;
  academic_year: AcademicYearType;
}

export interface Choice_programme {
  id: number;
  name: string;
  code: string;
  school: SchoolType;
  department: DepartmentType;
  level: string;
}

export interface ApplicationType {
  id: number;
  application_number: string;
  lead?: LeadType;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  id_number: string;
  passport_number?: string;
  date_of_birth?: string;
  gender: string;
  first_choice_programme: Choice_programme;
  second_choice_programme?: Choice_programme;
  guardian_name?: string;
  guardian_email?: string;
  guardian_relationship?: string;
  guardian_phone_number?: string;
  address?: string;
  postal_code?: string;
  city: string;
  country: string;
  passport_photo?: string;
  intake?: IntakeType;
  status: string;
  slug: string;
  campus?: CampusType;
  application_education_history: Application_education_history[];
  application_document: Application_document[];
  created_on: string;
  updated_on: string;
}

export interface Application_education_history {
  id: number;
  created_on: string;
  updated_on: string;
  institution: string;
  level: string;
  grade_or_gpa: string;
  year: string;
  major: string;
  graduated: boolean;
  student_application: number;
}

export interface Application_document {
  id: number;
  created_on: string;
  updated_on: string;
  document_name: string;
  document_type: string;
  document_file: string;
  verified: boolean;
  student_application: number;
}
