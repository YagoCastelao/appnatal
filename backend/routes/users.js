const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// @route   GET /api/users
// @desc    Obter todos os usuários (para lista do chat)
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ isOnline: -1, username: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
});

// @route   GET /api/users/online
// @desc    Obter usuários online
// @access  Private
router.get("/online", protect, async (req, res) => {
  try {
    const users = await User.find({ isOnline: true }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários online" });
  }
});

// @route   GET /api/users/:id
// @desc    Obter usuário específico
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário" });
  }
});

// @route   PUT /api/users/avatar
// @desc    Atualizar avatar do usuário
// @access  Private
router.put("/avatar", protect, async (req, res) => {
  try {
    const { avatar } = req.body;
    const christmasAvatars = [
      "🎅",
      "🤶",
      "🦌",
      "⛄",
      "🎄",
      "🎁",
      "👼",
      "❄️",
      "🔔",
      "⭐",
      "🕯️",
      "🧦",
    ];

    if (!christmasAvatars.includes(avatar)) {
      return res.status(400).json({ message: "Avatar inválido" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar avatar" });
  }
});

module.exports = router;
