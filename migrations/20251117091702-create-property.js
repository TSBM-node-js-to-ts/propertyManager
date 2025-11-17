'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Properties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      builtYear: {
        type: Sequelize.INTEGER
      },
      ownerPhone: {
        type: Sequelize.STRING
      },
      roomNumber: {
        type: Sequelize.STRING
      },
      areaGeneral: {
        type: Sequelize.FLOAT
      },
      areaPrivate: {
        type: Sequelize.FLOAT
      },
      rooms: {
        type: Sequelize.INTEGER
      },
      priceSale: {
        type: Sequelize.INTEGER
      },
      pricePremium: {
        type: Sequelize.INTEGER
      },
      priceDeposit: {
        type: Sequelize.INTEGER
      },
      priceMonth: {
        type: Sequelize.INTEGER
      },
      tenantName: {
        type: Sequelize.STRING
      },
      tenantPhone: {
        type: Sequelize.STRING
      },
      options: {
        type: Sequelize.TEXT
      },
      history: {
        type: Sequelize.TEXT
      },
      mapUrl: {
        type: Sequelize.STRING
      },
      photoLink: {
        type: Sequelize.STRING
      },
      contractLink: {
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Properties');
  }
};