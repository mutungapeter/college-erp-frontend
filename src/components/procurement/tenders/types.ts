import { UserType } from "@/definitions/students";





export interface Vendor {
	id: number;
	created_on: string;
	updated_on: string;
	vendor_no: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	contact_person: string;
	contact_person_phone: string;
	contact_person_email: string;
	company_registration_number: string;
	tax_pin: string;
	business_type: string;
	status: string;
}

export interface Award {
	id: number;
	status: string;
	award_amount: string;
	vendor: Vendor;
	created_on: string;
	updated_on: string;
}

export interface TenderType {
	id: number;
	title: string;
	description: string;
	deadline: string;
	status: string;
	projected_amount: string;
	actual_amount: string;
	tender_document: string;
	start_date: string;
	end_date: string;
	created_on: string;
	updated_on: string;
	award: Award;
}


export interface TenderApplicationType {
	id: number;
	tender: TenderType;
	created_on: string;
	updated_on: string;
	vendor_no?: string;
	company_name: string;
	email: string;
	phone: string;
	address: string;
	contact_person: string;
	contact_person_phone: string;
	contact_person_email: string;
	business_type: string;
	company_registration_number: string;
	tax_pin: string;
	status: string;
	reviewed_on?: string;
	reviewed_by?: string;
}




export interface TenderDocumentType {
	id: number;
	created_on: string;
	updated_on: string;
	document_name: string;
	document_type: string;
	file: string;
	description: string;
	application: number;
}
export interface ApplicationDetailsType {
	id: number;
	tender: TenderType;
	status: string;
	created_on: string;
	updated_on: string;
	reviewed_on: string;
	reviewed_by: UserType;
	phone: string;
	email: string;
	tax_pin: string;
	company_registration_number: string;
	business_type: string;
	company_name: string;
	contact_person: string;
	contact_person_phone: string;
	contact_person_email: string;
	address: string;
	documents: TenderDocumentType[];
}






export const TenderApplicationDocumentOptions = [
	{ value: "certificate_of_incorporation", label: "Certificate of Incorporation"},
	{ value: "proposal_document", label: "Proposal Document"},
	{ value: "financial_proposal", label: "Financial Proposal"},
	{ value: "insurance_certificate", label: "Insurance Certificate"},
	{ value: "technical_proposal", label: "Technical Proposal"},
	{ value: "audited_financials", label: "Audited Financials"},
	{ value: "other", label: "Other"},
	
];





export interface AwardedTenderType{
	id: number;
	status: string;
	award_amount: string;
	vendor: Vendor;
	created_on: string;
	updated_on: string;
	tender: TenderType;
	amount_paid: string;
	balance_due: number;
	payment_status: string;
}