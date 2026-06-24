const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  verificationCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  verificationExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = User;