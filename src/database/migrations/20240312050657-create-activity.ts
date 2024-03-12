import { QueryInterface, DataTypes } from 'sequelize';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('Activities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      failedLoginAttempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sendedTwoFactorAuthCodeCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      permanentAccessRestricted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      passwordChangedLast: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DATE
      },
      accessRestricted: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable('Activities');
  }
};
