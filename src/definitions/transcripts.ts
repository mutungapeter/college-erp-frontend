import { StudentDetailsType, UserType } from "./students";


export interface Student {
	id: number;
	user: UserType;
	registration_number: string;
	guardian_name: string;
	guardian_phone_number: string;
	guardian_relationship: string;
	guardian_email: string;
	status: string;
	programme_name: string;
	cohort_name: string;
}

export interface Semester {
	id: number;
	name: string;
	academic_year: string;
	status: string;
}

export interface Course {
	id: number;
	name: string;
	course_code: string;
}

export interface Mark {
	id: number;
	course: Course;
	cat_one: string;
	cat_two: string;
	exam_marks: string;
	total_marks: string;
	grade: string;
}

export interface TranscriptType {
	student: StudentDetailsType;
	semester: Semester;
	marks: Mark[];
}