/* точка входа в машрутизацию проекта */

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const bucketRoutes = require("./routes/buckets");
const nodeRoutes = require("./routes/nodes");
const fileRoutes = require("./routes/files");
const userRoutes = require("./routes/user");

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});


app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/files", fileRoutes);
app.use("/nodes", nodeRoutes);
app.use("/buckets", bucketRoutes);

module.exports = app;