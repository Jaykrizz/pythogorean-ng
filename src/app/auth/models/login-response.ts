import { Role } from './role';

export interface LoginResponse {
  token: string;
  name: string;
  email: string;
  role: Role;
}
