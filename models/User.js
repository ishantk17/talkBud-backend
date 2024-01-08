const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  gender: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Number,
    default: Date.now(),
  },
});
mongoose.model("users", UserSchema);
