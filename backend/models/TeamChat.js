const mongoose = require("mongoose");

const teamChatSchema = new mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    roomName: {
      type: String,
      required: true,
    },

    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        senderRole: String,

        // ✅ ADD THIS LINE
        senderName: String,

        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamChat", teamChatSchema);
