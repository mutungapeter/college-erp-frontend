import { SemesterType } from './curiculum';
import { StudentType, UserType } from './students';

export interface ReportingType {
  id: number;
  student: StudentType;
  academic_year: string;
  semester: SemesterType;
  registration_number: string;
  reported: boolean;
  created_on: string;
  done_by: UserType;
  updated_on: string;
}
