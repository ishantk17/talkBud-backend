const mongoose = require("mongoose");
const { bool, boolean } = require("yup");
const MessageSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },

  type: {
    type: Boolean,
  },
  message: {
    type: String,
  },

  createdAt: {
    type: Number,
    default: Date.now(),
  },
});
mongoose.model("messages", MessageSchema);
