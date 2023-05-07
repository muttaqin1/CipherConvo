import IRoleRepository from '@interfaces/repository/IRoleRepository';
import TYPES from '@ioc/TYPES';
import Role, { roleInput, roleOutput } from '@models/Role';
import { inject, injectable } from 'inversify';

@injectable()
export default class RoleRepository implements IRoleRepository {
  constructor(
    @inject(TYPES.RoleModel) private readonly roleModel: typeof Role
  ) {}

  public async createRole(data: roleInput): Promise<roleOutput> {
    return this.roleModel.create(data);
  }

  public async findRoleById(id: string): Promise<roleOutput | null> {
    return this.roleModel.findByPk(id);
  }

  public async findRoleByUserId(userId: string): Promise<roleOutput | null> {
    return this.roleModel.findOne({ where: { userId } });
  }

  public async deleteRoleById(id: string): Promise<number> {
    return this.roleModel.destroy({ where: { id } });
  }
}
