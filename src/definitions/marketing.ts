import { ProgrammeType } from "./curiculum";

export interface CampaignType {
	id: number;
	name: string;
	description: string;
	start_date: string;
	end_date: string;
	status: string;
	created_on: string;
	updated_on: string;
}

export interface LeadType {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	gender: string;
	source: string;
	programme: ProgrammeType;
	city: string;
	country: string;
	status: string;
	score: number;
	assigned_to: number;
	assigned_to_name: string;
	campaign?: CampaignType;
	created_on: string;
	updated_on: string;
}