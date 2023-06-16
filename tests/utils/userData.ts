import IUser from '../../src/interfaces/models/IUser';

const userData = {
  id: '111',
  userName: 'muttaqin1',
  firstName: 'muttaqin',
  lastName: 'muhammad',
  email: 'email@gmail.com',
  password: 'muttaqin:muttaqin',
  gender: 'male',
  avatar: 'avatar',
  createdAt: '2021-01-01T00:00:00.000Z',
  updatedAt: '2021-01-01T00:00:00.000Z'
} as unknown as Required<IUser>;

export default {
  ...userData,
  toJSON: () => userData
};
