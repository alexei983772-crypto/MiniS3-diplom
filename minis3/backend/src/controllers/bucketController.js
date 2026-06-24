const File = require("../models/File");
const Bucket = require("../models/Bucket");
const Chunk = require("../models/Chunk");
const fileService = require("../services/fileService");

exports.createBucket = async (req, res) => {
  try {
    const { name } = req.body;

    const bucket = await Bucket.create({
      name,
      userId: req.user.id,
    });

    res.json(bucket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getBuckets = async (req, res) => {
  try {
    const buckets = await Bucket.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(buckets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const bucket = await Bucket.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!bucket) {
      return res.status(404).json({
        error: "Bucket not found",
      });
    }

    const result = await fileService.deleteBucket(bucket.id);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBucketStats = async (req, res) => {
  try {
    const { bucketId } = req.params;

    const bucket = await Bucket.findOne({
      where: {
        id: bucketId,
        userId: req.user.id,
      },
    });

    if (!bucket) {
      return res.status(404).json({
        error: "Bucket not found",
      });
    }

    const files = await File.findAll({
      where: {
        bucketId: bucket.id,
      },
    });

    const fileIds = files.map((f) => f.id);

    const chunks = await Chunk.findAll({
      where: {
        fileId: fileIds,
      },
    });

    const totalSize = files.reduce(
      (sum, file) => sum + Number(file.size || 0),
      0
    );

    const limit = Number(bucket.quota);

    const usedPercent =
      limit > 0 ? (totalSize / limit) * 100 : 0;

    res.json({
      filesCount: files.length,
      chunksCount: chunks.length,
      totalSize,
      limit,
      usedPercent: Math.min(usedPercent, 100),
      remaining: limit - totalSize,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.renameBucket = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        error: "Name is required",
      });
    }

    const bucket = await Bucket.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!bucket) {
      return res.status(404).json({
        error: "Bucket not found",
      });
    }

    bucket.name = name.trim();

    await bucket.save();

    res.json(bucket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const bucket = await Bucket.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!bucket) {
      return res.status(404).json({
        error: "Bucket not found",
      });
    }

    const stats = await fileService.getBucketStats(bucket.id);

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};