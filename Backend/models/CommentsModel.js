const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentsSchema = new Schema({
    pseudo : {type : String,required : true},
    date : {type : Date, default : Date.now()},
    comment : {type : String, default : true},
    userId : {
        type : mongoose.Schema.Types.ObjectId, ref : 'User',required : true
    },
    profile_picture : {
        type: String,
        default: "/public/images/default_avatar.png",
      },
    idEvent : { type: String, required: true }
})

const Comments = mongoose.model('Comments', commentsSchema)
module.exports = Comments