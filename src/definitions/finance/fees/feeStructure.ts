import {
  ProgrammeDetailsType,
  SemesterType,
  StudyYearType,
} from '@/definitions/curiculum';

export interface Feeitem {
  id: number;
  description: string;
  amount: string;
}

export interface FeeStructure {
  id: number;
  programme: ProgrammeDetailsType;
  year_of_study: StudyYearType;
  semester: SemesterType;
  feeitems: Feeitem[];
  total: number;
}
