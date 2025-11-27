const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/auth");

// @route   GET /api/messages
// @desc    Obter todas as mensagens do chat global
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const messages = await Message.find({})
      .populate("sender", "username avatar christmasColor")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar mensagens" });
  }
});

// @route   POST /api/messages
// @desc    Enviar mensagem no chat global
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { content, type } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Mensagem não pode estar vazia" });
    }

    const message = await Message.create({
      sender: req.user._id,
      content: content.trim(),
      type: type || "text",
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "username avatar christmasColor"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar mensagem" });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Deletar mensagem própria
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Mensagem não encontrada" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    await message.deleteOne();
    res.json({ message: "Mensagem deletada" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar mensagem" });
  }
});

module.exports = router;
