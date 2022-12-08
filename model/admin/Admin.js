const {model,Schema}= require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const adminSchema = new Schema({
    username:{type:String, required : [true,'Please provide a username ']},
    email:{type :String , unique : true , required :[true,'Please provide a email']},
    password:{type :String, minLength : 8 , select:false , required :[true, 'Please provide a password']},
    phoneNumber:{type : String, minlength :11 , required :[true,'Please provide a phoneNumber']},
    role :{type:String , enum :['MANAGEMENT', 'ADMIN'],default :['ADMIN'],required :[true,'Please provide a role']},
    isActive:{type: Boolean, default: false, required:[true,'Please provide a isActive']},
    isVerified:{type: Boolean, default: false,required:[true,'Please provide a isVerified']}
},{
    timestamps : true
})


// middleware
adminSchema.pre('save',async function(next){

    if(!this.isModified('password')){
        next()
    }

    // hash password
    const salt = await bcrypt.genSalt(19)
    this.password = await bcrypt.hash(this.password,salt)

    return next()
})

// match password
adminSchema.methods.matchPassword = async function(password){
        return await bcrypt.compare(password,this.password)
}

//jwt
adminSchema.methods.getToken = async function(){
    return await jwt.sign({username : this.username},
        process.env.JWT_SECRET_ADMIN,
        {expiresIn: process.env.JWT_EXPIRE_ADMIN})
}


module.exports = model('Admin', adminSchema)