import { VendorInterface } from '../vendors/types';
import { UserType } from '@/definitions/students';

export interface Item {
  name: string;
  description: string;
  quantity: number;
  unit: number;
  unit_price: string;
  category: number;
}

export interface PurchaseOrderType {
  id: number;
  vendor: VendorInterface;
  status: string;
  created_on: string;
  created_by: UserType;
  order_no: string;
  items: Item[];
  total_amount: string;
}
