const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateforEventSchema = new Schema({
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  pseudo : {type :Array , required : true},
  idEvent: {
    type : String ,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

const DateForEvent = mongoose.model('DateForEvent', dateforEventSchema);

module.exports = DateForEvent;