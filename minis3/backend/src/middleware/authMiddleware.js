/*
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "no token" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "invalid token" });
  }
};
*/

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Проверка токена
    if (!authHeader) {
      return res.status(401).json({
        error: "No token provided",
      });
    }

    // Bearer TOKEN
    const token = authHeader.replace("Bearer ", "");

    // Проверка JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // сохраняем пользователя
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};