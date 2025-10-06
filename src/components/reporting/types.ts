import { StudyYearType } from '@/definitions/curiculum';
import { StudentType, UserType } from '@/definitions/students';

export interface PromotionLogType {
  id: number;
  study_year: StudyYearType;
  student: StudentType;
  promoted_on: string;
  done_by: UserType;
}
