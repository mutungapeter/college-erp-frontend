import { CampusType, ProgrammeCohortType, ProgrammeType } from "./curiculum";


export interface StudentType {
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
	hostel_room_number: string;
	campus:CampusType;
}

export interface Role {
	id: number;
	name: string;
}

export interface UserType {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	role: Role;
	gender: string;
	phone_number: string;
	id_number?: string | undefined;
	passport_number?: string | null;
	address: string;
	postal_code?: string | null;
	city: string;
	state?: string | null;
	country?: string | null;
	date_of_birth: string;
	is_verified: boolean;
}


export interface HostelType {
	id: number;
	campus: CampusType;
	created_on: string;
	updated_on: string;
	name: string;
	rooms: number;
	room_cost: string;
	capacity: number;
	gender: string;
}

export interface HostelRoomType {
	id: number;
	hostel: HostelType;
	created_on: string;
	updated_on: string;
	room_number: string;
	room_capacity: number;
	students_assigned: number;
}

export interface StudentDetailsType {
	id: number;
	user: UserType;
	registration_number: string;
	guardian_name: string;
	guardian_phone_number: string;
	guardian_relationship: string;
	guardian_email: string;
	status: string;
	programme: ProgrammeType;
	hostel_room: HostelRoomType;
	campus: CampusType;
	cohort: ProgrammeCohortType;
	created_on: string;
	updated_on: string;
}

