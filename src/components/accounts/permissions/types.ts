export interface Permission {
	module_id: number;
	module_name: string;
	can_view: boolean;
	can_view_all: boolean;
	can_create: boolean;
	can_edit: boolean;
	can_delete: boolean;
	can_approve: boolean;
	can_export: boolean;
	can_print: boolean;
}


export interface RoleType {
	id: number;
	name: string;
	created_on:string;
	description?:string;
	permissions: Permission[];
}