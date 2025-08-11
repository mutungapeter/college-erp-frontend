export interface Module {
	id: number;
	name: string;
	code: string;
}

export interface Permission {
	id: number;
	module: Module;
	can_view: boolean;
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
	permissions: Permission[];
}