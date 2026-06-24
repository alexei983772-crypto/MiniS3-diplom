const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const File = sequelize.define("File", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
  },
  hash: {
    type: DataTypes.STRING,
  },
  bucketId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  nodes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});
module.exports = File;