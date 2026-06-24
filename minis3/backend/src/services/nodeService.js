const Node = require("../models/Node");
const axios = require("axios");
const FormData = require("form-data");
const Chunk = require("../models/Chunk");

async function getOnlineNodes(limit = 3) {
  console.log(">>> NODE QUERY START");

  const nodes = await Node.findAll({
    raw: true
  });

  console.log("ALL NODES RAW:", nodes);

  const filtered = nodes.filter(n =>
    (n.status || "").trim().toLowerCase() === "online"
  );

  console.log("ONLINE NODES:", filtered);

  return filtered.slice(0, limit);
}
// upload file to node
/*
async function uploadToNode(nodeUrl, fileBuffer, filename) {
  const form = new FormData();

  form.append("file", fileBuffer, filename);

  const res = await axios.post(`${nodeUrl}/store/upload`, form, {
    headers: form.getHeaders(),
  });

  return res.data;
}
*/

async function uploadToNode(nodeUrl, fileBuffer, filename) {
  const res = await axios.post(
    `${nodeUrl}/store/upload`,
    fileBuffer,
    {
      headers: {
        "Content-Type": "application/octet-stream",
        "x-filename": filename
      }
    }
  );

  return res.data;
}

async function getNodeStats() {
  const nodes = await Node.findAll({ raw: true });
  const chunks = await Chunk.findAll({ raw: true });

  const stats = {};

  for (const node of nodes) {
    stats[node.id] = {
      nodeId: node.id,
      status: node.status,
      chunksCount: 0,
      usedStorage: 0,
    };
  }

  for (const chunk of chunks) {
    if (!stats[chunk.nodeId]) continue;

    stats[chunk.nodeId].chunksCount += 1;
    stats[chunk.nodeId].usedStorage += chunk.size || 0;
  }

  return Object.values(stats);
}

module.exports = {
  getOnlineNodes,
  uploadToNode,
  getNodeStats,
};