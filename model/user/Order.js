const {model,Schema} = require('mongoose')


const orderSchema = new Schema({
    orderCompany :{type : String},
    orderWallet : {type : String, enum :['Digital currency','Currency paper'],default : null},
    walletId : {type : [Schema.Types.ObjectId], ref:'Wallet'},
    userId :{type :[Schema.Types.ObjectId], ref: 'User'}
},{timestamps : true})


module.exports = model('Order',orderSchema)