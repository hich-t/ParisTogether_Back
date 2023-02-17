const express = require("express");
const eventRouter = express.Router();
const Event = require("../models/EventModel");
const jwt = require("jsonwebtoken");
eventRouter.use(express.json());

eventRouter.get("/event/all", async (req, res) => {
  Event.find()
    .then((event) => res.json(event))
    .catch((err) => res.json(err));
});

eventRouter.get("/event/:id", async (req, res) => {
  const eventExist = await Event.findOne({ idEvent: req.params.id });
  if (eventExist) {
    Event.findOne({ idEvent: req.params.id })
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  }
  if (!eventExist) {
    const event = new Event({
      idEvent: req.params.id,
    });
    event
      .save()
      .then((res) => res.json(event))
      .catch((err) => res.json(err));
  }
});

module.exports = eventRouter;
