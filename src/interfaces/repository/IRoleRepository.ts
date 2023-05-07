import { roleInput, roleOutput } from '@models/Role';

export default interface IRoleRepository {
  createRole(data: roleInput): Promise<roleOutput>;
  findRoleById(id: string): Promise<roleOutput | null>;
  findRoleByUserId(userId: string): Promise<roleOutput | null>;
  deleteRoleById(id: string): Promise<number>;
}
