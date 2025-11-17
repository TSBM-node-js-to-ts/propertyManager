'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Property.init({
    address: DataTypes.STRING,
    type: DataTypes.STRING,
    builtYear: DataTypes.INTEGER,
    ownerPhone: DataTypes.STRING,
    roomNumber: DataTypes.STRING,
    areaGeneral: DataTypes.FLOAT,
    areaPrivate: DataTypes.FLOAT,
    rooms: DataTypes.INTEGER,
    priceSale: DataTypes.INTEGER,
    pricePremium: DataTypes.INTEGER,
    priceDeposit: DataTypes.INTEGER,
    priceMonth: DataTypes.INTEGER,
    tenantName: DataTypes.STRING,
    tenantPhone: DataTypes.STRING,
    options: DataTypes.TEXT,
    history: DataTypes.TEXT,
    mapUrl: DataTypes.STRING,
    photoLink: DataTypes.STRING,
    contractLink: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Property',
  });
  return Property;
};