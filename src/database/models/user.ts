import { userInput, userOutput } from '@models/User';
// const { Model } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
// class User extends Model {
//   /**
//    * Helper method for defining associations.
//    * This method is not a part of Sequelize lifecycle.
//    * The `models/index` file will call this method automatically.
//    */
//   static associate(models) {
//     // define association here
//   }
// }
// User.init({
//   firstName: DataTypes.STRING,
//   lastName: DataTypes.STRING,
//   email: DataTypes.STRING
// }, {
//   sequelize,
//   modelName: 'User',
// });
// return User;
// };

// ----------------------------------------
import { Model, DataTypes } from 'sequelize';
import connection from '../sequelize';
import IUser, { Password } from '@interfaces/models/IUser';

export default class User
  extends Model<userOutput, userInput>
  implements IUser
{
  public id!: string;

  public userName!: string;

  public firstName!: string;

  public lastName!: string;

  public email!: string;

  public password!: Password | null;

  public gender!: string;

  public activityId!: string | null;

  public roleId!: string | null;

  public avatar!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.STRING,
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'default1.png'
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize: connection,
    timestamps: true
  }
);
