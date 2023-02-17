const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  pseudo: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  age: { type: Number },
  email: { type: String, required: true },
  password: { type: String, required: true, minLength: 5 },
  confirm_password: { type: String, minLength: 5 },
  favoriteEvent: { type: Array },
  favoriteTag: { type: Array },
  eventInCalendar: { type: Array },
  profile_picture: {
    type: String,
    default: "/public/images/default_avatar.png",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
