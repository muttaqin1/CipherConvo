import IRole from '../../src/interfaces/models/IRole';

export default {
  id: '222',
  userId: '111',
  admin: false,
  user: true,
  createdAt: new Date(),
  updatedAt: new Date()
} as Required<IRole>;
