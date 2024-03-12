export const USERS_COUNT = 30;
import { faker } from '@faker-js/faker';
import { Password } from '@interfaces/models/IUser';
import { v4 as uuid } from 'uuid';
import { QueryInterface, DataTypes } from 'sequelize';
import { userInput } from '@models/User';
import { roleInput } from '@models/Role';
import { activityInput } from '@models/Activity';
/** @type {import('sequelize-cli').Migration} */

// Seeders for User, Role and Activity Models.

const users: Array<userInput> = [];
const roles: Array<roleInput> = [];
const activities: Array<activityInput> = [];
for (let index = 0; index < USERS_COUNT; index++) {
  const fName = faker.person.firstName();
  const lName = faker.person.lastName();
  const password: Password = `${faker.internet.password()}:${faker.internet.password()}`;
  const userId = uuid();
  const user: userInput = {
    id: userId,
    firstName: fName,
    lastName: lName,
    userName: `${fName} ${lName}`,
    email: `${fName}${lName}@gmail.com`,
    password: password,
    gender: faker.person.gender(),
    avatar: faker.image.avatar()
  };
  users.push(user);
  const role: roleInput = {
    id: uuid(),
    admin: false,
    user: true,
    userId: userId
  };
  roles.push(role);
  const activity: activityInput = {
    id: uuid(),
    userId
    // other attributes are optional so they are set to default.
  };
  activities.push(activity);
}

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface
      .bulkInsert('users', users, {})
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
    await queryInterface.bulkInsert('roles', roles, {});
    await queryInterface.bulkInsert('activities', activities, {});
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.bulkDelete('users', {});
  }
};
