import { Role } from './role';

export interface Session {
  token: string;
  name: string;
  email: string;
  role: Role;
}
