const {model,Schema} = require('mongoose')


const commentHomePageSchema = new Schema({
    textComments : {type : String , required : true},
    isApproved :{type :Boolean , default : false},
    userId :{type :Schema.Types.ObjectId , ref:'UserHomePage'},
    Likes :[{type : String}]
},{timestamps : true})

module.exports = model('CommentHomePage',commentHomePageSchema)