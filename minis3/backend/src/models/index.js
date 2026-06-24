const File = require("./File");
const Chunk = require("./Chunk");
const Bucket = require("./Bucket");
const Node = require("./Node");
// Bucket -> File
Bucket.hasMany(File, {
  foreignKey: "bucketId",
});
File.belongsTo(Bucket, {
  foreignKey: "bucketId",
});
// File -> Chunk
File.hasMany(Chunk, {
  foreignKey: "fileId",
});
Chunk.belongsTo(File, {
  foreignKey: "fileId",
});
module.exports = {
  File,
  Chunk,
  Bucket,
  Node,
};