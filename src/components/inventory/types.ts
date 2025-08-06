export interface CategoryType {
  id: number;
  name: string;
  description: string;
  created_on: string;
  updated_on: string;
  category_type:string;
  category_type_label:string;
}




export interface InventoryUnitType {
	id: number;
	created_on: string;
	updated_on: string;
	name: string;
}

export interface InventoryItem {
	id: number;
	category: CategoryType;
	unit: InventoryUnitType;
	created_on: string;
	updated_on: string;
	name: string;
	description: string;
  total_valuation?:string;
  unit_valuation?:string;
	quantity_in_stock: number;
}


export const CategoryTypeOptions: { value: string; label: string }[] = [
  { value: "fixed_asset", label: "Fixed Asset" },
  { value: "consumable", label: "Consumable" },
  { value: "service", label: "Service" },
  // { value: "furniture", label: "Furniture" },
  { value: "inventory", label: "Inventory" },
  { value: "other", label: "Other" },
];
