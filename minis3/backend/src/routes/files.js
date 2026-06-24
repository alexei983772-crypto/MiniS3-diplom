/* Машруты работы с файлами */

const router = require("express").Router();
const multer = require("multer");
const controller = require("../controllers/fileController");
const auth = require("../middleware/authMiddleware");

const upload = multer(); // memory storage

router.post("/upload", auth, upload.single("file"), controller.upload);
router.get("/:id", auth, controller.download);
router.get("/bucket/:bucketId", auth, controller.getByBucket);
router.delete("/:id", auth, controller.remove);

module.exports = router;