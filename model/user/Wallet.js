const {model,Schema} = require('mongoose')


const walletSchema = new Schema({
    statusWallet:{type:String},
    walletName:{type :String},
    orderId: {type:[Schema.Types.ObjectId] , ref :'Order'},
    userId : {type :Schema.Types.ObjectId, ref :'User'}

},{ timestamps: true })

module.exports = model('Wallet',walletSchema)