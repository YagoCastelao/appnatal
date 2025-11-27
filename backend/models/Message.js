const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Mensagem não pode estar vazia"],
      maxlength: [500, "Mensagem muito longa"],
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

module.exports = mongoose.model("Message", messageSchema);
