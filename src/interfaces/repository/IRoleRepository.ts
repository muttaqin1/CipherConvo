import { roleInput, roleOutput } from '@models/Role';

export default interface IRoleRepository {
  createRole(data: roleInput): Promise<roleOutput>;
}
