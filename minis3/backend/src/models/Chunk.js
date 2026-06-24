const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Chunk = sequelize.define("Chunk", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  fileId: {
    type: DataTypes.UUID,
  },

  index: {
    type: DataTypes.INTEGER,
  },

  nodeId: {
    type: DataTypes.UUID,
  },

  chunkPath: {
    type: DataTypes.STRING,
  },

  size: {
    type: DataTypes.INTEGER,
  },

  hash: {
    type: DataTypes.STRING,
  },
});

module.exports = Chunk;