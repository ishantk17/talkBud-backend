const { default: mongoose } = require("mongoose");
const Users = mongoose.model("users");
const jwt = require("jsonwebtoken");

const Auth = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    if (token == null) {
      return res.status(400).json({ msg: "unauthorized" });
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (verifyToken) {
      const user = await Users.findOne({ email: verifyToken._id });
      if (!user) {
        return res.status(400).json({ msg: "verification Failed" });
      }
      req.user = user;
      next();
    } else {
      return res.status(401).json({ msg: "unauthorized" });
    }
  } catch (error) {
    return res.status(400).json({ err: error.message });
  }
};
module.exports = { Auth };
