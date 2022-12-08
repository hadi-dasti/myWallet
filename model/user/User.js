const {Schema,model} = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    firstName : {type : String, required : true},
    lastName : {type : String, required : true},
    email : {type : String, unique: true, required : true},
    password : {type : String, min : 6, required : true},
    phoneNumber : {type : String , min : 8 , required : true},
    nationalCode: {type: String, required: true, min: 8, index: true},
    gender: {type: String, enum: ['MALE','FEMALE'], required: true, default: null},
    photo : {type : String},
},{timestamps : true})

// require middleware mongoose
userSchema.pre('save',async function(next){
        if(!this.isModified('password')){
            next()
        }
    // hash password
     const salt = await bcrypt.genSalt(10)

    this.password = await bcrypt.hash(this.password,salt)

     return next()
})

//match password
userSchema.methods.matchPasswords = async function(password){
        return await bcrypt.compare(password,this.password)
}

// jwt
userSchema.methods.getSignToken = function(){
    return jwt.sign({id: this._id}
             ,process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRE})
}

module.exports = model('User',userSchema)