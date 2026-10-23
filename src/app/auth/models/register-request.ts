import { Role } from './role';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
  classId?: number | null;
}
