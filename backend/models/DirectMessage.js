const mongoose = require("mongoose");

const directMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Mensagem não pode estar vazia"],
      maxlength: [500, "Mensagem muito longa"],
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["text", "emoji", "christmas-sticker"],
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

// Índice para buscar conversas entre dois usuários
directMessageSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model("DirectMessage", directMessageSchema);
