const {model,Schema} = require('mongoose')


const passwordResetSchema = new Schema({

    email :{ type :String , required :true},
    token :{type:String , unique : true, required : true}
})


module.exports = model('PasswordReset',passwordResetSchema)