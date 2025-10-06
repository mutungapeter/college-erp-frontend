import { ProgramOption } from '@/components/curriculum/cohorts';

export const PAGE_SIZE = 10;

export const CohortStatusOptions: ProgramOption[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Graduated', label: 'Graduated' },
];
export const BookingStatusOptions: ProgramOption[] = [
  { value: 'Checked In', label: 'Checked In' },
  { value: 'Checked Out', label: 'Checked Out' },
];

export const YearsOptions: ProgramOption[] = [
  { value: 'First Year', label: 'First Year' },
  { value: 'Second Year', label: 'Second Year' },
  { value: 'Third Year', label: 'Third Year' },
  { value: 'Fourth Year', label: 'Fourth Year' },
  { value: 'Fifth Year', label: 'Fifth Year' },
  { value: 'Sixth Year', label: 'Sixth Year' },
  { value: 'Seventh Year', label: 'Seventh Year' },
];

export const SemesterStatusOptions: ProgramOption[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Closed', label: 'Closed' },
];
export const DepartmentTypeOptions = [
  { value: 'Academic', label: 'Academic' },
  { value: 'Not Academic', label: 'Not Academic' },
];

export const SemesterNameOptions: ProgramOption[] = [
  { value: 'Semester One', label: 'Semester One' },
  { value: 'Semester Two', label: 'Semester Two' },
  { value: 'Semester Three', label: 'Semester Three' },
];

export const ProgrammeLevelOptions: ProgramOption[] = [
  { value: 'Artisan', label: 'Artisan' },
  { value: 'Certificate', label: 'Certificate' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'Bachelor', label: 'Bachelor' },
  { value: 'Masters', label: 'Masters' },
  { value: 'PhD', label: 'PhD' },
];

export const SessionStatusOptions = [
  { value: 'Future', label: 'Future' },
  { value: 'Active', label: 'Active' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Rescheduled', label: 'Rescheduled' },
];

export const GenderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];
export const HostelGenderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Mixed', label: 'Mixed' },
];
export const BookCategoryOptions = [
  { value: 'Book', label: 'Book' },
  { value: 'Journal', label: 'Journal' },
  { value: 'Digital', label: 'Digital' },
];

export const BorrowedBookStatusOptions = [
  { value: 'Returned', label: 'Returned' },
  { value: 'Pending Return', label: 'Pending Return' },
  { value: 'Lost', label: 'Lost' },
];
export const EducationHistoryOptions = [
  { value: 'Primary School', label: 'Primary School' },
  { value: 'Secondary School', label: 'Secondary School' },
  { value: 'Undergraduate', label: 'Undergraduate' },
  { value: 'Graduate', label: 'Graduate' },
];

export const ApplicationStatusOptions = [
  { value: 'Under Review', label: 'Under Review' },
  { value: 'Accepted', label: 'Accepted' },
  { value: 'Declined', label: 'Declined' },
  { value: 'Enrolled', label: 'Enrolled' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Incomplete', label: 'Incomplete' },
  { value: 'Withdrwan', label: 'Withdrwan' },
  ,
];

export const ApplicationDocumentOptions = [
  { value: 'Certificate', label: 'Certificate' },
  { value: 'Transcript', label: 'Transcript' },
  { value: 'Identification', label: 'Identification' },
];
