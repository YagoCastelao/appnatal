const express = require("express");
const router = express.Router();
const DirectMessage = require("../models/DirectMessage");
const { protect } = require("../middleware/auth");

// @route   GET /api/dm/conversations
// @desc    Obter lista de conversas do usuário
// @access  Private
router.get("/conversations", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Buscar conversas únicas
    const conversations = await DirectMessage.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessage: { $first: "$content" },
          lastMessageDate: { $first: "$createdAt" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", userId] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          lastMessageDate: 1,
          unreadCount: 1,
          "user.username": 1,
          "user.avatar": 1,
          "user.christmasColor": 1,
          "user.isOnline": 1,
        },
      },
      {
        $sort: { lastMessageDate: -1 },
      },
    ]);

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar conversas" });
  }
});

// @route   GET /api/dm/:userId
// @desc    Obter mensagens com um usuário específico
// @access  Private
router.get("/:userId", protect, async (req, res) => {
  try {
    const messages = await DirectMessage.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .populate("sender", "username avatar christmasColor")
      .populate("receiver", "username avatar christmasColor")
      .sort({ createdAt: 1 })
      .limit(100);

    // Marcar mensagens como lidas
    await DirectMessage.updateMany(
      { sender: req.params.userId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar mensagens" });
  }
});

// @route   POST /api/dm/:userId
// @desc    Enviar mensagem direta
// @access  Private
router.post("/:userId", protect, async (req, res) => {
  try {
    const { content, type } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Mensagem não pode estar vazia" });
    }

    const message = await DirectMessage.create({
      sender: req.user._id,
      receiver: req.params.userId,
      content: content.trim(),
      type: type || "text",
    });

    const populatedMessage = await DirectMessage.findById(message._id)
      .populate("sender", "username avatar christmasColor")
      .populate("receiver", "username avatar christmasColor");

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar mensagem" });
  }
});

module.exports = router;
