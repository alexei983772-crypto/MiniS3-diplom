const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Node = sequelize.define("Node", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  url: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "offline" },
  lastHeartbeat: { type: DataTypes.DATE },
}, {
  tableName: "Nodes",   
  freezeTableName: true 
});
module.exports = Node;