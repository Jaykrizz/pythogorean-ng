import { Role } from './role';

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
}
