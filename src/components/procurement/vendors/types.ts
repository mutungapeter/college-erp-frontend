import { Role } from "@/definitions/students";
import { AwardedTenderType, TenderType } from "../tenders/types";

export interface VendorInterface {
  id: number;
  created_on: string;
  updated_on: string;
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
  vendor_no: string;
}

export interface AwardType {
  id: number;
  tender: TenderType;
  status: string;
  award_amount: string;
  created_on: string;
}

export interface VendorDetailedType {
  id: number;
  awards: AwardType[];
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

export interface Paid_by {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	role: Role;
	gender: string;
	phone_number: string;
	id_number: string;
	passport_number?: string;
	address: string;
	postal_code?: string;
	city: string;
	state?: string;
	country: string;
	date_of_birth: string;
	is_verified: boolean;
}

export interface VendorPaymentInterface {
  id: number;
  vendor: VendorInterface;
  tender_award: AwardedTenderType;
  created_on: string;
  updated_on: string;
  amount: string;
  description: string;
  reference: string;
  payment_method: string;
  paid_by: Paid_by;
}














