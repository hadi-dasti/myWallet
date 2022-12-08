const {model,Schema} = require('mongoose')

const homePageSchema = new Schema({
    USD :{type : String, required : true},
    price:{ type : String ,min:2, required : true},
    Exchange_rate:{type :Number, min :2, required : true},
    priceMonthly: {type :Number,required : true},
},
    { autoIndex: false , timestamps: true })


module.exports = model('PublicPage',homePageSchema)



