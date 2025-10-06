export type Module = {
  id: number;
  name: string;
  code: string;
};

export type RolePermission = {
  id: number;
  module: Module;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_approve: boolean;
  can_export: boolean;
  can_print: boolean;
  can_view_all: boolean;
};

export type UserRole = {
  id: number;
  name: string;
  permissions: RolePermission[];
};

export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: UserRole | null;
};
