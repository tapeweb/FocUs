export enum ERoleModel {
  User = "user",
  Admin = "admin",
}
export interface IRolesModelBody {
  id: number;
  roleName: ERoleModel;
}

export interface IRolesModelSelectByIdBody {
  id: number;
}

export interface IRolesModelSelectByRoleNameBody {
  roleName: ERoleModel;
}
