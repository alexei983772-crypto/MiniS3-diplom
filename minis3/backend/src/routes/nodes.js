/* Машруты работы с файлами */

const router = require("express").Router();
const Node = require("../models/Node");
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/nodeController")

router.post("/heartbeat", async (req, res) => {
  const { nodeId } = req.body;

  const node = await Node.findByPk(nodeId);

  if (!node) {
    return res.status(404).json({ error: "node not registered" });
  }

  await node.update({
    status: "online",
    lastHeartbeat: new Date(),
  });

  res.json({ ok: true });
});

router.post("/register", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "no url" });

  const node = await Node.create({
    url,
    status: "online",
    lastHeartbeat: new Date(),
  });

  res.json({
    nodeId: node.id,
    url: node.url,
  });
});

router.get("/", auth, controller.getNodes);

router.get(
  "/distribution/:bucketId",
  auth,
  controller.getDistribution
);

module.exports = router;

