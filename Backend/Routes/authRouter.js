const express = require("express");
const authRouter = express.Router();
const User = require("../models/UsersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { request } = require("express");
authRouter.use(express.json());
const multer = require("multer");
const tokenVerify = require("../verify")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },

  filename: function (req, file, cb) {
    console.log(file);
    cb(
      null,
      file.filename +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage: storage });

authRouter.post("/register", async (req, res) => {
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(409).send("Email already exist");
  if (req.body.password !== req.body.confirm_password)
    return res.status(409).send("Confirmation password is not Ok");
  if (!emailExist && req.body.password === req.body.confirm_password) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      pseudo: req.body.pseudo,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      age : req.body.age,
      email: req.body.email,
      password: hashPassword,
    });
    user.save();

    const token = jwt.sign({ user }, process.env.SECRET);
    res.header("auth-token", token);
    res.json(token);
  }
});

authRouter.get("/user/all",tokenVerify, (req, res) => {
  User.find()
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

authRouter.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found");
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Password is not valid");

  const token = jwt.sign({ user }, process.env.SECRET);
  res.header({ "auth-token": token });
  res.json(token);
});

authRouter.get("/user", tokenVerify, async (req, res) => {
    let id = req.user.user._id;

    User.findOne({ _id: id })
      .populate("favoriteEvent")
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  });

authRouter.get("/user/:id", async (req, res) => {

  User.findOne({ _id: req.params.id })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

authRouter.put("/user",tokenVerify, async (req, res) => {
  let id = req.user.user._id;

  let user = await User.findOne({ _id: id });
  if (
    req.body.favoriteEvent  &&
    user.favoriteEvent.includes(req.body.favoriteEvent)
  )
    return res.status(400).send("Already in your favorite");
  if (
    req.body.favoriteTag &&
    user.favoriteTag.includes(req.body.favoriteTag)
  )
    return res.status(400).send("Already in your favorite");

  User.findOneAndUpdate({ _id: id }, { $push: req.body })
    .then((NewUser) => res.json(NewUser))
    .catch((err) => res.json(err));
});

authRouter.put(
  "/uploadimage",
  upload.single("profile_picture"),tokenVerify,
  async (req, res) => {

    let id = req.user.user._id;
    console.log(req.file);
    try {
      const user = await User.findOne({ _id: id });
      await user.updateOne({
        $set: {
          profile_picture: "/public/images/" + req.file.filename,
        },
      });
      console.log(req.file.filename);
    } catch (err) {
      res.json(err);
    }
  }
);

authRouter.delete("/user", tokenVerify ,async (req, res) => {
  let id = req.user.user._id;
  User.findOneAndUpdate({ _id: id }, { $pull: req.body })
    .then((NewUser) => res.json(NewUser))
    .catch((err) => res.json(err));
});



authRouter.put("/update", tokenVerify ,async (req, res) => {
  let id = req.user.user._id;
  let user = await User.findOne({ _id: id });
  
  if (req.body.email) {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist && emailExist._id !== user._id)
      return res.status(409).send("Email already exists");

    user.email = req.body.email;
  }

  if (req.body.password && req.body.confirm_password) {
    if (req.body.password !== req.body.confirm_password)
      return res.status(409).send("Confirmation password is not Ok");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashPassword;
  }

  user.save();

  res.json({ message: "User information updated successfully" });
});

module.exports = authRouter;


