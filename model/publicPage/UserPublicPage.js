const {model,Schema} = require('mongoose')
const jwt = require('jsonwebtoken')

const userHomePageSchema = new Schema({
    nickName :{type:String, required : true},
    TelMobile :{type : String ,  min : 11 , required : true},
    comment :{ type :[Schema.Types.ObjectId], ref:'CommentHomePage'},
    // likes :{type : [Schema.Types.ObjectId],ref:'CommentHomePage'}
},{timestamps : true})


//jwt
userHomePageSchema.methods.getToken = async function(){
    return await jwt.sign({TelMobile : this.TelMobile}
        ,process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE})
}

module.exports = model('UserHomePage',userHomePageSchema)