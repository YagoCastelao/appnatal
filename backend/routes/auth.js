const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { generateToken, protect } = require("../middleware/auth");

// Avatares natalinos disponíveis
const christmasAvatars = ["🎅", "🤶", "🦌", "⛄", "🎄", "🎁", "👼", "❄️"];
const christmasColors = [
  "#c41e3a",
  "#165b33",
  "#bb2528",
  "#f8b229",
  "#ea4630",
  "#146b3a",
  "#ff6b6b",
  "#4ecdc4",
];

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar se já existem 8 usuários
    const userCount = await User.countDocuments();
    if (userCount >= 8) {
      return res.status(400).json({
        message: "🎄 O chat de Natal está cheio! Máximo de 8 participantes.",
      });
    }

    // Verificar se usuário já existe
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(400).json({
        message: "🎄 Usuário ou email já cadastrado!",
      });
    }

    // Atribuir avatar e cor baseado na quantidade de usuários
    const avatar = christmasAvatars[userCount % christmasAvatars.length];
    const christmasColor = christmasColors[userCount % christmasColors.length];

    const user = await User.create({
      username,
      email,
      password,
      avatar,
      christmasColor,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        christmasColor: user.christmasColor,
        token: generateToken(user._id),
        message: "🎄 Bem-vindo ao Chat de Natal!",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuário
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Atualizar status online
      user.isOnline = true;
      user.lastSeen = new Date();
      await user.save();

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        christmasColor: user.christmasColor,
        token: generateToken(user._id),
        message: "🎄 Feliz Natal! Você está logado!",
      });
    } else {
      res.status(401).json({ message: "🎄 Email ou senha inválidos" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Obter dados do usuário logado
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout do usuário
// @access  Private
router.post("/logout", protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      isOnline: false,
      lastSeen: new Date(),
    });
    res.json({ message: "🎄 Até logo! Feliz Natal!" });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

module.exports = router;
