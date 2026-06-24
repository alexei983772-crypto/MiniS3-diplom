const { splitBuffer } = require("../utils/chunk");
const nodeService = require("./nodeService");
const Chunk = require("../models/Chunk");
const File = require("../models/File");
const Node = require("../models/Node");
const Bucket = require("../models/Bucket")
const crypto = require("crypto");
const axios = require("axios");

const DEFAULT_QUOTA = 1024 * 1024 * 1024; // 1GB
// ---------------- UPLOAD ----------------
async function uploadFile({ file, bucketId, userId }) {
  if (!file) {
    throw new Error("No file");
  }

  const bucket = await Bucket.findByPk(bucketId);

  if (!bucket) {
    throw new Error("Bucket not found");
  }

  // считаем текущее использование bucket
  const files = await File.findAll({
    where: { bucketId }
  });

  const usedStorage = files.reduce(
    (sum, f) => sum + Number(f.size || 0),
    0
  );

  const quota = Number(bucket.quota || DEFAULT_QUOTA);

  // проверяем квоту ДО загрузки чанков
  if (usedStorage + file.size > quota) {
    const available = quota - usedStorage;

    throw new Error(
      `Bucket quota exceeded. Available: ${available} bytes`
    );
  }

  const chunks = splitBuffer(file.buffer);

  const nodes = await nodeService.getOnlineNodes(10);

  if (nodes.length === 0) {
    throw new Error("No nodes available");
  }

  const createdFile = await File.create({
    filename: file.originalname,
    size: file.size,
    bucketId,
    ownerId: userId,
    hash: crypto
      .createHash("sha256")
      .update(file.buffer)
      .digest("hex"),
  });

  const chunkRecords = [];

  try {
    for (let i = 0; i < chunks.length; i++) {
      const node = nodes[i % nodes.length];

      const result = await nodeService.uploadToNode(
        node.url,
        chunks[i],
        `${createdFile.id}-chunk-${i}`
      );

      const chunk = await Chunk.create({
        fileId: createdFile.id,
        index: i,
        nodeId: node.id,
        chunkPath: result.fileId,
        size: chunks[i].length,
        hash: crypto
          .createHash("md5")
          .update(chunks[i])
          .digest("hex"),
      });

      chunkRecords.push(chunk);
    }

    return {
      file: createdFile,
      chunks: chunkRecords.length,
    };

  } catch (err) {
    // откат если загрузка оборвалась посередине

    await Chunk.destroy({
      where: {
        fileId: createdFile.id,
      },
    });

    await File.destroy({
      where: {
        id: createdFile.id,
      },
    });

    throw err;
  }
}

// ---------------- DOWNLOAD ----------------
async function downloadFile(fileId) {
  const file = await File.findByPk(fileId);

  if (!file) throw new Error("File not found");

  const chunks = await Chunk.findAll({
    where: { fileId },
    order: [["index", "ASC"]],
  });

  const buffers = [];

  for (const chunk of chunks) {
    const node = await Node.findByPk(chunk.nodeId);

    console.log("CHUNK:", chunk);
console.log("NODE:", node);

    const response = await axios.get(
      `${node.url}/store/${chunk.chunkPath}`,
      { responseType: "arraybuffer" }
    );

    buffers.push(Buffer.from(response.data));
  }

  return Buffer.concat(buffers);
}

async function deleteFile(fileId) {
  // 1. найти файл
  const file = await File.findByPk(fileId);
  if (!file) throw new Error("File not found");

  // 2. найти все чанки
  const chunks = await Chunk.findAll({
    where: { fileId }
  });

  // 3. удалить чанки с nodes
  for (const chunk of chunks) {
    try {
      const node = await nodeService.getNodeById(chunk.nodeId);

      if (node?.url && chunk.chunkPath) {
        await axios.delete(
          `${node.url}/store/${chunk.chunkPath}`
        );
      }
    } catch (err) {
      console.log("NODE DELETE ERROR:", err.message);
    }
  }

  // 4. удалить chunks из БД
  await Chunk.destroy({ where: { fileId } });

  // 5. удалить file
  await File.destroy({ where: { id: fileId } });

  return { success: true };
}


async function deleteBucket(bucketId) {
  // 1. найти bucket
  const bucket = await Bucket.findByPk(bucketId);
  if (!bucket) throw new Error("Bucket not found");

  // 2. все файлы
  const files = await File.findAll({
    where: { bucketId },
  });

  // 3. удалить каждый файл (chunks + node storage)
  for (const file of files) {
    const chunks = await Chunk.findAll({
      where: { fileId: file.id },
    });

    for (const chunk of chunks) {
      try {
        const node = await nodeService.getNodeById(chunk.nodeId);

        if (node?.url && chunk.chunkPath) {
          await axios.delete(
            `${node.url}/store/${chunk.chunkPath}`
          );
        }
      } catch (err) {
        console.log("CHUNK DELETE ERROR:", err.message);
      }
    }

    await Chunk.destroy({ where: { fileId: file.id } });
    await File.destroy({ where: { id: file.id } });
  }

  // 4. удалить bucket
  await Bucket.destroy({ where: { id: bucketId } });

  return { success: true };
}

async function getBucketStats(bucketId) {
  const bucket = await Bucket.findByPk(bucketId);

  if (!bucket) throw new Error("Bucket not found");

  const files = await File.findAll({ where: { bucketId } });

  const filesCount = files.length;

  const totalSize = files.reduce(
    (sum, f) => sum + Number(f.size || 0),
    0
  );

  const chunksCount = await Chunk.count({
    include: [{ model: File, where: { bucketId } }],
  });

  // 💥 FIX BIGINT ISSUE
  const limit = Number(bucket.quota);

  const usedPercent =
    limit > 0 ? (totalSize / limit) * 100 : 0;

  return {
    filesCount,
    chunksCount,
    totalSize,
    limit,
    usedPercent: Math.min(usedPercent, 100),
    remaining: limit - totalSize,
  };
}

async function getNodeStats() {
  const chunks = await Chunk.findAll();

  const stats = {};

  for (const chunk of chunks) {
    if (!stats[chunk.nodeId]) {
      stats[chunk.nodeId] = {
        nodeId: chunk.nodeId,
        chunks: 0,
        usedStorage: 0,
      };
    }

    stats[chunk.nodeId].chunks += 1;
    stats[chunk.nodeId].usedStorage += chunk.size;
  }

  return Object.values(stats);
}

module.exports = {
  getBucketStats,
  uploadFile,
  downloadFile, 
  deleteFile,
  deleteBucket,
  getNodeStats,
}; 