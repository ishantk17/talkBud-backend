const { populate } = require("dotenv");
const messages = require("../../models/Message");
var cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const Message = mongoose.model("messages");
const yup = require("yup");

const fetchChats = async (req, res) => {
  const user = req.user;
  try {
    const chats = await Message.find({ user: user._id }).sort({ createdAt: 1 });
    return res.status(200).json({ chats });
  } catch (error) {
    return res.status(300).json({ error });
  }
};

module.exports = { fetchChats };
