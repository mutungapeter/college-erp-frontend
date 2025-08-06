export interface Transaction {
	account: string;
	amount: string;
	type: string;
}

export interface Journal {
	journal_id: number;
	date: string;
	description: string;
	reference: string;
	transactions: Transaction[];
}

export interface Total {
	inflows: string;
	outflows: string;
	net_cash_flow: string;
}

export interface Operating {
	journals: Journal[];
	totals: Total;
}


export interface Investing {
	journals: Journal[];
	totals: Total;
}

export interface Financing {
	journals: Journal[];
	totals: Total;
}

export interface Summary {
	opening_balance: string;
	gross_inflows: string;
	gross_outflows: string;
	net_cash_change: string;
	ending_balance: string;
}

export interface CashFlowType {
	operating: Operating;
	investing: Investing;
	financing: Financing;
	summary: Summary;
}



export interface Income {
	name: string;
	amount: number;
}

export interface Expense {
	name: string;
	amount: number;
}

export interface Total {
	total_income: number;
	total_expenses: number;
	net_profit: number;
	profit_margin: number;
}

export interface IncomeStatementType {
	income: Income[];
	expenses: Expense[];
	totals: Total;
	net_profit: number;
}


// Balance Sheet
export interface BalanceSheetItem {
  name: string;
  balance: number;
}

export interface BalanceSheetTotals {
  Assets: number;
  "Liabilities + Equity": number;
  Balanced: boolean;
}

export interface BalanceSheetType {
  Assets: BalanceSheetItem[];
  Liabilities: BalanceSheetItem[];
  Equity: BalanceSheetItem[];
  Totals: BalanceSheetTotals;
}



// Trial Balance
export interface TrialBalanceAccount {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
  debit: number;
  credit: number;
  balance: number;
}

export interface TrialBalanceType {
  accounts: TrialBalanceAccount[];
  totals: {
	total_debit: number;
	total_credit: number;
	balanced: boolean;
  };
}