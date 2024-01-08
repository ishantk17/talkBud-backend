require("dotenv").config();
const cors = require("cors");
const OpenAI = require("openai");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const messages = require("./models/Message");
const Message = mongoose.model("messages");
const users = require("./models/User");
const Users = mongoose.model("users");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

connectDB();

app.use(express.json());
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const saveMessageToDatabase = async (user, type, message) => {
  try {
    const newMessage = new Message({
      user: user._id,
      type: type,
      message: message,
      createdAt: Date.now(),
    });

    const savedMessage = await newMessage.save();
    return savedMessage;
  } catch (error) {
    throw error;
  }
};

const main = async (message) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo",
    });
    console.log(chatCompletion.choices[0].message["content"]);
    return chatCompletion.choices[0].message["content"];
  } catch (error) {
    console.log(error);
    return "API limit excedded";
  }
};
const userRouter = require("./routes/User/user");
const chatRouter = require("./routes/Chat/chat");

const Auth = require("./middlewares/auth");
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 120000,
  cors: {
    origin: "*",

  },
});

io.on("connection", async (socket) => {
  const authToken = socket.handshake.query.authToken;
  try {
    const header = authToken;
    const token = header && header.split(" ")[1];
    console.log(token);
    if (token == null) {
      io.emit(
        "messageFromServer",
        "Message received on the server: " + "You are unauthorized"
      );
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (verifyToken) {
      const user = await Users.findOne({ email: verifyToken._id });
      if (!user) {
        io.emit(
          "messageFromServer",
          "Message received on the server: " +
            "your verification with the server failed"
        );
      }

      socket.on("messageFromClient", async (message) => {
        if (message === "") {
          io.emit("messageFromServer", "Please speak or type something...");
        } else {
          const resp = await main(message);

          const saveResp1 = await saveMessageToDatabase(user, true, message);
          const saveResp2 = await saveMessageToDatabase(user, false, resp);

          if (saveResp1 && saveResp2) {
            io.emit("messageFromServer", { token, resp });
          } else {
            io.emit(
              "messageFromServer",
              "Message received on the server: " +
                "chat can not be saved to database"
            );
          }
        }
      });
    } else {
      io.emit(
        "messageFromServer",
        "Message received on the server: " + "You are unauthorized"
      );
    }
  } catch (error) {
    io.emit(
      "messageFromServer",
      "Message received on the server: " + "some error with the server"
    );
  }
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});
