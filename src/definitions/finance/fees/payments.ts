import { SemesterType } from '@/definitions/curiculum';
import { StudentDetailsType } from '@/definitions/students';

export interface PaymentType {
  id: number;
  amount: string;
  payment_date: string;
  payment_method: string;
  created_on: string;
  updated_on: string;
  student_name: string;
  student_reg_no: string;
}

export interface FeeStatementDetailsType {
  id: number;
  balance: string;
  credit: string;
  debit: string;
  semester: SemesterType;
  statement_type: string;
  student: StudentDetailsType;
}
