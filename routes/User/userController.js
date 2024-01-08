const { populate } = require("dotenv");
const users = require("../../models/User");
var cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const Users = mongoose.model("users");
const yup = require("yup");
console.log(users);

const login = async (req, res) => {
  const { email, name, picture } = req.body;
  const user = await Users.findOne({ email: email });
  if (user) {
    const token = jwt.sign({ _id: email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.setHeader("Access-Control-Expose-Headers", "*, authorization");
    res.setHeader("Authorization", "Bearer " + token);
    return res.status(200).json({ msg: "successfully logged in" });
  } else {
    const newUser = new Users({
      Name: name,
      email: email,
      image: picture,
    });

    try {
      await newUser.save();
      const token = jwt.sign({ _id: email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.setHeader("Access-Control-Expose-Headers", "*, authorization");
      res.setHeader("Authorization", "Bearer " + token);

      return res.status(200).json({ msg: "successfully logged in" });
    } catch (error) {
      console.log(error);
      return res.status(300).json({ msg: error });
    }
  }
};

module.exports = { login };
