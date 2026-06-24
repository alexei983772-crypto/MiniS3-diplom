const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Bucket = sequelize.define("Bucket", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  quota: {
  type: DataTypes.BIGINT,
  defaultValue: 1024 * 1024 * 1024, // 1GB
}
});

User.hasMany(Bucket, { foreignKey: "userId" });
Bucket.belongsTo(User, { foreignKey: "userId" });

module.exports = Bucket;