const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  idEvent: { type: String, required: true },
  comments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comments"
  }
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;