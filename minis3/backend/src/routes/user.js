const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  getMe,
  getStats,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");

// profile
router.get("/me", auth, getMe);

// stats
router.get("/stats", auth, getStats);

// update profile
router.put("/me", auth, updateProfile);

// change password
router.put("/password", auth, changePassword);

// delete account
router.delete("/me", auth, deleteAccount);

module.exports = router;