const express = require("express");
const dateForEventRouter = express.Router();
const DateForEvent = require("../models/dateForEventSchema");
const jwt = require("jsonwebtoken");
dateForEventRouter.use(express.json());
const tokenVerify = require("../verify")

dateForEventRouter.get("/dateForEvent/all", async (req, res) => {
  DateForEvent.find()
    .then((event) => res.json(event))
    .catch((err) => res.json(err));
});

dateForEventRouter.get("/dateForEvent/all/:id", async (req, res) => {
  DateForEvent.find({ idEvent: { $in: [req.params.id] } })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

dateForEventRouter.put("/dateForEvent/:id",tokenVerify, async (req, res) => {
  let id = req.user.user._id;

  const allDateForEvent = await DateForEvent.find({
    idEvent: { $in: [req.params.id] }
});
 const dateSearch = allDateForEvent.filter(e => e.date === req.body.date)

  if (dateSearch.length === 0) {
    const dateForEvent = new DateForEvent({
      user: [id],
      pseudo : req.body.pseudo,
      idEvent: req.params.id,
      date: req.body.date
    });
    dateForEvent.save();
    res.send("create");
  }
  if (dateSearch.length > 0) {
    const checkUserInArray = dateSearch.filter(e => e.pseudo.includes(req.body.pseudo));
    if (checkUserInArray.length > 0) {
      return res.send("already in your agenda");

    } else {
      DateForEvent.findOneAndUpdate( { _id: dateSearch[0]._id }, 
        { $push: { pseudo: req.body.pseudo , user : id} }
    )
    .then((NewUser) => res.json(NewUser))
    .catch((err) => res.json(err));
    }
  }
});

module.exports = dateForEventRouter;
