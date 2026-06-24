const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Bucket = require("../models/Bucket");
const File = require("../models/File");

// --------------------
// GET PROFILE
// --------------------

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "email", "createdAt"],
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: "Failed to get profile",
    });
  }
};

// --------------------
// GET USER STATS
// --------------------

exports.getStats = async (req, res) => {
  try {
    const buckets = await Bucket.findAll({
      where: {
        userId: req.user.id,
      },
    });

    const bucketIds = buckets.map((b) => b.id);

    const files = await File.findAll({
      where: {
        bucketId: bucketIds,
      },
      attributes: [
        "id",
        "size",
        "createdAt",
      ],
      order: [["createdAt", "ASC"]],
    });

    let totalSize = 0;

    files.forEach((file) => {
      totalSize += Number(file.size || 0);
    });

    const fileHistory = [];

    let totalFiles = 0;

    files.forEach((file) => {
      totalFiles++;

      fileHistory.push({
        date: file.createdAt,
        count: totalFiles,
      });
    });

    res.json({
      bucketsCount: buckets.length,
      filesCount: files.length,
      storageUsed: totalSize,
      storageLimit: 5 * 1024 * 1024 * 1024,
      fileHistory,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to get stats",
    });
  }
};

// --------------------
// UPDATE PROFILE
// --------------------

exports.updateProfile = async (req, res) => {
  try {
    const { email } = req.body;

    await User.update(
      {
        email,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    res.json({
      message: "Profile updated",
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to update profile",
    });
  }
};

// --------------------
// CHANGE PASSWORD
// --------------------

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    const ok = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!ok) {
      return res.status(401).json({
        error: "Wrong password",
      });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await User.update(
      {
        password: hash,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    res.json({
      message: "Password changed",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to change password",
    });
  }
};

// --------------------
// DELETE ACCOUNT
// --------------------

exports.deleteAccount = async (req, res) => {
  try {
    await User.destroy({
      where: {
        id: req.user.id,
      },
    });

    res.json({
      message: "Account deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete account",
    });
  }
};