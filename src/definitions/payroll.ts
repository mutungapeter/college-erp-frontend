import { StaffType } from "./staff";

export interface PayrollType {
	id: number;
	staff: StaffType;
	basic_salary: string;
	house_allowance: string;
	transport_allowance: string;
	other_allowances: string;
	nssf_number: string;
	nhif_number: string;
	kra_pin: string;
	bank_name: string;
	bank_account_number: string;
	mpesa_number: string;
	payment_frequency: string;
	created_on: string;
	updated_on: string;
}

export interface PaySlipType {
	id: number;
	staff: StaffType;
	payroll_period_start: string;
	payroll_period_end: string;
	basic_salary: string;
	total_allowances: string;
	total_overtime: string;
	total_deductions: string;
	payment_status: string;
    nssf:string;
    nhif: string;
    paye: string;
	net_pay: string;
	generated_at: string;
}



export interface OvertimePaymentType {
	id: number;
	date: string;
	hours: string;
	rate_per_hour: string;
	approved: boolean;
	staff: StaffType;
}