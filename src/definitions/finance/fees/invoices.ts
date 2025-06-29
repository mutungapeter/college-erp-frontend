import { SemesterType } from "@/definitions/curiculum";

export interface InvoiceType {
	id: number;
	amount: string;
	amount_paid: string;
	description: string;
	reference: string;
	semester: SemesterType;
	student_name: string;
	student_reg_no: string;
	student_id: number;
	created_on: string;
	updated_on: string;
	status: string;
	bal_due:number;
}


export const paymentMethodOptions = [
  { value: "Cash", label: "Cash" },
  { value: "Mpesa", label: "Mpesa" },
  { value: "Bank Transfer", label: "Bank Transfer" },
];


