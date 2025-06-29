import { ProgrammeCohortType, SemesterType } from "./curiculum";


export interface ReportingType {
	id: number;
	cohort: ProgrammeCohortType;
	student: string;
	academic_year: string;
	semester: SemesterType;
    reg_no: string;
	reported: boolean;
	created_on: string;
	updated_on: string;
}