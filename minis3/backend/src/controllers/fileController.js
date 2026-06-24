const fileService = require("../services/fileService");
const File = require("../models/File");
const Chunk = require("../models/Chunk");
const Bucket = require("../models/Bucket");


// ================= UPLOAD =================
exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file" });
    }

    const bucketId = req.body.bucketId;
    const userId = req.user?.id; // 🔥 из JWT

    // ❗ проверка bucket
    const bucket = await Bucket.findByPk(bucketId);

    console.log("USER:", req.user);
console.log("BUCKET:", bucket);
console.log("BUCKET OWNER:", bucket?.userId);

    if (!bucket || bucket.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const result = await fileService.uploadFile({
      file: req.file,
      bucketId,
      userId,
    });

    res.json(result);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= DOWNLOAD =================
exports.download = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    const file = await File.findByPk(fileId);

    if (!file) {
      return res.status(404).json({
        error: "File not found",
      });
    }

    const bucket = await Bucket.findByPk(file.bucketId);

    if (!bucket || bucket.userId !== userId) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    const buffer = await fileService.downloadFile(fileId);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`
    );

    res.setHeader(
      "Content-Type",
      file.mimetype || "application/octet-stream"
    );

    res.send(buffer);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= FILES BY BUCKET =================

exports.getByBucket = async (req, res) => {
  try {
    const { bucketId } = req.params;
    const userId = req.user?.id;

    const bucket = await Bucket.findByPk(bucketId);

    if (!bucket || bucket.userId !== userId) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    const files = await File.findAll({
      where: { bucketId },

      include: [
        {
          model: Chunk,
          attributes: [
            "id",
            "index",
            "nodeId",
            "size",
            "hash",
          ],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.json(files);
  } catch (err) {
    console.error("GET FILES ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    const file = await File.findByPk(fileId);

    if (!file) {
      return res.status(404).json({
        error: "File not found",
      });
    }

    const bucket = await Bucket.findByPk(file.bucketId);

    if (!bucket || bucket.userId !== userId) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    const result = await fileService.deleteFile(fileId);

    res.json(result);
  } catch (err) {
    console.error("DELETE ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

