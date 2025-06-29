import { IntakeType } from "./admissions";



export interface DepartmentType {
	id: number;
	name: string;
	school: SchoolType;
	office: string;
	department_type: string;
}

export interface ProgrammeType {
	id: number;
	name: string;
	code: string;
	school: SchoolType;
	department: DepartmentType;
	level: string;
}



export interface SchoolType {
	id: number;
	name: string;
	email: string;
	phone: string;
	location: string;
}

export interface ProgrammeCohortType {
	id: number;
	name: string;
	programme: ProgrammeType;
	current_year: string;
	current_semester: SemesterType;
	status: string;
	intake: IntakeType;
}


export interface CourseSessionType {
	id: number;
	cohort: ProgrammeCohortType;
	course: CourseType;
	start_time: string;
	period: number;
	status: string;
}

export interface CourseType {
	id: number;
	course_code: string;
	name: string;
	school: SchoolType;
	department: DepartmentType;
	programme: ProgrammeType;
}

export interface SemesterType {
	id: number;
	name: string;
	academic_year: string;
	start_date: string;
	end_date: string;
	status: string;
}

export interface CampusType {
	id: number;
	name: string;
	city: string;
	address: string;
	phone_number: string;
	email: string;
	population: number;
}

export interface StudyYearType {
	id: number;
	name: string;
	created_on: string;
}





export interface ProgrammeDetailsType {
	id: number;
	name: string;
	code: string;
	school: SchoolType;
	department: DepartmentType;
	level: string;
	units: CourseType[];
}




