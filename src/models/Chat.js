const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const namespaceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
  rooms: {
    type: [roomSchema],
    default: [],
  },
});

const model = mongoose.model("Namespace", namespaceSchema);

module.exports = model;
