export interface Account_type {
  id: number;
  name: string;
  normal_balance: string;
}

export interface AccountInterface {
  id: number;
  account_code: string;
  name: string;
  account_type: Account_type;
  is_contra: boolean;
  is_default: boolean;
  cash_flow_section: string;
}
