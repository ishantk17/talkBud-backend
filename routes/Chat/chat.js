const express = require("express");
const { fetchChats } = require("./chatController");
const chatRouter = express.Router();
const bodyParser = require("body-parser");
const { Auth } = require("../../middlewares/auth");

const JSON = bodyParser.json();

chatRouter.get("/fetch", JSON,Auth,fetchChats);

module.exports = chatRouter;
