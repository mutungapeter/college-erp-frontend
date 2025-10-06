import { SemesterType } from "@/definitions/curiculum";
import { StudentType } from "@/definitions/students";

export interface FeeStatementType{
    id:number;
    semester:SemesterType;
    student:StudentType;
    statement_type:string;
    balance:number;
    reference:string;
    credit:number;
    debit:number;
}