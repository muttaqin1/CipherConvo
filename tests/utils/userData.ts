import IUser from '../../src/interfaces/models/IUser';

export default {
  id: '111',
  userName: 'muttaqin1',
  firstName: 'muttaqin',
  lastName: 'muhammad',
  email: 'email@gmail.com',
  password: 'muttaqin:muttaqin',
  gender: 'male',
  avatar: 'avatar',
  createdAt: new Date(),
  updatedAt: new Date()
} as Required<IUser>;
