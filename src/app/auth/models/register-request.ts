import { Role } from './role';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  branchId: number;
  role: Role;
}
