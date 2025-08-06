import { AccountInterface } from "./main";


export interface Journal_info {
	date: string;
	description: string;
	reference: string;
}

export interface TransactionType {
	id: number;
	account: AccountInterface;
	amount: string;
	is_debit: boolean;
	journal_info: Journal_info;
}