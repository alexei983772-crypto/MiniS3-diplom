/* Машруты работы с bucket */

const router = require("express").Router();
const controller = require("../controllers/bucketController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, controller.createBucket);
router.get("/", auth, controller.getBuckets);
// router.get("/:bucketId", auth, controller.getByBucket);
router.get("/:bucketId/fileStats", auth, controller.getBucketStats);
// router.get("/:id/fileStats", controller.getStats);
router.put("/:id", auth, controller.renameBucket);
router.delete("/:id", auth, controller.remove);

module.exports = router;