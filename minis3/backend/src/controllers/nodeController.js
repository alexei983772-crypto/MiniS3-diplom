const Node = require("../models/Node");
const Chunk = require("../models/Chunk");
const File = require("../models/File");
const Bucket = require("../models/Bucket");
const nodeService = require("../services/nodeService");

exports.getStats = async (req, res) => {
  try {
    const stats = await nodeService.getNodeStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.getNodes = async (req, res) => {
  try {
    const userId = req.user.id;

    // Получаем бакеты пользователя
    const buckets = await Bucket.findAll({
      where: {
        userId,
      },
    });

    const bucketIds = buckets.map((b) => b.id);

    // Получаем файлы пользователя
    const files = await File.findAll({
      where: {
        bucketId: bucketIds,
      },
    });

    const fileIds = files.map((f) => f.id);

    // Все ноды
    const nodes = await Node.findAll({
      order: [["createdAt", "ASC"]],
    });

    const result = await Promise.all(
      nodes.map(async (node) => {
        const chunks = await Chunk.findAll({
          where: {
            nodeId: node.id,
            fileId: fileIds,
          },
        });

        const chunksCount = chunks.length;

        const usedBytes = chunks.reduce(
          (sum, chunk) => sum + Number(chunk.size || 0),
          0
        );

        const lastHeartbeat = node.lastHeartbeat
          ? new Date(node.lastHeartbeat)
          : null;

        const isOnline =
          lastHeartbeat &&
          Date.now() - lastHeartbeat.getTime() < 15000;

        return {
          id: node.id,
          url: node.url,
          status: isOnline ? "online" : "offline",
          lastHeartbeat,
          chunksCount,
          usedBytes,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("GET NODES ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};


exports.getDistribution = async (req, res) => {
  try {
    const { bucketId } = req.params;

    console.log("BUCKET ID:", bucketId);

    const chunks = await Chunk.findAll({
      include: [
        {
          model: File,
          where: { bucketId },
          attributes: ["id", "filename"],
        },
      ],
    });

    console.log("CHUNKS FOUND:", chunks.length);

    if (chunks.length > 0) {
      console.log(
        "FIRST CHUNK:",
        JSON.stringify(chunks[0], null, 2)
      );
    }

    const result = [];

    for (const chunk of chunks) {
      const node = await Node.findByPk(chunk.nodeId);

      result.push({
        fileId: chunk.File.id,
        filename: chunk.File.filename,

        chunkId: chunk.id,
        chunkIndex: chunk.index,

        nodeId: chunk.nodeId,
        nodeUrl: node?.url,

        chunkSize: chunk.size,
      });
    }

    console.log("RESULT:", result.length);

    res.json(result);
  } catch (err) {
    console.error("DISTRIBUTION ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};