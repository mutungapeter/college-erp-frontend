import { CourseType, ProgrammeCohortType, SemesterType } from "./curiculum";
import { StudentDetailsType } from "./students";



export interface Role {
	id: number;
	name: string;
}

export interface RecordedBy {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	role: Role;
	gender: string;
	phone_number: string;
	id_number?: string;
	passport_number?: string;
	address: string;
	postal_code?: string;
	city: string;
	state?: string;
	country: string;
	date_of_birth: string;
	is_verified: boolean;
}

export interface MarksType {
	id: number;
	student: StudentDetailsType;
	semester: SemesterType;
	cohort?: ProgrammeCohortType;
	course: CourseType;
	cat_one: string;
	cat_two: string;
	exam_marks: string;
	total_marks: string;
	recorded_by: RecordedBy;
	grade:string;
}