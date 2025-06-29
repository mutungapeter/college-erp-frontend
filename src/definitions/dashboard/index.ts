import { SemesterType } from "../curiculum";

export interface PaymentMethod {
	payment_method: string;
	total: number;
}


export interface FeesCollectedType {
	total_collected: number;
	total_invoiced: number;
	collection_rate_percentage: number;
	by_payment_method: PaymentMethod[];
	semester: SemesterType;
	payment_count: number;
}


export interface CountData {
	active_students: number;
	active_staff: number;
	total_programmes: number;
	total_departments: number;
}

export interface CountMetricsType {
	success: boolean;
	data: CountData;
	message: string;
}