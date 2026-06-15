import type { Role } from "./auth";

export interface Branch {
  id: number;
  name: string;
  address?: string;
}

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: Role;

  branch_id?: number;
  branch?: Branch;
}
