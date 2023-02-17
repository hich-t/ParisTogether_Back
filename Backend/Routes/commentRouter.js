const express = require("express");
const commentRouter = express.Router();
const Comment = require("../models/CommentsModel");
const jwt = require("jsonwebtoken");
commentRouter.use(express.json());
const tokenVerify = require("../verify")

commentRouter.get("/comment/:id", async (req, res) => {
  const commentExist = await Comment.findOne({ idEvent: req.params.id });
  if (commentExist) {
    Comment.find({ idEvent: { $in: [req.params.id] } })
      .then((comment) => res.json(comment))
      .catch((err) => res.json(err));
  }
  if (!commentExist) {
    res.send("No comments");
  }
});

commentRouter.post("/comment/:id",tokenVerify, async (req, res) => {
  let id = req.user.user._id;

  const comment = new Comment({
    pseudo: req.body.pseudo,
    date: Date.now(),
    comment: req.body.comment,
    userId: id,
    profile_picture: req.body.picture,
    idEvent: req.params.id,
  });

  comment.save()
  .then(comment => res.json(comment))
  .catch((err) => res.json(err));
});

module.exports = commentRouter;