const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const jwtConfig = require("../config/jwt");

// 👇 подключаем email сервис
const {
  sendVerificationEmail,
} = require("../services/mailService");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verificationExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await User.create({
      email,
      password: hash,
      verified: false,
      verificationCode,
      verificationExpires,
    });

    // 📧 отправка email
    await sendVerificationEmail(email, verificationCode);

    return res.status(201).json({
      message:
        "Account created. Please verify your email.",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      error: "Failed to register user",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.verified) {
      return res.json({
        message: "Email already verified",
      });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({
        error: "Invalid verification code",
      });
    }

    if (
      user.verificationExpires &&
      new Date() > user.verificationExpires
    ) {
      return res.status(400).json({
        error: "Verification code expired",
      });
    }

    user.verified = true;
    user.verificationCode = null;
    user.verificationExpires = null;

    await user.save();

    return res.json({
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error("VERIFY ERROR:", err);

    return res.status(500).json({
      error: "Verification failed",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const ok = await bcrypt.compare(
      password,
      user.password
    );

    if (!ok) {
      return res.status(401).json({
        error: "Wrong password",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        error:
          "Please verify your email before signing in.",
      });
    }

    const token = jwt.sign(
      { id: user.id },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn,
      }
    );

    return res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      error: "Login failed",
    });
  }
};